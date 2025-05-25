from django.urls import path
from .views import get_comments, post_comment

urlpatterns = [
    path('comments/', get_comments, name='get-comments'),
    path('comments/post/', post_comment, name='post-comment'),
]
