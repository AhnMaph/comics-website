from django.db import models
from django.contrib.auth.models import User
import uuid

from manga.models import *
# class User(models.Model):
#     _id = models.UUIDField(default=uuid.uuid4,  unique=True,
#                            primary_key=True, editable=False)
#     username = models.CharField(max_length=200, null=True, blank=True)
#     email = models.EmailField(max_length=200, null=True, blank=True)
#     password = models.CharField(max_length=200, null=True, blank=True)
#     isAdmin = models.BooleanField(default=False)
#     createdAt = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.username

#     def has_perm(self, perm, obj=None):
#         return self.isAdmin

#     def has_module_perms(self, app_label):
#         return True

    # @property
    # def token(self):
    #     return ''
# Create your models here.


class Favorite(models.Model):
    FAVORITE_TYPE = [
        ('novel', 'Tiểu thuyết'),
        ('manga', 'Manga'),
        ('audio', 'Audio'),
        ('forum', 'Diễn đàn'),
    ]
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    story_id = models.CharField(max_length=255, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=20,
        choices=FAVORITE_TYPE,
        default='novel'
    ) # tăng tốc độ truy xuất 
    def __str__(self):
        return str(self.user)


# class Comments(models.Model):
#     COMMENT_PLACES = [
#         ('novel', 'Tiểu thuyết'),
#         ('manga', 'Manga'),
#         ('audio', 'Audio'),
#         ('forum', 'Diễn đàn'),
#     ]
#     _id = models.UUIDField(default=uuid.uuid4,  unique=True,
#                            primary_key=True, editable=False)
#     post_id = models.CharField(max_length=255, blank=True)
#     # post_id là id của post mà comment này thuộc về có thể là manga hoặc novel, audio gì đó
#     user = models.ForeignKey(User,on_delete=models.CASCADE,null=True) # khóa ngoại
#     parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies') 
#     # parent là comment được réply
#     # nếu không có thì là null
#     content = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     type = models.CharField(
#         max_length=20,
#         choices=COMMENT_PLACES,
#         default='novel'
#     ) # tăng tốc độ truy xuất 
#     def __str__(self):
#         return f"{self.user} - Content {self.content} - {self.user.username}"
#     def get_replies(self):
#         return self.replies.all()

        
class Likes(models.Model):
    LIKE_PLACES = [
        ('novel', 'Tiểu thuyết'),
        ('manga', 'Manga'),
        ('audio', 'Audio'),
        ('forum', 'Diễn đàn'),
    ]
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=20,
        choices=LIKE_PLACES,
        default='novel'
    ) # tăng tốc độ truy xuất 
    def __str__(self):
        return f"{self.user} - {self.comment}"