# app/serializers.py
from rest_framework import serializers
from .models import Comment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['_id', 'user', 'created_at', 'likes', 'replies']
        
    def validate(self, data):
        count = sum([
            bool(data.get('manga')),
            bool(data.get('novel')),
            bool(data.get('manga_chapter')),
            bool(data.get('novel_chapter')),
        ])
        if count != 1:
            raise serializers.ValidationError("Only one field")
        return data
    

    def get_replies(self, obj):
        queryset = obj.replies.all().order_by('created_at')
        return CommentSerializer(queryset, many=True, context=self.context).data

    target_type = serializers.SerializerMethodField()
    def get_target_type(self, obj):
        if obj.manga:
            return 'manga'
        elif obj.novel:
            return 'novel'
        elif obj.manga_chapter:
            return 'manga_chapter'
        elif obj.novel_chapter:
            return 'novel_chapter'
        return None
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)

