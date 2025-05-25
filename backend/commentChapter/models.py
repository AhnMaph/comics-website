from django.db import models
from django.contrib.auth.models import User
from manga.models import Manga
from novel.models import Novel
import uuid
from chapter.models import MangaChapter, NovelChapter

# Create your models here.
# app/models.py

 
class Comment(models.Model):
    _id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    manga_chapter = models.ForeignKey(MangaChapter, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    novel_chapter = models.ForeignKey(NovelChapter, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    manga = models.ForeignKey(Manga, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    novel = models.ForeignKey(Novel, null=True, blank=True, on_delete=models.CASCADE, related_name="comments")
    
    # Đảm bảo rằng chỉ một trong các trường
    def clean(self):
        count = sum([
            bool(self.manga),
            bool(self.novel),
            bool(self.manga_chapter),
            bool(self.novel_chapter)
        ])
        if count != 1:
            raise ValidationError("Only one connection")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} - {self.content[:30]}"
  