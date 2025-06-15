from django.urls import path, include
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
router.register(r'comment', CommentViewSet, basename='comment')
# router.register(r'favorite',FavoriteViewSet,basename='favorite')
router.register(r'notifications', NotificationViewSet, basename='notification')


urlpatterns = [
    path('me/', MyProfile, name='me'),
    path('me/delete/', DeleteProfile, name='delete_profile'),
    path('me/update/', UpdateProfile, name='update_profile'),
    path('me/avatar/', UpdateAvatar, name='update_avatar'),
    path('user/<str:username>/', OtherProfile, name='user_detail_by_username'),
    path('favorite/profile/<str:model>/<str:username>/',FindFavorite, name='find_favorite'),
    path('favorite/<str:model>/<uuid:object_id>/', FavoriteToggleView.as_view(), name='favorite-toggle'),
    path('like/',ToggleLike,name='like_post'),
    path('refresh/',RefreshTokenView,name='token_refresh'),
    path('login/', LoginUser,name='token_obtain_pair'),
    path('register/',RegisterUser ,name='register'),
    path('logout/',LogoutUser ,name='logout'),    
    path('', include(router.urls)),
    # path("leaderboard/top-likes/", LeaderboardTopLikes, name="leaderboard-top-likes"),
    # to be continued
    
]
