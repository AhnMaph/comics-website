from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'user/favorite', FavoriteViewSet, basename='favorite')
# router.register(r'user/comment', CommentViewSet, basename='comment')
router.register(r'user/like', LikeViewSet, basename='like')
urlpatterns = [
    path('refresh/',refreshTokenView,name='token_refresh'),
    path('login/', loginUser,name='token_obtain_pair'),
    path('register/',registerUser ,name='register'),
    path('logout/',logoutUser ,name='logout'),
    path('profile/',getUserProfile ,name='user-profile'),
    path('profile/update/',updateUserProfile,name='user-update-profile'),
    path('', include(router.urls)),
    # to be continued
]
