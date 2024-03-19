from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<str:title>", views.title,name="title"),
    path("new/",views.new,name="new"),
    path("edit/<str:title>",views.edit,name="edit"),
    path("random/",views.random2,name="random")
]
