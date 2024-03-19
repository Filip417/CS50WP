from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

#auction listings model (incl. categories)
class Listing(models.Model):
    title = models.CharField(max_length=64)
    description = models.CharField(max_length=512)
    startingBid = models.PositiveIntegerField()
    image = models.ImageField(upload_to='uploads/', null=True, blank=True)
    category = models.CharField(max_length=64, null=True, blank=True)
    price = models.PositiveIntegerField(null=True, blank=True)
    listedBy = models.ForeignKey(User, on_delete=models.CASCADE)
    dateCreated = models.DateField()
    active = models.BooleanField()
    winner = models.CharField(max_length=100, null=True, blank=True, default=None)

#bids model
class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auctionId = models.PositiveIntegerField()
    bid = models.PositiveIntegerField()

#comments model
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auctionId = models.PositiveIntegerField()
    comment = models.CharField(max_length=512)

#watchlist model
class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    auctionId = models.PositiveIntegerField()


#make sure to run python manage.py makemigrations and python manage.py migrate
#after changes are made to the models file.