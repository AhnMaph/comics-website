from django.contrib import admin
from .models import *
from .forms import MangaChapterForm
from django.utils.html import format_html
class MangaChapterImageInline(admin.TabularInline):  
    model = MangaChapterImage
    extra = 0  # Cho phép thêm ảnh dễ dàng
    fields = ["image","page"]
    ordering = ["page"]  # Sắp xếp theo thứ tự trang
    
# class MangaChapterAdmin(admin.ModelAdmin):
#     list_display = ("title", "manga", "chapter_number", "views", "created_at")
#     list_filter = ("manga",)
#     search_fields = ("title", "manga__title")
#     inlines = [MangaChapterImageInline]  # Hiển thị ảnh trong Chapter

class MangaChapterAdmin(admin.ModelAdmin):
    form = MangaChapterForm  # Sử dụng form tùy chỉnh cho MangaChapter
    list_display = ("title", "manga", "chapter_number", "created_at")
    # inlines = [MangaChapterImageInline]  # Hiển thị ảnh trong MangaChapter
    search_fields = ("title", "manga__title")
    class Media:
        js = (
            'admin/custom_admin.js',  # Đường dẫn đến file JavaScript tùy chỉnh
        )
admin.site.register(MangaChapter, MangaChapterAdmin)