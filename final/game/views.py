from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.core import serializers
from django.db.models import Max, Sum, Count, Case, When, QuerySet
from django.utils.translation import activate
from django.utils.translation import gettext as _
from django.conf import settings
from .models import Car, Game
import json

CAR_QUERIES = {
    'All': Car.objects.all(),
    'German': Car.objects.filter(country='Germany'),
    'British': Car.objects.filter(country='UK'),
    '500hp+': Car.objects.filter(horse_power__gt=500)
}

def get_cars_by_type(car_type: str, **filters) -> QuerySet:
    queryset = CAR_QUERIES.get(car_type)
    if queryset is None:
        queryset = Car.objects.filter(**filters)
    else:
        queryset = queryset.filter(**filters)
    return queryset

def index(request):
    language = get_language(request)
    activate(language)
    mode = request.session.get('mode', settings.DEFAULT_MODE)
    units = request.session.get('units',settings.DEFAULT_UNITS)
    type = request.session.get('type', settings.DEFAULT_TYPE)
    carsIds = list(get_cars_by_type(type).values_list('id', flat=True))
    
    context = {
        'LANGUAGES': settings.LANGUAGES,
        'mode':mode,
        'units':units,
        'type':type,
        'carsIds': carsIds,
    }
    return render(request, "game/index.html", context)

def search(request, input, type):
    results = get_cars_by_type(type, name__icontains=input)
    data = sorted([{'car_make':obj.car_make,'name': obj.name, 'id': obj.id} for obj in results], key=lambda x: x['name'])
    return JsonResponse(data, safe=False)

def search_blank(request, type):
    results = get_cars_by_type(type)
    data = sorted([{'car_make':obj.car_make,'name': obj.name, 'id': obj.id} for obj in results], key=lambda x: x['name'])
    return JsonResponse(data, safe=False)

def answer(request, input): 
    car = get_object_or_404(Car, name=input)
    return JsonResponse(car.id, safe=False)

def get_all_car_names(request, type):
    input_value = request.GET.get('input', '')
    car_names = get_cars_by_type(type, name__icontains=input_value).values_list('name', flat=True)
    return JsonResponse(list(car_names), safe=False)

def guess_span(request, input, answer):
    data_i = Car.objects.filter(id=input)
    data_a = Car.objects.filter(id=answer)
    input_data = serializers.serialize('json', data_i)
    answer_data = serializers.serialize('json', data_a)
    return JsonResponse({'input_data': input_data, 'answer_data': answer_data})
    
def get_stats(request, id=None):
        # Retrieve data for the current user
    current_user_data = (
            Game.objects.filter(user_id=id)
            .annotate(
                games_played=Count('id'),
                games_won=Count(Case(When(win=True, then=1))),
                total_guesses=Sum('guesses'),
                one_guess_wins=Count(Case(When(win=True, guesses=1, then=1))),
                favourite_type=Max('type')
            )
            .values('user_id', 'games_played', 'games_won', 'total_guesses', 'one_guess_wins')
            .first()
        )
    # Retrieve data for the top 10 users sorted by gamesPlayed
    top_10_users = (
        Game.objects.values('user_id')
        .annotate(
            games_played=Count('id'),
            games_won=Count(Case(When(win=True, then=1))),
            total_guesses=Sum('guesses'),
            one_guess_wins=Count(Case(When(win=True, guesses=1, then=1))),
            favourite_type=Max('type')
        )
        .order_by('-games_played')[:10]
    )
    # Extract user IDs of top 10 users
    top_10_user_ids = [user['user_id'] for user in top_10_users]
    top_10_users_list = list(top_10_users)
    # Check if the current user is in the top 10 users
    if id not in top_10_user_ids and current_user_data != None:
        # If not, add the current user's data to the list
        top_10_users_list.append(current_user_data)
    # If the current user is in the top 10 users, keep the list unchanged
    top_10_users = json.dumps(top_10_users_list)
    # Construct JSON response
    response_data = {
        'topUsers': top_10_users
    }
    return JsonResponse(response_data, safe=False)


def save_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id_value = data['userId']
        win_value = data['win']
        guesses_value = data['guesses']
        answer_value = data['answer']
        type_value = data['type']

        # Create and save the model instance
        instance = Game(user_id=user_id_value, win=win_value, guesses=guesses_value,answer=answer_value, type=type_value)
        instance.save()

        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method to save game'})
    

def set_language(request):
    if request.method == 'POST':
        language = request.POST.get('language')
        if language:
            activate(language)
            request.session[settings.LANGUAGE_SESSION_KEY] = language
            return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid language selection'}, status=400)

def get_language(request):
    language = request.session.get(settings.LANGUAGE_SESSION_KEY)
    return language

def switch_mode(request, mode):
    if mode in ['light', 'dark']:
        request.session['mode'] = mode
    return redirect('index')

def switch_units(request, units):
    if units in ['metric', 'imperial']:
        request.session['units'] = units
    return redirect('index')

def switch_type(request, type):
    if type in ['All', 'German', 'British', '500hp+']:
        request.session['type'] = type
    return redirect('index')