from django.shortcuts import render
from .serializers import MangaChapterSerializer, MangaChapterDetailSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import MangaChapter
from rest_framework import serializers
@api_view(['GET'])
@permission_classes([AllowAny])
def getChapter(request, pk):
        try:
            chapter = MangaChapter.objects.get(_id=pk)
            chapter.numViews += 1
            chapter.save()
            serializer = MangaChapterDetailSerializer(chapter)
            return Response(serializer.data)
        except Exception as e:
            return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
@permission_classes([AllowAny])
def getChapterList(request, pk):
        try:
            chapter = MangaChapter.objects.filter(manga__pk=pk)
            serializer = MangaChapterSerializer(chapter, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)   
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def likeChapter(request, pk):
        try:
            chapter = MangaChapter.objects.get(_id=pk)
            if request.user in chapter.likes.all():
                chapter.likes.remove(request.user)
                return Response({'details': "Unliked"}, status=status.HTTP_200_OK)
            else:
                chapter.likes.add(request.user)
                return Response({'details': "Liked"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'details': f"{e}"}, status=status.HTTP_204_NO_CONTENT)