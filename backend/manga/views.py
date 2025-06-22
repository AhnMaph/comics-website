from .models import Manga
from django.shortcuts import render
from rest_framework import viewsets
from django.http import HttpResponse
from django.db.models import Value, IntegerField, Case, When, Q, Count
from .serializers import MangaSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAdminUser
from users.authentication import CookieJWTAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework import status
# get,delete,post
class MangaViewSet(viewsets.ModelViewSet):
    queryset = Manga.objects.all()
    serializer_class = MangaSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        queryset = super().get_queryset()
        q = self.request.query_params.get('q')
        if not q:
            return queryset
        keyword = q.strip().split()
        query = Q()
        relevance = Value(0, output_field=IntegerField())
        for kw in keyword:
            query |= Q(title__icontains=kw)
            query |= Q(author__icontains=kw)
            relevance = relevance + Case(
                When(title__icontains=kw, then=Value(10)),       # ưu tiên title
                When(author__icontains=kw, then=Value(5)),
                default=Value(0),
                output_field=IntegerField()
            )
        return queryset.filter(query).annotate(score=relevance).order_by('-score')
    # def get_permissions(self):
    #     if self.action in ['list', 'retrieve']:  # GET requests
    #         return [AllowAny()]
    #     return [IsAdminUser()]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_manga(request):
    data = request.data.copy()
    data['uploader'] = request.user.id  # Gán uploader là user hiện tại

    serializer = MangaSerializer(data=data)
    if serializer.is_valid():
        manga = serializer.save()
        return Response(MangaSerializer(manga).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
@permission_classes([AllowAny])
def advanced_search(request):
    include_genres = request.GET.getlist("include_genres")
    exclude_genres = request.GET.getlist("exclude_genres")
    min_chapters = request.GET.get("min_chapters")
    max_chapters = request.GET.get("max_chapters")
    author = request.GET.get("author")
    status = request.GET.get("status")

    Mangas = Manga.objects.all()

    if include_genres:
        # Lọc các truyện có đủ số lượng thể loại mong muốn
        Mangas = Mangas.annotate(
            matched_genres=Count('genres', filter=Q(genres___id__in=include_genres))
        ).filter(matched_genres=len(include_genres))
    print("Mangas", include_genres)
    if exclude_genres:
        Mangas = Mangas.exclude(genres___id__in=exclude_genres).distinct() 
        #bỏ truyện có 1 trong các thể loại không muốn

    if min_chapters:
        Mangas = Mangas.filter(numChapters__gte=int(min_chapters))

    if max_chapters:
        Mangas = Mangas.filter(numChapters__lte=int(max_chapters))

    if author:
        Mangas = Mangas.filter(author__icontains=author)

    if status:
        Mangas = Mangas.filter(status__iexact=status)

    serializer = MangaSerializer(Mangas, many=True, context={'request': request}) 
    # custom view nên cần request để biết base URL của server 
    return Response({"results": serializer.data})
def home(request):
    return render(request, 'home.html')