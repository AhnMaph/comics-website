from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from manga.serializers import MangaSerializer

from .models import *


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']
    def get_token(self,obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    

class FavoriteSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Favorite
        fields = '__all__'
    def get_user(self,obj):
        user = obj.user
        serializers = UserSerializer(user,many=False)
        return serializers.data
# class CommentsSerializer(serializers.ModelSerializer):
#     user = serializers.SerializerMethodField(read_only=True)
#     class Meta:
#         model = Comments
#         fields = ['post_id','content','type','parent']
#         read_only_fields = ['createdAt', 'user']
#     def get_user(self,obj):
#         user = obj.user
#         serializers = UserSerializer(user,many=False)
#         return serializers.data
class LikeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Likes
        fields = '__all__'
    def get_user(self,obj):
        user = obj.user
        serializers = UserSerializer(user,many=False)
        return serializers.data