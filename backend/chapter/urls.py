from django.urls import path
from .views import getChapter, getChapterList

urlpatterns = [
    path("manga/<str:pk>/chapters", getChapterList, name="chapters-by-manga"),  
    path("chapter/<str:pk>/", getChapter, name="chapter-detail"),  
]
