# Generated by Django 4.2.20 on 2025-04-04 09:48

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('genres', '0005_remove_genre_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Novel',
            fields=[
                ('_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('title', models.CharField(max_length=500)),
                ('author', models.CharField(max_length=500)),
                ('description', models.TextField()),
                ('cover_image', models.ImageField(blank=True, default='novel_covers/default.jpg', upload_to='novel_covers/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('source', models.CharField(default='Không rõ', max_length=500)),
                ('numComments', models.IntegerField(blank=True, default=0, null=True)),
                ('numViews', models.IntegerField(blank=True, default=0, null=True)),
                ('numFavorites', models.IntegerField(blank=True, default=0, null=True)),
                ('numChapters', models.IntegerField(blank=True, default=0, null=True)),
                ('numLikes', models.IntegerField(blank=True, default=0, null=True)),
                ('status', models.CharField(choices=[('completed', 'Hoàn thành'), ('ongoing', 'Còn tiếp'), ('paused', 'Tạm ngưng'), ('unverified', 'Chưa xác minh')], default='unverified', max_length=20)),
                ('genres', models.ManyToManyField(blank=True, related_name='genres', to='genres.genre')),
            ],
        ),
    ]
