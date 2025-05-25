from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, PostCommentViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', PostCommentViewSet, basename='comment')  # Comment riêng, không nested

urlpatterns = [
    path('', include(router.urls)),

    # Đường dẫn thủ công cho comments theo post
    path('posts/<int:post_pk>/comments/', PostCommentViewSet.as_view({
        'get': 'list',
        'post': 'create',
    }), name='post-comments-list'),

    path('posts/<int:post_pk>/comments/<int:pk>/', PostCommentViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    }), name='post-comments-detail'),
]