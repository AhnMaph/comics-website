from django.contrib import admin
from .models import Genre

@admin.register(Genre)
class GenresAdmin(admin.ModelAdmin):
    list_display = ('name', 'createdAt')

