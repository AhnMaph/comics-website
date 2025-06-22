import os
import json
import sys
from django.conf import settings
import django

# Khởi tạo Django
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # Lấy đường dẫn gốc của dự án
sys.path.append(project_path)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from manga.models import Manga
from chapter.models import MangaChapter, MangaChapterImage
from genres.models import Genre
from django.contrib.auth.models import User
from users.models import CustomUser

# Đường dẫn tới thư mục chứa các file JSON
TRUYEN_PATH = os.path.join(settings.BASE_DIR, 'truyen_tranh/Json')
print("TRUYEN_PATH", TRUYEN_PATH)



def convert_views(view_str):
    try:
        view_str = view_str.lower().replace('k', '000').replace('.', '')
        return int(view_str)
    except:
        return 0

def import_json_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    # Kiểm tra manga đã tồn tại chưa
    if Manga.objects.filter(title=data["title"]).exists():
        print(f"❗ Bỏ qua: {data['title']} đã tồn tại")
        return

    # Tạo Manga
    manga = Manga.objects.create(
        title=data["title"],
        author=data.get("author", "Không rõ"),
        description=data.get("description", "Đang cập nhật"),
        uploader=CustomUser.objects.get(id=1),
        status='ongoing' if "tiến hành" in data["status"].lower() else 'completed',
        cover_image=data["cover"],
        source="Đang cập nhật",
        numViews=convert_views(data.get("views", "0"))
    )

    # Gán genres
    for g in data.get("genres", []):
        genre, _ = Genre.objects.get_or_create(name=g)
        manga.genres.add(genre)
    numChap = 0
    # Tạo chapter
    for chap_data in data.get("chapters", []):
        numChap = numChap + 1
        chapter = MangaChapter.objects.create(
            manga=manga,
            title=chap_data.get("title", f"Chapter {chap_data.get('number')}"),
            chapter_number=chap_data.get("number", 0)
        )

        for idx, image_url in enumerate(chap_data.get("images", []), start=1):
            MangaChapterImage.objects.create(
                chapter=chapter,
                image=image_url,
                page=idx
            )
    
    # Cập nhật số chapter
    manga.numChapters = numChap
    manga.save()
    print(f"✅ Nhập thành công: {manga.title}")

def delete_all_data():
    """Xóa toàn bộ dữ liệu từ các mô hình liên quan"""
    print("Bắt đầu xóa toàn bộ dữ liệu...")
    MangaChapterImage.objects.all().delete()
    MangaChapter.objects.all().delete()
    Genre.objects.all().delete()
    Manga.objects.all().delete()
    print("✅ Đã xóa toàn bộ dữ liệu thành công!")

def run():
    for file in os.listdir(TRUYEN_PATH):
        if file.endswith('.json'):
            json_file_path = os.path.join(TRUYEN_PATH, file)
            print(json_file_path)
            import_json_file(json_file_path)

if __name__ == "__main__":
    # delete_all_data()
    run()
