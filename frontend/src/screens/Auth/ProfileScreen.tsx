import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Upload,
  Heart, 
  Calendar,
  Camera,
  Mail,
  Edit3,
  Save,
  X,
  Star,
  Eye,
  MessageCircle
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import {selectUser } from "../../types/user/userSlice";
import {useSelector } from "react-redux";
import {fetchProfile, getFavorite, updateProfile} from '../../actions/userAction';
import { Novel } from '../../types/novel/novelDetails';
import store from '../../store';
import { updateAvatar } from '../../actions/userAction';
import { getUploader } from '../../actions/novelAction';
const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [favNovel, setFavNovel] = useState<Novel[]>([]);
  const [upNovel, setUpNovel] = useState<Novel[]>([]);  
  const [target,setTarget] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const baseInfo = useSelector(selectUser);
  const baseURL = import.meta.env.VITE_ADMIN_URL;
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState({
    name: baseInfo?.name,
    email: baseInfo?.email,
    bio: baseInfo?.bio,
    joinDate: baseInfo?.date_joined || "2024-01-01",
    avatar: baseInfo?.cover,
    isUploader: true,
    stats: {
      bookmarks: 0,
      uploads: 0,
      followers: 0,
      following: 0
    }
  });

  useEffect(() => {
  // Đảm bảo CHỈ gán 1 lần nếu target chưa có
      if (!target) {
        if (username) {
          setTarget(username);
        } else if (baseInfo?.isLogin) {
          setTarget(baseInfo.name);
        }
      }
    }, [baseInfo, username, target]);
    //   if (!target) {
    //   return <p>Chưa Đăng nhập hoặc Đăng ký</p>;
    // }
    useEffect(() => {
      const fetchData = async () => {
        if (!target) return;
        const user = await fetchProfile(target);
        if(!user)
          {
            console.log("Không tìm thấy user");
            return;
          } 
        const res_fav = await getFavorite({ username: user.username, type:"novel" });
        const favCount = res_fav ? res_fav.length : 0;
        setFavNovel([]);
        console.log("Favorite item:", favCount);
        for (let i = 0; i < favCount; i++) {
            const newNovel = res_fav[i].post;
            setFavNovel(prev => {
                if (prev === null) return [newNovel]; // nếu ban đầu là null
                return [...prev, newNovel]; // thêm vào cuối mảng
              });
            
            // xử lý gì đó với từng item
        }
        const res_uploader = await getUploader(user.id.toString());
        const upCount = res_uploader ? res_uploader.length : 0;
        setUpNovel([]);
        console.log("Favorite post item:", upCount);
        
        for (let i = 0; i < upCount; i++) {
            const newNovel = res_uploader[i];
            setUpNovel(prev => {
                if (prev === null) return [newNovel]; // nếu ban đầu là null
                return [...prev, newNovel]; // thêm vào cuối mảng
              });
            // console.log("Favorite post item:", newNovel.title); // ví dụ truy cập title
            // xử lý gì đó với từng item
        }
        setUserInfo({
            name: user?.username,
            email: user?.email,
            bio: user?.bio,
            joinDate: user?.date_joined || "2024-01-01",
            avatar: user?.cover,
            isUploader: true,
            stats: {
              bookmarks: favCount,
              uploads: upCount,
              followers: 0,
              following: 0,
            },
          });

      };
      fetchData();
      
    }, [target]);
    
  

  const [editForm, setEditForm] = useState({ ...userInfo });
  const handleSave = async () => {
    try {
      const res = await updateProfile(editForm.email, editForm.name, editForm.bio);
      console.log("Cập nhật thành công:", res);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }

    setIsEditing(false);
  };


  const handleCancel = () => {
    setEditForm({ ...userInfo });
    setIsEditing(false);
  };

  const TabButton = ({ id, label, icon: Icon, count }: { id: string; label: string; icon: React.ElementType; count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        activeTab === id 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
      {count && <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs text-black">{count}</span>}
    </button>
  );

  const ComicCard = ({ comic, showStats = false }: { comic: any; showStats?: boolean }) => (
    <Link to={`/novel/${comic._id}`}>
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4" 
      style={{ aspectRatio: "5 / 7" }}>
      <img 
        src={baseURL+"/"+comic.cover_image}
        alt={comic.title}
        className="w-full h-full object-cover rounded"
      />
      <h3 className="font-semibold text-gray-800 mb-1 truncate">{comic.title}</h3>
      {comic.author && (
        <p className="text-sm text-gray-600 mb-2">by {comic.author}</p>
      )}
      {comic.rating && (
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{comic.rating}</span>
        </div>
      )}
      {showStats && (
        <div className="flex justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye size={12} />
            <span>{comic.numViews}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={12} />
            <span>{comic.numFavorites}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={12} />
            <span>{comic.numComments}</span>
          </div>
        </div>
      )}
    </div>
    </Link>
  );
  const handleAvatarClick = () => {
    setShowAvatarUpload(true);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      alert('Please select a file to upload');
      return;
    }

    const file = event.target.files[0];

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await updateAvatar(formData);
      console.log("Avatar updated successfully:", res);
      setShowAvatarUpload(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload avatar. Please try again.");
    }
  };


  const removeAvatar = () => {
    const defaultAvatar = '/api/placeholder/120/120';
    setUserInfo(prev => ({ ...prev, avatar: defaultAvatar }));
    setEditForm(prev => ({ ...prev, avatar: defaultAvatar }));
    setShowAvatarUpload(false);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <img 
                src={baseURL +"/" + userInfo.avatar} 
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 cursor-pointer transition-opacity group-hover:opacity-80"
                onClick={target===baseInfo?.name ? handleAvatarClick : undefined}
                
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              {/* Avatar Upload Overlay */}
              <div 
                onClick={target===baseInfo?.name ? handleAvatarClick : undefined}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white" size={24} />
              </div>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="text-2xl font-bold text-blue-700 border-b-2 border-blue-300 bg-transparent outline-none"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="flex items-center gap-2 text-gray-600 border-b border-gray-300 bg-transparent outline-none"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    className="w-full text-gray-700 border border-gray-300 rounded-md p-2 outline-none focus:border-blue-400"
                    rows={3}
                  />
                  
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{userInfo.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail size={16} />
                    <span>{userInfo.email}</span>
                  </div>
                  <p className="text-gray-700 mb-3">{userInfo.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Tham gia từ {new Date(userInfo.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  hidden={target !== baseInfo?.name}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit3 size={18} />
                  Sửa thông tin
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userInfo.stats.bookmarks}</div>
              <div className="text-sm text-gray-600">Đã lưu</div>
            </div>
            {userInfo.isUploader && (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userInfo.stats.uploads}</div>
                <div className="text-sm text-gray-600">Đã đăng</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userInfo.stats.followers}</div>
              <div className="text-sm text-gray-600">Người theo dõi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userInfo.stats.following}</div>
              <div className="text-sm text-gray-600">Đang theo dõi</div>
            </div>
          </div>
        </div>
        {/* Avatar Upload Modal */}
        {showAvatarUpload && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Đổi ảnh đại diện</h3>
                <button
                  onClick={() => setShowAvatarUpload(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="text-center mb-6">
                <img 
                  src={baseURL+"/"+userInfo.avatar} 
                  alt="Current Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mx-auto mb-4"
                />
                <p className="text-sm text-gray-600">
                  Upload a new profile picture. Max file size: 5MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  Upload New
                </button>
                <button
                  onClick={removeAvatar}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-6 ">
          <TabButton 
            id="info" 
            label="Thông tin" 
            icon={User} 
          />
          <TabButton 
            id="bookmarks" 
            label="Truyện đã lưu" 
            icon={BookOpen} 
            count={userInfo.stats.bookmarks}
          />
          {userInfo.isUploader && (
            <TabButton 
              id="uploads" 
              label="Truyện đã đăng" 
              icon={Upload} 
              count={userInfo.stats.uploads}
            />
          )}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Thông tin chi tiết</h3>
                  <div className="space-y-3 text-gray-600">
                    <div><strong>Tên:</strong> {userInfo.name}</div>
                    <div><strong>Email:</strong> {userInfo.email}</div>
                    <div><strong>Là thành viên từ:</strong> {new Date(userInfo.joinDate).toLocaleDateString()}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">Tiểu sử</h3>
                  <p className="text-gray-600">{userInfo.bio}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Danh sách truyện theo dõi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {favNovel.map(comic => (
                  <ComicCard key={comic._id} comic={comic} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'uploads' && userInfo.isUploader && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Truyện đã đăng</h2>
                <button hidden={target !== baseInfo?.name} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  
                  <Upload size={18} />
                  Đăng Truyện Mới
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upNovel.map(comic => (
                  <ComicCard key={comic._id} comic={comic} showStats={true} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;