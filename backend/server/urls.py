from django.contrib import admin
from django.urls import path, include
from manga.views import home
from django.conf import settings
from django.conf.urls.static import static
from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('audio.urls')),
    
    path('api/', include('manga.urls')),  
    path('api/', include('genres.urls')), 
    path('api/', include('users.urls')),
    path('api/', include('chapter.urls')),
    path('api/', include('novel.urls')),
    path('api/', include('commentChapter.urls')),
    path('api/', include('forum.urls')),
    

    path('', home),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if settings.DEBUG:
    urlpatterns += debug_toolbar_urls()