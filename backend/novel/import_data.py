import json
import os
import django
import sys
import requests
from django.core.files.base import ContentFile

# Cấu hình Django
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

# Import models sau khi setup Django
from novel.models import Novel
from chapter.models import NovelChapter
from genres.models import Genre
from django.db import transaction

def import_novel(path):
    with transaction.atomic():
        # Tất cả thao tác với database bên trong đây
        novel, _ = Novel.objects.get_or_create(...)

# def download_image_to_file(url):
#     fallback_path = os.path.join(project_path, 'novel', 'hello.webp')
#     try:
#         with open(fallback_path, 'rb') as f:
#             print("✅ Luôn dùng ảnh mặc định hello.webp")
#             return ContentFile(f.read()), 'hello.webp'
#     except Exception as fallback_error:
#         print(f"❌ Không thể mở ảnh mặc định: {fallback_error}")
#         return None, None

def download_image_to_file(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        file_name = os.path.basename(url)
        return ContentFile(response.content), file_name
    except Exception as e:
        print(f"❌ Failed to download image from {url}: {e}")
        return None, None
    
def delete_all_novels():
    try:
        # Novel.objects.all().delete()
        Novel.objects.filter(numChapters=0).delete()
        print("✅ All novels deleted successfully!")
    except Exception as e:
        print(f"❌ Failed to delete novels: {e}")

def import_novel(json_file_path):
    with open(json_file_path, encoding='utf-8') as f:
        item = json.load(f)
    cover_file, cover_url = download_image_to_file(item.get('covers', ''))
    novel, _ = Novel.objects.get_or_create(
        title=item['title'],
        author=item['author'],
        description=item['description'],
        status=item['status'],
    )
    if cover_file and cover_url:
        cover_name = cover_url.split("/")[-1] + ".jpg"
        novel.cover_image.save(cover_name, cover_file, save=True)
    genre_names = item.get('genres', [])
    genre_instances = []
    for name in genre_names:
        genre, _ = Genre.objects.get_or_create(name=name)
        genre_instances.append(genre)

    novel.genres.set(genre_instances)
    
    chapters = item.get('chapters', [])
    novel.numChapters = len(chapters)
    print(novel.numChapters)
    for idx, chapter in enumerate(chapters):
        created = NovelChapter.objects.get_or_create(
            novel=novel,
            chapter_number=idx+1,
            title=chapter['title_chapter'],
            content=chapter['content'],
        )
        if not created:
            novel.author = item['author']
            novel.description = item['description']
            novel.status = item['status']
            novel.save()
    novel.save()
    print("✅ Novel imported successfully!")

if __name__ == '__main__':
    print(f"Using Django settings module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    delete_all_novels()
    # for i in range(2):
    #     for j in range(26):
    #         json_file_path = os.path.join(project_path, 'novel', 'truyen-save', f'page{i+1}_truyen{j+1}.json')
    #         if os.path.isfile(json_file_path): 
    #             import_novel(json_file_path)
    #         else:
    #             print(f'File không tồn tại: {json_file_path}')
    #             break