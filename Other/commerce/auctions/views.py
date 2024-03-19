from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import Listing, Watchlist, Bid, Comment
from .models import User
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required

def index(request):
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings
    })


def categories(request):
    categories = Listing.objects.values_list('category', flat=True).distinct()
    return render(request,"auctions/categories.html", {"categories":categories})

def category(request,category):

    listings = Listing.objects.filter(category=category)
    return render(request,"auctions/category.html", {"listings":listings,"category":category})

@login_required
def watch(request):
    my_watch = Watchlist.objects.filter(user=request.user)
    listings = []
    for element in my_watch:
        listings.append(Listing.objects.filter(id=element.auctionId).first())
    return render(request,"auctions/watch.html",{"listings":listings})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

@login_required
def create(request):
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST["description"]
        startingBid = request.POST["startingBid"]
        image = request.FILES.get("image",None)
        category = request.POST["category"]
        listedBy = request.user
        dateCreated = timezone.now()

        if None not in (title, description, startingBid):
            #How to add this to model database in django now
            new_listing = Listing(
                title=title,
                description=description,
                startingBid=startingBid,
                image=image,
                category=category,
                listedBy =  listedBy,
                dateCreated = dateCreated,
                active = True
            )
            new_listing.save()
            return HttpResponseRedirect(reverse("index"))

    return render(request,"auctions/create.html")


def listing(request,listing_id):
    try:
        # Attempt to retrieve the listing object
        listing = Listing.objects.get(pk=listing_id)
        winner = listing.winner
    except ObjectDoesNotExist:
        # If the listing does not exist, redirect to the index page
        return HttpResponseRedirect(reverse("index"))


    #define default variables
    message = None

    # Check if the user is authenticated
    if request.user.is_authenticated:
        # Check if the listing is in the user's watchlist
        in_watchlist = Watchlist.objects.filter(user=request.user, auctionId=listing_id).exists()
    else:
        in_watchlist = False

    if request.method == "POST":
        if request.POST.get("add") =='':
            # Add the listing to the user's watchlist
            if not in_watchlist:
                new_watchlist = Watchlist(user=request.user, auctionId=listing_id)
                new_watchlist.save()
            # Redirect to the same page after handling the POST request to prevent form resubmission
            return HttpResponseRedirect(reverse("listing", args=[listing_id]))
        elif request.POST.get("remove") == '':
            # Remove the listing from the user's watchlist
            Watchlist.objects.filter(user=request.user, auctionId=listing_id).delete()
            # Redirect to the same page after handling the POST request to prevent form resubmission
            return HttpResponseRedirect(reverse("listing", args=[listing_id]))
        if request.POST.get("bid"):
            bid = int(request.POST["bid"])
            listing = Listing.objects.get(id=listing_id)
            price = listing.price
            startingBid = int(listing.startingBid)
            if bid >= startingBid and (price is None or bid > price):
                new_bid = Bid(user=request.user, auctionId=listing_id,bid=bid)
                new_bid.save()
                listing.price = bid
                listing.save()
            else:
                print("error message")
                message = "Incorrect bid value, starting bid price or current price is higher than proposed bid"
        if request.POST.get("end") =='':
            listing = Listing.objects.get(id=listing_id)
            listing.active = False
            listing.save()
            listing = Listing.objects.get(id=listing_id)
            allbids = Bid.objects.filter(auctionId=listing_id)
            for bid in allbids:
                if listing.price == bid.bid:
                    listing.winner = bid.user.username
                    winner = bid.user.username
                    listing.save()
                    break
        comment = request.POST.get("comment")
        if comment is not None:
            new_comment = Comment(user=request.user, auctionId=listing_id,comment=comment)
            new_comment.save()
    
    comments = Comment.objects.filter(auctionId=listing_id)
    print(f"winner: {winner}")

    return render(request,"auctions/listing.html",{
        "listing":listing,
        "in_watchlist":in_watchlist,
        "message":message,
        "winner":winner,
        "comments":comments
        })

