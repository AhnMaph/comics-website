from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import uuid
from manga.models import *
from django.contrib.auth.models import AbstractUser
from django.conf import settings
# from django.contrib.auth.models import User

class CustomUser(AbstractUser):
    cover = models.ImageField(upload_to='user_covers/', null=False ,default='user_covers/default.jpg')
    bio = models.TextField(blank=True, null=True, default ="Tiểu sử của bạn ở đây")
    def __str__(self):
        return self.username
    def save(self, *args, **kwargs):
        print("----[SAVE CALLED]----")
        print("self.pk:", self.pk)
        print("self.cover:", self.cover)
        print("type(self.cover):", type(self.cover))
        try:
            old_user = CustomUser.objects.get(pk=self.pk)
            if old_user.cover and self.cover != old_user.cover:
                # Kiểm tra nếu ảnh cũ khác ảnh mặc định thì xóa
                default_path = os.path.join('covers', 'default.jpg')
                if old_user.cover.name != default_path and os.path.isfile(old_user.cover.path):
                    os.remove(old_user.cover.path)
        except CustomUser.DoesNotExist:
            pass  # User mới, không cần kiểm tra ảnh cũ

        super().save(*args, **kwargs)

class Favorite(models.Model):
    FAVORITE_TYPE = [
        ('novel', 'Tiểu thuyết'),
        ('manga', 'Manga'),
        ('audio', 'Audio'),
        ('forum', 'Diễn đàn'),
    ]
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, 
                                     related_name='favorite_post_type', 
                                     null=True,  
                                     blank=True )
    object_id = models.UUIDField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=20,
        choices=FAVORITE_TYPE,
        default='novel'
    ) # tăng tốc độ truy xuất 
    def __str__(self):
        return str(self.user)
 

class Comments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # For any type of post
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, 
                                     related_name='comment_post_type', 
                                     null=True,  
                                     blank=True )
    object_id = models.UUIDField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return f"{self.user} - {self.content[:100]}..."
        
class Likes(models.Model):
    LIKE_PLACES = [
        ('novel', 'Tiểu thuyết'),
        ('manga', 'Manga'),
        ('audio', 'Audio'),
        ('forum', 'Diễn đàn'),
    ]
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post_id = models.CharField(blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=20,
        choices=LIKE_PLACES,
        default='novel'
    ) # tăng tốc độ truy xuất 
    def __str__(self):
        return f"{self.user}"
    class Meta:
        unique_together = ('user', 'post_id')

class Notification(models.Model):
    NOTIFY_TYPE = [
        ('chapter_update', 'Truyện đã cập nhật'),
        ('comment_reply', 'Comment được reply'),
    ]
    _id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    link = models.URLField()
    seen = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.message}"
