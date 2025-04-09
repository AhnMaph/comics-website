from django.shortcuts import render
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import *
from rest_framework import serializers
@api_view(['GET'])
@permission_classes([AllowAny])
def getMangaChapter(request, pk):
        try:
            chapter = MangaChapter.objects.get(_id=pk)
            chapter.manga.numViews += 1
            chapter.save()
            serializer = MangaChapterDetailSerializer(chapter)
            return Response(serializer.data)
        except Exception as e:
            return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)
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
        chapter.novel.numViews += 1
        chapter.save()
        serializer = NovelChapterDetailSerializer(chapter)
        return Response(serializer.data)
    except Exception as e:
        return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
@permission_classes([AllowAny])
def getNovelChapterList(request, pk):
    try:
        chapter = NovelChapter.objects.filter(novel__pk=pk)
        serializer = NovelChapterListSerializer(chapter, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)