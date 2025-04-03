from django.contrib import admin
from django.urls import path, include
from manga.views import home
from django.conf import settings
from django.conf.urls.static import static
from debug_toolbar.toolbar import debug_toolbar_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('manga.urls')),  # API starts with /api/
    path('api/', include('genres.urls')),  # API starts with /api/
    path('api/', include('users.urls')),
    path('api/', include('chapter.urls')),
    path('', home),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
if settings.DEBUG:
    urlpatterns += debug_toolbar_urls()