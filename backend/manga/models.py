from django.db import models
import uuid
from genres.models import Genre
from django.contrib.auth.models import User
from django.conf import settings
import os
class Manga(models.Model):
    _id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    STATUS_CHOICES = [
        ('completed', 'Hoàn thành'),
        ('ongoing', 'Còn tiếp'),
        ('paused', 'Tạm ngưng'),
        ('unverified', 'Chưa xác minh'),
    ]
    
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL,
                                 on_delete=models.CASCADE,
                                 null=False,
                                 default=1)
    title = models.CharField(max_length=500)
    author = models.CharField(max_length=500) 
    description = models.TextField()
    cover_image = models.ImageField(max_length=500,upload_to='manga_covers/', default='manga_covers/default.jpg', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    genres = models.ManyToManyField(
        Genre, related_name='manga_genres', blank=True)
    source = models.CharField(max_length=500,default='Không rõ')
    numComments = models.IntegerField(default=0)
    numViews = models.IntegerField(default=0)
    numFavorites = models.IntegerField(default=0)
    numChapters = models.IntegerField(default=0)
    numLikes = models.IntegerField(default=0)
    averageRating = models.FloatField(default=0.0)
    numRatings = models.IntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='unverified'
    )
    def __str__(self):
        return self.title
