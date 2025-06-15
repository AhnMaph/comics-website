from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from .models import Comments
from .models import Favorite
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ("Thông tin bổ sung", {"fields": ("cover",)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Thông tin bổ sung", {"fields": ("cover",)}),
    )
    list_display = ("id","username", "email", "is_staff", "is_active", "cover")

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Comments)
admin.site.register(Favorite)