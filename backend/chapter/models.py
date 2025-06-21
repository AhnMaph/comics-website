from django.db import models
from manga.models import Manga 
from novel.models import Novel
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
    # def save(self, *args, **kwargs):
    #     is_new = self._state.adding
    #     if not self.pk:  # Chỉ chạy khi tạo mới, không chạy khi update
    #         last_chapter = MangaChapter.objects.filter(manga=self.manga).order_by('-chapter_number').first()
    #         if(last_chapter):
    #             if(last_chapter.chapter_number):
    #                 self.chapter_number = (last_chapter.chapter_number + 1) if last_chapter else 1
    #             if(self.manga.numChapters):
    #                 self.manga.numChapters += 1
    #             self.manga.save()
    #     super().save(*args, **kwargs)
    #     if is_new:
    #         from notify.utils import sendNotify
    #         sendNotify(self)
class MangaChapterImage(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    chapter = models.ForeignKey(MangaChapter, related_name="images", on_delete=models.CASCADE)
    image = models.URLField(max_length=500, default='')
    page = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Image for {self.chapter.title} - Page {self.page}"
class NovelChapter(models.Model):
    _id = models.UUIDField(default=uuid.uuid4,  unique=True,
                           primary_key=True, editable=False)
    novel = models.ForeignKey(Novel, related_name="chapters", on_delete=models.CASCADE)
    title = models.CharField(max_length=255,default="Chương mới")
    chapter_number = models.IntegerField(blank=True, null=True)
    content = models.TextField() # nội dung chương
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.novel.title}-{self.title} - Chapter {self.chapter_number}"
    def save(self, *args, **kwargs):
        is_new = self._state.adding
        if not self.pk:  # Chỉ chạy khi tạo mới, không chạy khi update
            last_chapter = NovelChapter.objects.filter(novel=self.novel).order_by('-chapter_number').first()
            if(last_chapter):
                if(last_chapter.chapter_number):
                    self.chapter_number = (last_chapter.chapter_number + 1) if last_chapter else 1
                if(self.novel.numChapters):
                    self.novel.numChapters += 1
                self.novel.save()
        super().save(*args, **kwargs)
        if is_new:
            from notify.utils import sendNotify
            sendNotify(self)

    def delete(self, *args, **kwargs):
        # Lưu số chương hiện tại
        current_number = self.chapter_number
        
        # Giảm số chương của novel
        if(self.novel.numChapters):
            self.novel.numChapters -= 1
        self.novel.save()

        # Xóa chapter hiện tại
        # Gọi delete gốc
        super().delete(*args, **kwargs)

        # Giảm số chương của các chương sau đó
        later_chapters = NovelChapter.objects.filter(
            novel=self.novel,
            chapter_number__gt=current_number
        ).order_by('chapter_number')

        for chapter in later_chapters:
            if(chapter.chapter_number): chapter.chapter_number -= 1
            chapter.save()