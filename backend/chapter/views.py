from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.db.models import F
from django.views.decorators.cache import cache_page
from users.models import Notification, Favorite

@api_view(['GET'])
@permission_classes([AllowAny])
def getMangaChapter(request, pk):
        try:
            chapter = MangaChapter.objects.get(_id=pk)
            chapter.manga.numViews = F('numViews') + 1
            chapter.manga.save()
            chapter.manga.refresh_from_db()
            serializer = MangaChapterDetailSerializer(chapter)
            return Response(serializer.data)
        except MangaChapter.DoesNotExist:
            return Response({'details': 'Manga chapter not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'details': f"An error occurred: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def getMangaChapterList(request, pk):
        try:
            chapter = MangaChapter.objects.filter(manga__pk=pk)
            serializer = MangaChapterSerializer(chapter, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)   

@api_view(['GET'])
@permission_classes([AllowAny])
def getNovelChapter(request, pk):
    try:
        chapter = NovelChapter.objects.get(_id=pk)
        chapter.novel.numViews = F('numViews') + 1
        chapter.novel.save()
        chapter.novel.refresh_from_db()
        serializer = NovelChapterDetailSerializer(chapter)
        return Response(serializer.data)
    except Exception as e:
        return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([AllowAny])
def getNovelChapterList(request, pk):
    try:
        chapter = NovelChapter.objects.filter(novel__pk=pk).order_by("chapter_number")
        serializer = NovelChapterListSerializer(chapter, many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_manga_chapter(request, manga_id):
    try:
        manga = Manga.objects.get(_id=manga_id)
    except Manga.DoesNotExist:
        return Response({"detail": "Manga not found."}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['manga'] = str(manga._id)

    # Tạo chương mới
    chapter_serializer = MangaChapterSerializer(data=data)
    if chapter_serializer.is_valid():
        chapter = chapter_serializer.save()

        # Xử lý danh sách ảnh nếu có
        images_data = request.data.get('images', [])
        if isinstance(images_data, list):
            for i, image_url in enumerate(images_data):
                MangaChapterImage.objects.create(
                    chapter=chapter,
                    image=image_url,
                    page=i + 1
                )
        
        # Tăng số chương
        manga.numChapters += 1
        manga.save()

        return Response({
            "message": "Chapter created successfully.",
            "chapter": MangaChapterSerializer(chapter).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(chapter_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_novel_chapter(request, novel_id):
    try:
        novel = Novel.objects.get(_id=novel_id)
    except Novel.DoesNotExist:
        return Response({'detail': 'Novel not found.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['novel'] = novel._id  # Gán novel ID vào data

    serializer = NovelChapterDetailSerializer(data=data)
    if serializer.is_valid():
        chapter = serializer.save()
        return Response(NovelChapterDetailSerializer(chapter).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)