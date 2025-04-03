from django import forms
from .models import MangaChapter, MangaChapterImage
from django.forms.widgets import ClearableFileInput

class MultipleFileInput(ClearableFileInput):
    allow_multiple_selected = True

class MultipleFileField(forms.FileField):
    def __init__(self, *args, **kwargs):
        kwargs.setdefault("widget", MultipleFileInput())
        super().__init__(*args, **kwargs)

    def clean(self, data, initial=None):
        if not data:
            return []
        if isinstance(data, (list, tuple)):
            return [super().clean(d, initial) for d in data]
        return [super().clean(data, initial)]

class MangaChapterForm(forms.ModelForm):
    images = MultipleFileField(required=False, label="Upload Images", help_text="Select multiple images")

    class Meta:
        model = MangaChapter
        fields = ['manga', 'title', 'chapter_number']

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
            images = self.cleaned_data.get("images", [])
            for idx, image in enumerate(images):
                MangaChapterImage.objects.create(chapter=instance, image=image, page=idx)
        return instance
