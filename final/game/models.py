from django.db import models

# Create your models here.


class Car(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=145, null=True, blank=True)
    car_make = models.CharField(max_length=50)
    car_model = models.CharField(max_length=50)
    engine_size = models.FloatField()
    horse_power = models.PositiveIntegerField()
    torque = models.PositiveIntegerField()
    zero_sixty = models.FloatField()
    price = models.PositiveIntegerField()
    country = models.CharField(max_length=50,null=True, blank=True)

    def __str__(self):
        return f"ID: {self.id} Car: {self.name}"
    
class Game(models.Model):
    user_id = models.CharField(max_length=30)
    win = models.BooleanField()
    guesses = models.PositiveIntegerField()
    answer = models.PositiveIntegerField()
    type = models.CharField(max_length=30, null=True, blank=True)