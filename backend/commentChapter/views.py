# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Q
from .models import Comment
from .serializers import CommentSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def get_comments(request):
    queryset = Comment.objects.all().order_by('-created_at')

    manga = request.query_params.get('manga')
    novel = request.query_params.get('novel')
    manga_chapter = request.query_params.get('manga_chapter')
    novel_chapter = request.query_params.get('novel_chapter')

    if manga:
        queryset = queryset.filter(
            Q(manga_id=manga) | Q(manga_chapter__manga_id=manga)
        ).distinct()

    if novel:
        queryset = queryset.filter(
            Q(novel_id=novel) | Q(novel_chapter__novel_id=novel)
        ).distinct()

    if manga_chapter:
        queryset = queryset.filter(manga_chapter_id=manga_chapter)

    if novel_chapter:
        queryset = queryset.filter(novel_chapter_id=novel_chapter)

    serializer = CommentSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_comment(request):
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
