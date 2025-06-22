from rest_framework import serializers
from .models import Manga
from genres.serializers import GenresSerializer
class MangaSerializer(serializers.ModelSerializer):
    genres = GenresSerializer(many=True, read_only=True)
    class Meta:
        model = Manga
        fields = '__all__'
        read_only_fields = ['_id', 'created_at', 'updated_at', 
                            'uploader', 'numViews', 'numFavorites', 
                            'numComments', 'numChapters', 'numLikes', 
                            'averageRating', 'numRatings']
