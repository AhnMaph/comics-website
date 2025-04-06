import os
import django


from dotenv import load_dotenv

# Tự động tìm file .env ở thư mục gốc (1 cấp trên backend/)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))

username = os.getenv("DJANGO_SUPERUSER_USERNAME")
email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

# Debug thử
print("username =", username)
print("email =", email)
print("password =", password)

from django.contrib.auth import get_user_model
User = get_user_model()

User.objects.create_superuser(username=username, email=email, password=password)


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.getenv("DJANGO_SUPERUSER_USERNAME")
email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' already exists.")
