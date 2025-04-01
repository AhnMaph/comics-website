from rest_framework import serializers
from .models import Genre, Story
from .serializers import GenresSerializer

class StorySerializers(serializers.ModelSerializer):
    Genre = GenresSerializer(many = True)
    class Meta:
        model = Story
        field = '__all__'