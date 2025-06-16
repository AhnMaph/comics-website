from rest_framework import serializers
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model
from .models import *


class UserSerializer(serializers.ModelSerializer):
    cover = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id','email', 'username','cover','groups','date_joined','bio']
        read_only_fields = ['id','date_joined']
    def get_cover(self, obj):
        request = self.context.get("request", None)
        print("Request in UserSerializer:", request)
        if request and obj.cover and hasattr(obj.cover, "url"):
            return request.build_absolute_uri(obj.cover.url)
        elif obj.cover and hasattr(obj.cover, "url"):
            return obj.cover.url  # fallback to relative URL
        return None

class FavoriteSerializer(serializers.ModelSerializer):
    # user = serializers.SerializerMethodField(read_only=True)
    post = serializers.SerializerMethodField(read_only=True)
    target_model = serializers.CharField(write_only=True)
    target_object_id = serializers.UUIDField(write_only=True)
    numFavorites = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Favorite
        fields = ['post','target_model', 
                  'target_object_id','numFavorites']
        read_only_fields = ['post','numFavorites']
    def get_user(self,obj):
        user = obj.user
        serializers = UserSerializer(user,many=False,context=self.context)
        return serializers.data
    def get_post(self, obj):
        target = obj.content_object  # lấy đối tượng gốc từ GenericForeignKey

        if target is None:
            return None

        # Gọi đúng serializer theo loại model
        if target._meta.model_name == 'novel':
            from novel.serializers import NovelSerializer
            return NovelSerializer(target, context=self.context).data
        elif target._meta.model_name == 'manga':
            from manga.serializers import MangaSerializer
            return MangaSerializer(target, context=self.context).data

        # fallback nếu không có serializer tương ứng
        return {"id": str(target.pk), "type": target._meta.model_name}
    def get_numFavorites(self, obj):
        # Lấy target object
        target = obj.content_object
        if hasattr(target, 'numFavorites'):
            return target.numFavorites
        return 0
    def create(self, validated_data):
        validated_data.pop('target_model')
        validated_data.pop('target_object_id')
        validated_data['user'] = self.context['request'].user
        return Favorite.objects.create(**validated_data)

class CommentsSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    target_model = serializers.CharField(write_only=True)
    target_object_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Comments
        fields = ['id', 'user', 'content','created_at', 'parent',
                  'target_model', 'target_object_id']
        read_only_fields = ['id','user','created_at']
    def get_user(self,obj):
        user = obj.user
        serializers = UserSerializer(user,many=False,context=self.context)
        return serializers.data
    def validate_text(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Comment must be at least 3 characters long.")
        return value
    def create(self, validated_data):
        model_name = validated_data.pop('target_model').lower()
        object_id = validated_data.pop('target_object_id')
        try:
            content_type = ContentType.objects.get(model=model_name)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError({"target_model": "Invalid model name."})
        model_class = content_type.model_class()
        if not model_class.objects.filter(pk=object_id).exists():
            raise serializers.ValidationError({"target_object_id": "Target object does not exist."})

        # Tạo comment
        return Comments.objects.create(
            content_type=content_type,
            object_id=object_id,
            **validated_data
        )
class LikeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Likes
        fields = '__all__'
    def get_user(self,obj):
        user = obj.user
        serializers = UserSerializer(user,many=False,context=self.context)
        return serializers.data

class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Notification
        fields = '__all__'
    def get_user(self, obj):
        user = obj.user
        serializers = UserSerializer(user, many=False, context=self.context)
        return serializers.data