from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("",views.index,name="index"),
    path("search/<str:input>/<str:type>",views.search,name="search"),
    path("search//<str:type>",views.search_blank,name="search_blank"),
    path("answer/<str:input>",views.answer,name="answer"),
    path('get-all-car-names/<str:type>',views.get_all_car_names,name="get_all_car_names"),
    path("guess-span/<str:input>/<str:answer>",views.guess_span,name="guess_span"),
    path("get-stats/<str:id>",views.get_stats,name="get_stats"),
    path("save-game/",views.save_game, name="save_game"),
    path("set-language/",views.set_language,name="set_language"),
    path('switch-mode/<str:mode>/', views.switch_mode, name='switch_mode'),
    path('switch-units/<str:units>/', views.switch_units, name='switch_units'),
    path('switch-type/<str:type>/', views.switch_type, name='switch_type'),
]
