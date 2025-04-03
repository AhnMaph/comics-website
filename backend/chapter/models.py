from django.db import models
from manga.models import Manga
import uuid
from django.contrib.auth.models import User
import os
def chapter_image_upload_path(instance, filename):
    """ Lưu ảnh vào thư mục `media/manga_images/id_chapter/` """
    filename = filename.replace(" ", "_")
    return os.path.join("manga_images", str(instance._id), filename)

class MangaChapter(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    manga = models.ForeignKey(Manga, related_name="chapters", on_delete=models.CASCADE)
    title = models.CharField(max_length=255,default="Chương mới")
    chapter_number = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.manga.title}-{self.title} - Chapter {self.chapter_number}"
class MangaChapterImage(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    chapter = models.ForeignKey(MangaChapter, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(default='',upload_to=chapter_image_upload_path)
    page = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Image for {self.chapter.title} - Page {self.chapter.page}"