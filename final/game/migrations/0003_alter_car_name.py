# Generated by Django 5.0.2 on 2024-03-03 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_car_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='car',
            name='name',
            field=models.CharField(blank=True, max_length=145, null=True),
        ),
    ]
