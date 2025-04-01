from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import viewsets,status
from .models import Story
from .serializers import StorySerializers

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializers
    permission_classes = [AllowAny]

@api_view(["GET"])
@permission_classes([AllowAny])
def StoryDetailRequest(Request, title):
    story = get_object_or_404(Story, title = title )
    serializer = StorySerializers(story)
    return Response(serializer.data, status=status.HTTP_200_OK)
