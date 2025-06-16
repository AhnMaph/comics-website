from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated,IsAuthenticatedOrReadOnly
from rest_framework.request import Request
from django.contrib.auth import authenticate
from .serializers import *
from .models import Favorite
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from rest_framework.exceptions import PermissionDenied
from novel.models import Novel
from manga.models import Manga
from django.contrib.auth import get_user_model
import jwt
import time
from rest_framework import permissions, viewsets
from django.contrib.contenttypes.models import ContentType
from .models import Comments
from .serializers import CommentsSerializer
from users.authentication import CookieJWTAuthentication
from rest_framework.decorators import authentication_classes
from django.shortcuts import get_object_or_404
from notify.utils import sendNotifyComment
from rest_framework.views import APIView
# from .models import Notification
# from .serializers import NotificationSerializer
User = get_user_model()
# ============================
# Authentication with user
# ============================
@api_view(['POST'])
@permission_classes([AllowAny])
def RegisterUser(request):
    data = request.data
    try:
        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data["username"]).exists():
            return Response({"detail": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not data['username'] or not data['password']:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create(
            first_name = data['username'],
            username = data['username'],
            email = data['email'],
            password = make_password(data['password']) # hash password for security
        )
        print("Received data:", request.data) 
        message = {'detail': 'Register Successfully!'}
        
        return Response({"message": message, "id": user.id}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Lỗi: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def LoginUser(request):
    data = request.data
    try:
        username = data['username']
        password = data['password']
        
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            response = Response({
                "message": "Đăng nhập thành công!",
                "user": {
                    "email": user.email,
                    "username": user.username,
                    "id": user.id,
                    "cover": user.cover.url if user.cover else None,
                    "date_joined": user.date_joined.strftime("%Y-%m-%d %H:%M:%S"),
                    "bio": user.bio,
                }
            }, status=status.HTTP_200_OK)
            response.set_cookie(
                key="access_token", value=access_token, httponly=True, secure=True, samesite="Lax"
            )
            response.set_cookie(
                key="refresh_token", value=str(refresh), httponly=True, secure=True, samesite="Lax"
            )

            return response

        return Response({"error": password}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": f"Lỗi: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def LogoutUser(request):
    response = Response({"message": "Logged out successfully"}, status=200)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response
@api_view(["POST"])
@permission_classes([AllowAny])
def RefreshTokenView(request):
    refresh_token = request.COOKIES.get("refresh_token")
    access_token = request.COOKIES.get("access_token")

    # Kiểm tra access token còn hạn không
    if access_token:
        try:
            # Giải mã access token để đọc `exp` mà không cần verify signature
            payload = jwt.decode(access_token, options={"verify_signature": False})
            exp = payload.get("exp")

            if exp and exp > int(time.time()):
                print("Token chưa hạn")
                return Response({"message": "Access token vẫn còn hiệu lực, không cần refresh."})
        except jwt.DecodeError:
            pass  # token lỗi, sẽ xử lý bên dưới
    if not refresh_token:
        return Response({"error": "Không có refresh token!"}, status=status.HTTP_401_UNAUTHORIZED)

    # Nếu access token hết hạn hoặc lỗi → tạo token mới từ refresh
    try:
        refresh = RefreshToken(refresh_token)
        new_access_token = str(refresh.access_token)

        response = HttpResponse({"message": "Đã tạo access token mới!"})
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        return response

    except Exception:
        return Response({"error": "Refresh token không hợp lệ!"}, status=status.HTTP_401_UNAUTHORIZED)

# ============================
#  User ViewSets
# ============================
@api_view(["GET"])
@authentication_classes([CookieJWTAuthentication])
def MyProfile(request):
    user = request.user
    if not user or not user.is_authenticated:
        raise PermissionDenied("Vui lòng đăng nhập để có thông tin này.")
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([AllowAny])
def OtherProfile(request, username):
    target_user = get_object_or_404(User, username=username)
    # if(target_user.is_superuser):
    #     return Response({"detail": "Không có quyền truy cập."}, status=status.HTTP_404_NOT_FOUND)
    serializers = UserSerializer(target_user)
    return Response(serializers.data, status=status.HTTP_200_OK)
@api_view(["POST"])
@authentication_classes([CookieJWTAuthentication])
def DeleteProfile(request):
    user = request.user
    if not user or not user.is_authenticated:
        return Response({"detail": "Bạn cần đăng nhập để xóa tài khoản."}, status=status.HTTP_401_UNAUTHORIZED)
    elif(user.is_superuser):
        return Response({"detail": "Không có quyền truy cập."}, status=status.HTTP_404_NOT_FOUND)
    elif(user != request.user or not (request.user.is_staff or request.user.is_superuser)):
        raise PermissionDenied("Bạn không có quyền xóa tài khoản này.")

    user.delete()
    return Response({"detail": "Xóa tài khoản thành công."}, status=status.HTTP_200_OK)

@api_view(["POST"])
@authentication_classes([CookieJWTAuthentication])
def UpdateAvatar(request):
    user = request.user

    if not user or not user.is_authenticated:
        return Response({"detail": "Bạn cần đăng nhập để cập nhật ảnh đại diện."}, status=status.HTTP_401_UNAUTHORIZED)
    
    # if user.is_superuser:
    #     return Response({"detail": "Không có quyền truy cập."}, status=status.HTTP_403_FORBIDDEN)
    
    avatar = request.FILES.get("avatar", None)
    if not avatar:
        return Response({"detail": "Bạn cần cung cấp ảnh đại diện mới."}, status=status.HTTP_400_BAD_REQUEST)

    user.cover = avatar
    print("User instance before save:")
    print("user:", user)
    print("user.pk:", user.pk)
    print("user.id:", user.id)
    print("user.username:", user.username) 
    user.save()
    serializer = UserSerializer(user, context={'request': request})

    return Response({
        "detail": "Cập nhật ảnh đại diện thành công.",
        "user": serializer.data
    }, status=status.HTTP_200_OK)
    # return Response({"detail": "Cập nhật ảnh đại diện thành công.", "avatar": user.cover.url}, status=status.HTTP_200_OK)
@api_view(["POST"])
@authentication_classes([CookieJWTAuthentication])
def UpdateProfile(request):
    user = request.user

    if not user or not user.is_authenticated:
        return Response({"detail": "Bạn cần đăng nhập để cập nhật thông tin."}, status=status.HTTP_401_UNAUTHORIZED)

    if user.is_superuser:
        return Response({"detail": "Không có quyền truy cập."}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get("username")
    email = request.data.get("email")
    bio = request.data.get("bio")

    if not (username or email):
        return Response({"detail": "Bạn cần cung cấp ít nhất một thông tin để cập nhật."}, status=status.HTTP_400_BAD_REQUEST)

    # Kiểm tra username/email đã tồn tại chưa (ngoại trừ bản thân)
    if username:
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return Response({"detail": "Tên người dùng đã tồn tại."}, status=status.HTTP_400_BAD_REQUEST)
        user.username = username

    if email:
        if User.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({"detail": "Email đã tồn tại."}, status=status.HTTP_400_BAD_REQUEST)
        user.email = email
    if bio:
        user.bio = bio   
    user.save()
    serializer = UserSerializer(user, context={'request': request})

    return Response({
        "detail": "Đổi thông tin thành công.",
        "user": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@authentication_classes([CookieJWTAuthentication])
def ToggleLike(request):
    user = request.user
    type = request.data.get("type")
    post_id = request.data.get("post_id")
    if not post_id:
        return Response({"error": "Missing 'post' ID"}, status=status.HTTP_400_BAD_REQUEST)

    if(type == "novel"):
        try:
            post = Novel.objects.get(_id=post_id)
        except Novel.DoesNotExist:
            return Response({"error": "Novel not found"}, status=status.HTTP_404_NOT_FOUND)
    if(type == "manga"):
        try:
            post = Manga.objects.get(_id=post_id)
        except Manga.DoesNotExist:
            return Response({"error": "Manga not found"}, status=status.HTTP_404_NOT_FOUND)
    print("Debug like: ",post_id)
    like = Likes.objects.filter(user=user, post_id=post_id).first()

    if like:
        # Nếu đã like → unlike
        like.delete()
        post.numLikes = max(post.numLikes - 1, 0)
        post.save(update_fields=['numLikes'])
        return Response({"status": "unliked","numLikes":post.numLikes}, status=status.HTTP_200_OK)
    else:
        # Nếu chưa like → like
        Likes.objects.create(user=user, post_id=post_id, type=type)
        post.numLikes += 1
        post.save(update_fields=['numLikes'])
        return Response({"status": "liked","numLikes":post.numLikes}, status=status.HTTP_201_CREATED)
@api_view(["POST"])
@authentication_classes([CookieJWTAuthentication])
def ToggleFavorite(request):
    user = request.user
    type = request.data.get("type")
    post_id = request.data.get("post_id")
    if not post_id:
        return Response({"error": "Missing 'post' ID"}, status=status.HTTP_400_BAD_REQUEST)

    if(type == "novel"):
        try:
            post = Novel.objects.get(_id=post_id)
        except Novel.DoesNotExist:
            return Response({"error": "Novel not found"}, status=status.HTTP_404_NOT_FOUND)
    if(type == "manga"):
        try:
            post = Manga.objects.get(_id=post_id)
        except Manga.DoesNotExist:
            return Response({"error": "Manga not found"}, status=status.HTTP_404_NOT_FOUND)
    print("Debug fav: ",post_id)
    fav = Favorite.objects.filter(user=user, post_id=post_id, type=type).first()

    if fav:
        # Nếu đã fav → unfav
        fav.delete()
        post.numFavorites = max(post.numFavorites - 1, 0)
        post.save(update_fields=['numFavorites'])
        return Response({"status": "unfavorite","numFavorites":post.numFavorites}, status=status.HTTP_200_OK)
    else:
        # Nếu chưa fav → fav
        Favorite.objects.create(user=user, post_id=post_id, type=type)
        post.numFavorites += 1
        post.save(update_fields=['numFavorites'])
        return Response({"status": "favorite","numFavorites":post.numFavorites}, status=status.HTTP_201_CREATED)

@api_view(["GET"])
@permission_classes([AllowAny])
def FindFavorite(request, model,username):
    try:
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        content_type = ContentType.objects.get(model=model.lower())
        fav = Favorite.objects.filter(
            user=user,
            content_type=content_type)
        exists = fav.exists()
        if(exists):
            serializer = FavoriteSerializer(fav, many=True)
            return Response({"is_favorited": exists,"favorite":serializer.data},status=status.HTTP_200_OK)
        return Response({"is_favorited": exists,"favorite":[]},status=204)
    except Exception:
        return Response({"Error": "Credential is invalid"},status=403)
class FavoriteToggleView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, model, object_id):
        try:
            content_type = ContentType.objects.get(model=model.lower())
            model_class = content_type.model_class()
            obj = model_class.objects.get(pk=object_id)
            return content_type, obj
        except Exception:
            return None, None

    def get(self, request, model, object_id):
        content_type, obj = self.get_object(model, object_id)
        if not obj:
            return Response({"detail": "Not found."}, status=404)
        fav = Favorite.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=object_id)
        exists = fav.exists()
        if(exists):
            serializer = FavoriteSerializer(fav, many=True)
            return Response({"is_favorited": exists,"favorite":serializer.data},status=status.HTTP_200_OK)
        return Response({"is_favorited": exists,"favorite":[]},status=204)

    def post(self, request, model, object_id):
        content_type, obj = self.get_object(model, object_id)
        if not obj:
            return Response({"detail": "Not found."}, status=404)

        favorite_qs = Favorite.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=object_id
        )

        if favorite_qs.exists():
            favorite_qs.delete()
            if hasattr(obj, 'numFavorites'):
                obj.numFavorites = max(getattr(obj, 'numFavorites', 1) - 1, 0)
                obj.save(update_fields=['numFavorites'])
            return Response({"numFavorites": obj.numFavorites}, status=200)

        favorite = Favorite.objects.create(
            user=request.user,
            content_type=content_type,
            object_id=object_id
        )
        if hasattr(obj, 'numFavorites'):
            obj.numFavorites = getattr(obj, 'numFavorites', 0) + 1
            obj.save(update_fields=['numFavorites'])

        # Use serializer
        serializer = FavoriteSerializer(favorite, context={'request': request})
        return Response(serializer.data, status=201)

    def delete(self, request, model, object_id):
        content_type, obj = self.get_object(model, object_id)
        if not obj:
            return Response({"detail": "Not found."}, status=404)

        favorite_qs = Favorite.objects.filter(
            user=request.user,
            content_type=content_type,
            object_id=object_id
        )

        if favorite_qs.exists():
            favorite_qs.delete()
            if hasattr(obj, 'numFavorites'):
                obj.numFavorites = max(getattr(obj, 'numFavorites', 1) - 1, 0)
                obj.save(update_fields=['numFavorites'])
            return Response({"detail": "Unfavorited"}, status=204)

        return Response({"detail": "Favorite not found."}, status=404)
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get_queryset(self):
        content_type = self.request.query_params.get('content_type')
        object_id = self.request.query_params.get('object_id')
    
        if content_type and object_id:
            try:
                post_model = ContentType.objects.get(model=content_type.lower())
                return Comments.objects.filter(
                    content_type=post_model,
                    object_id=object_id
                ).order_by('-created_at')
            except ContentType.DoesNotExist:
                return Comments.objects.none()

        return Comments.objects.none()

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)        
        obj = comment.content_object
        if hasattr(obj, 'numComments'):
            obj.numComments = getattr(obj, 'numComments', 0) + 1
            obj.save(update_fields=['numComments'])
        sendNotifyComment(comment)

    def perform_destroy(self, instance):
        user = self.request.user
        if not (user.is_staff or user.is_superuser or instance.user == user):
            raise PermissionDenied("Bạn chỉ có thể xóa comment của chính mình.")

        obj = instance.content_object
        if hasattr(obj, 'numComments'):
            obj.numComments = max(getattr(obj, 'numComments', 1) - 1, 0)
            obj.save(update_fields=['numComments'])

        instance.delete()

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@authentication_classes([CookieJWTAuthentication])
class MarkAsSeenViewSet():
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, seen = False).update(seen=True)
        return Response({'status: 200 OK'}, status=200)

@authentication_classes([CookieJWTAuthentication])
class NotificationDeleteViewSet():
    permission_classes = [IsAuthenticated]
    
    def perform_destroy(self, instance):
        user = self.request.user

        if not (user.is_staff or user.is_superuser or instance.user == user):
            raise PermissionDenied("Bạn chỉ có thể xóa thông báo của chính mình.")

        # Xoá thông báo
        instance.delete()
