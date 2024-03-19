# Generated by Django 5.0.2 on 2024-02-29 21:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='Follow',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='follower', to=settings.AUTH_USER_MODEL)),
                ('user_follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_followed', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
