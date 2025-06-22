from django.urls import path
from .views import *

urlpatterns = [
    path("novel/<str:pk>/chapters", getNovelChapterList, name="chapters-by-novel"),  
    path("novel/chapter/<str:pk>/", getNovelChapter, name="chapter-detail"),
    path("novel/<uuid:novel_id>/create-chapter/", create_novel_chapter, name='create-novel-chapter'),
    path("manga/<uuid:manga_id>/create-chapter/", create_manga_chapter, name='create-manga-chapter'),
    path("manga/<str:pk>/chapters", getMangaChapterList, name="chapters-by-manga"),  
    path("manga/chapter/<str:pk>/", getMangaChapter, name="chapter-detail"),  
]
