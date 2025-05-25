# forum/serializers.py
from rest_framework import serializers
from .models import Post, PostComment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PostCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Hiển thị thông tin user
    class Meta:
        model = PostComment
        fields = ['id', 'user', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)  # Hiển thị thông tin tác giả
    comments = PostCommentSerializer(many=True, read_only=True)  # Liệt kê comment của bài post

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'created_at', 'comments']
