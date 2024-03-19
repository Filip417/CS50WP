from django.shortcuts import render, redirect
from django.contrib import messages
import random
from django.http import HttpResponseRedirect
from django.urls import reverse
import markdown2
from . import util


def index(request):
    if request.method == "GET":
            title = request.GET.get('q')
            entries = util.list_entries()
            if title is not None and title.lower() in (entry.lower() for entry in entries):
                return render(request,"encyclopedia/title.html", {
                    "entry": markdown2.markdown(util.get_entry(title)),
                    "title": title
                })
            elif title is not None:
                searchResults = []
                for entry in entries:
                    if title.lower() in entry.lower():
                         searchResults.append(entry)
                return render(request,"encyclopedia/index.html", {"entries": searchResults})
            
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })



def title(request,title):
    return render(request,"encyclopedia/title.html", {
        "entry": markdown2.markdown(util.get_entry(title)),
        "title":title
    })

def new(request):
    if request.method == "POST":
         title = request.POST.get('title')
         description = request.POST.get('content')
         entries = util.list_entries()
         if title is not None and description is not None:
            if any(entry.lower() == title.lower() for entry in entries):
                #if title exists then present error message
                messages.error(request, 'Entry already in data. Please try again with different title or go to title page to edit.')
                return redirect('index')
            else:
                #else save new entry on the disk and redirect to new entry title page
                util.save_entry(title, description)
                return HttpResponseRedirect(reverse('title', args=[title]))
    return render(request,"encyclopedia/new.html")

def edit(request, title):
    if request.method == "POST":
        description = request.POST.get('content')
        if description is not None:
            util.save_entry(title, description)
            return HttpResponseRedirect(reverse('title', args=[title]))
    return render(request,"encyclopedia/edit.html", {
        "entry": util.get_entry(title),
        "title":title
    })

def random2(request):
    entries = util.list_entries()
    title = random.choice(entries)
    return render(request,"encyclopedia/title.html", {
        "entry": markdown2.markdown(util.get_entry(title)),
        "title":title
    })