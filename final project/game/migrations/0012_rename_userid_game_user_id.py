# Generated by Django 5.0.2 on 2024-03-19 18:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0011_remove_car_year'),
    ]

    operations = [
        migrations.RenameField(
            model_name='game',
            old_name='userId',
            new_name='user_id',
        ),
    ]