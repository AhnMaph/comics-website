# urls.py (trong app forum)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ForumPostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'forum/posts', ForumPostViewSet, basename='forum-post')
router.register(r'forum/comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]





