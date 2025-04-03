import json
import os
import django
import sys

# Dynamically setting the Django project path
project_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))  # Lấy đường dẫn gốc của dự án
sys.path.append(project_path)

# Set the default settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

# Initialize Django
django.setup()

from genres.models import Genre

# Function to import genres from a JSON file
def import_genres(json_file_path):
    with open(json_file_path, encoding='utf-8') as f:
        data = json.load(f)
        for item in data:
            Genre.objects.get_or_create(name=item['name'])
    print("✅ Genres imported successfully!")

# Main function
if __name__ == "__main__":
    # Ensure the environment is correctly set
    print(f"Using Django settings module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

    # Optionally delete existing data to avoid conflict
    Genre.objects.all().delete()
    
    # Define the path to your JSON file (could be passed as an argument or configured)
    json_file_path = os.path.join(project_path,"genres", 'genres.json')  # Assuming the JSON file is in the project root

    # Import genres
    import_genres(json_file_path)
