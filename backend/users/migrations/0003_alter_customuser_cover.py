# Generated by Django 4.2.20 on 2025-05-28 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_customuser_cover'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='cover',
            field=models.ImageField(default='covers/default.jpg', upload_to='covers/'),
        ),
    ]
