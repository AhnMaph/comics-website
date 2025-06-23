#!/bin/sh

echo "🔧 Đang chạy makemigrations..."
python manage.py makemigrations

echo "🔧 Đang chạy migrate..."
python manage.py migrate

echo "📦 Đang collect static files..."
python manage.py collectstatic --noinput

echo "🚀 Khởi động Gunicorn..."
gunicorn server.wsgi:application --bind [::]:${PORT:-8000}
