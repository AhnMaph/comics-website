from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MangaViewSet,CommentViewSet

router = DefaultRouter()
router.register(r'manga', MangaViewSet)  # /api/manga/
router.register(r'manga/comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),
]
