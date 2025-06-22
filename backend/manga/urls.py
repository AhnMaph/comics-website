from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'manga', MangaViewSet)  # /api/manga/

urlpatterns = [
    path('manga/advanced-search/', advanced_search, name='advanced_search'),
    path('manga/new/', create_manga, name='create-manga'),
    path('', include(router.urls)),
]
