from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StoryViewSet, StoryDetailRequest

router = DefaultRouter()
router.register(r'storie', StoryViewSet)

urlpatterns = [
    path('', include(router.urls)),  
    path('<str:title>/', StoryDetailRequest, name="story-detail"),
]