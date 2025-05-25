from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from django.contrib.auth import authenticate
from .serializers import *
from .models import Favorite
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):   
    def validate(self,attrs):
        data = super().validate(attrs) # perform JWT authentication.
        serializer = UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k] = v # add more data
        return data   

class MyTokenObtainView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    try:
        if User.objects.filter(email=data["email"]).exists():
            return Response({"detail": "User with this email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if not data['name'] or not data['password']:
            return Response({"detail": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create(
            first_name = data['name'],
            username = data['email'],
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
def loginUser(request):
    data = request.data
    try:
        email = data['email']
        password = data['password']
        
        user = authenticate(username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            info = {"user":({"username":user.username},{"_id":user.id})}
            response = HttpResponse({"message": "Đăng nhập thành công!"}, info)
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
def logoutUser(request):
    response = HttpResponse({"message": "Đăng xuất thành công!"})
    response.delete_cookie("access_token", path="/",domain="localhost")
    response.delete_cookie("refresh_token", path="/",domain="localhost")
    return response

@api_view(["POST"])
@permission_classes([AllowAny])
def refreshTokenView(request):
    refresh_token = request.COOKIES.get("refresh_token")  # Lấy refresh token từ cookie
    
    if not refresh_token:
        return Response({"error": "Không có refresh token!"}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        refresh = RefreshToken(refresh_token)  # Tạo access token mới từ refresh token
        new_access_token = str(refresh.access_token)

        response = HttpResponse({"message": "Refresh token thành công!"})
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="Lax",
        )
        return response

    except Exception:
        return Response({"error": "Refresh token không hợp lệ!"}, Exception)   


    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    try:
        user = request.user 
        serializer = UserSerializerWithToken(user,many=False)
        data = request.data
        user.first_name =data['name']
        user.username = data['username']
        user.email = data['email']
        if data['password']!='':
            user.password = make_password(data['password'])
        user.save()
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail':f'{e}'},status=status.HTTP_204_NO_CONTENT)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    username = user.get['username']
    id = user.get['id'] 
    email = user.get['email']
    info = {"user":({"username":username},{"id":id},{"email":email})}
    try:
        return Response(info,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'detail':f'{e}'},status=status.HTTP_204_NO_CONTENT)
# CRUD create, delete v.v 


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Likes.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Likes.objects.filter(user=user)
    def perform_create(self, serializer):
        # Lấy đối tượng Novel từ serializer
        novel = serializer.validated_data['novel']
        
        # Kiểm tra xem người dùng đã thích truyện này chưa
        if Likes.objects.filter(user=self.request.user, novel=novel).exists():
            # Nếu đã có lượt thích rồi, trả về lỗi hoặc không làm gì
            return None
        # Nếu chưa có lượt thích, tiến hành lưu đối tượng Like và gắn người dùng hiện tại vào
        if serializer.is_valid():
            # Lưu đối tượng Like với người dùng hiện tại
            serializer.save(user=self.request.user)
            
            # Cập nhật số lượt thích cho Novel
            novel.numLikes += 1  # Tăng thêm 1 lượt thích
            novel.save(update_fields=['numLikes'])
    def perform_destroy(self, instance):
        # Truy cập đối tượng Novel liên quan đến Like
        novel = instance.novel
        
        # Giảm số lượt thích cho Novel
        novel.numLikes -= 1
        novel.save(update_fields=['numLikes'])  # Lưu lại sự thay đổi
        # Xóa đối tượng Like
        instance.delete()


# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = Comments.objects.all()
#     serializer_class = CommentsSerializer
#     permission_classes = [IsAuthenticated]
#     def get_queryset(self):
#         user = self.request.user
#         # Lọc các bình luận của người dùng hiện tại
#         return Comments.objects.filter(user=user)
    
#     def perform_create(self, serializer):
#         if serializer.is_valid():
#             serializer.save(user=self.request.user)
    
#             # Cập nhật số lượt thích cho Novel
#             novel = serializer.validated_data['novel'] # Lấy đối tượng Novel từ Comment
#             novel.numComments += 1  # Tăng thêm 1 lượt thích
#             novel.save(update_fields=['numComments'])
#         else: 
#             print(serializer.errors)
#     def perform_destroy(self, instance):
#         # Truy cập đối tượng Novel liên quan đến Comments
#         novel = instance.novel
#         # Giảm số lượt thích cho Novel
#         novel.numComments -= 1  # Giảm bớt 1 lượt thích
#         novel.save(update_fields=['numComments'])  # Lưu lại sự thay đổi
        
#         # Xóa đối tượng Comment
#         instance.delete()


class FavoriteViewSet(viewsets.ModelViewSet):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Favorite.objects.filter(user=user)
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(user=self.request.user) # 
            # Cập nhật số lượt thích cho Novel
            novel = serializer.validated_data['novel']
            novel.numFavorites += 1
            novel.save(update_fields=['numFavorites'])
        else: 
            print(serializer.errors)
    def perform_destroy(self, instance):
        # Truy cập đối tượng Novel liên quan đến Like
        novel = instance.novel
        
        # Giảm số lượt thích cho Novel
        novel.numFavorites -= 1  # Giảm bớt 1 lượt thích
        novel.save(update_fields=['numFavorites'])  # Lưu lại sự thay đổi
        
        # Xóa đối tượng Like
        instance.delete()
