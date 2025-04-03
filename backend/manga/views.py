from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets,status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Manga,Comments
from .serializers import MangaSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
# get,delete,post
class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.all()
    serializer_class = MangaSerializer
    permission_classes = [AllowAny]
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:  # GET requests
            return [AllowAny()]
        return [IsAdminUser()] 
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer
    parser_classes = (MultiPartParser, FormParser)
@api_view(['GET'])
def manga_request(request):
    return HttpResponse('Manga request')
def home(request):
    return render(request, 'home.html')