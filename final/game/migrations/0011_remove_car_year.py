# Generated by Django 5.0.2 on 2024-03-18 15:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0010_game_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='car',
            name='year',
        ),
    ]