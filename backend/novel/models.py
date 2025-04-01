from django.db import models
import uuid
from .models import Genre

# Create your models here. hacked by zpotassium
class Genre(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Story(models.Model):
    _id = models.UUIDField(default = uuid.uuid4, unique = True, primary_key = True, editable = False)
    title = models.CharField(max_length=200)
    views = models.CharField(max_length=50)
    stars = models.CharField(max_length=50)
    comments = models.CharField(max_length=50)
    hanViet = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    latest_chapter = models.CharField(max_length=100)
    last_update = models.DateField()
    thanks = models.IntegerField(default=0)
    description = models.TextField()
    genres = models.ManyToManyField(Genre, related_name = "Stories")

    def __str__(self):
        return self.title