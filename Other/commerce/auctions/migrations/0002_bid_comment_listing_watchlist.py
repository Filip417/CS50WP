# Generated by Django 5.0.2 on 2024-02-25 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.PositiveIntegerField()),
                ('auctionId', models.PositiveIntegerField()),
                ('bid', models.PositiveIntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.PositiveIntegerField()),
                ('auctionId', models.PositiveIntegerField()),
                ('comment', models.CharField(max_length=512)),
            ],
        ),
        migrations.CreateModel(
            name='Listing',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=64)),
                ('description', models.CharField(max_length=512)),
                ('price', models.PositiveIntegerField()),
                ('image', models.ImageField(upload_to='uploads/')),
                ('listedBy', models.PositiveIntegerField()),
                ('category', models.CharField(max_length=64)),
                ('dateCreated', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Watchlist',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.PositiveIntegerField()),
                ('auctionId', models.PositiveIntegerField()),
            ],
        ),
    ]
