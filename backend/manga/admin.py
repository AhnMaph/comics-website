from django.contrib import admin
from .models import Manga

@admin.register(Manga)
class MangaAdmin(admin.ModelAdmin):
    list_display = ("title", "numViews", "numChapters", "created_at")
    readonly_fields = ("numViews","numChapters","numFavorites","numComments","numRatings")

