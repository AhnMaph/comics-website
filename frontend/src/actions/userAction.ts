import axios from 'axios';
// import { useDispatch } from 'react-redux';
import { login, logout } from '../types/user/userSlice';
import { LikeProp, User, VoteProp} from '../types/user/User';
import { Comment } from '../types/user/User';
import store from '../store';
import axiosAuth from './apiClient';
const baseURL = import.meta.env.VITE_ADMIN_URL;

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true,
        }
        const response = await axios.post(
            `${baseURL}/api/register/`, 
            {username, email, password }, // gửi thông tin user về backend
            config
        );

        console.log(response); // Debug kết quả
        return response;
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
            throw error;
    }
};

export const loginUser = async (username: string, password: string) => {
    try {
        const config = {
            headers: { 'Content-Type': 'Application/json' },
            withCredentials:true,
        }
        const response = await axios.post(`${baseURL}/api/login/`, 
            {username, password}, 
            config
        );
        const user = response.data.user;
        console.log("User info when fetching profile:", user);
        store.dispatch(
                login({
                    id: String(user.id),
                    email: user.email,
                    name: user.username,
                    first_name: user.first_name,
                    cover: `${baseURL}${user.cover}`,
                    isLogin: true,
                    date_joined: user.date_joined,
                    bio: user.bio,
                })
            );
        console.log(response); // Debug kết quả
        return response
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
    }
};

export const logoutUser = async () => {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials:true,
    }
    const response = await axios.post(
        `${baseURL}/api/logout/`,
        {}, 
        config
    );
    store.dispatch(logout());
    console.log("Logout",response); // Debug kết quả
};


export const fetchProfile = async (username?:string): Promise<User | null> => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials:true,
        }
        console.log("Target: ",username);
        var response = null, user = null;
        if(username) {
            response = await axios.get(
                `${baseURL}/api/user/${username}/`,  
                config
            );
            user = response.data;
        }
        else {
            response = await axiosAuth.get(
                `${baseURL}/api/me/`,  
                config
            );
            user = response.data;
            // console.log("User info when fetching profile:", user);
            if(user.cover) user.cover = `${baseURL}${user.cover}`;
            store.dispatch(
                login({
                    id: String(user.id),
                    email: user.email,
                    name: user.username,
                    first_name: user.first_name,
                    cover: user.cover,
                    isLogin: true,
                    date_joined: user.date_joined,
                    bio: user.bio,
                })
            );
            console.log("Me:", response);
        }
        
        console.log("User profile fetched:", user);
        return user ? (user as User) : null;
        
    } catch (error) {
        console.error("Cần đăng nhập/đăng ký:", error);
        throw error;
    }
};


const webURL = import.meta.env.VITE_FRONTEND_URL;
export const autoLogin = async () => {
    const config = { withCredentials: true };
    try {
        // Bước 1: Refresh token
        await axios.post(`${baseURL}/api/refresh/`, {}, config);
        console.log("Refresh token thành công");

        // Bước 2: Gọi fetchProfile để lấy user info
        await fetchProfile();
        
        
    } catch (error: any) {
        console.error("Tự động đăng nhập thất bại:", error);
        if (error.response && error.response.status === 401)
        {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");

          window.location.href = `${webURL}/auth/login`;
        }
    }
};

  
interface CommentsOptions {
  chapter_type?: string;
  chapter_id?: string;
  content_type?: string;
  object_id?: string;
}

export const postComment = async (post_id:string, content:string, type:string, parent:number | null) => {
  try{
    const config = {
      headers: {'Content-Type': 'application/json'},
      withCredentials:true,
    };
    console.log("Post ID:", post_id);
    const response = await axiosAuth.post(
      `${baseURL}/api/comment/`,
        {
            content: content,
            content_type: post_id,
            parent: parent || null, // Nếu không có parent thì để là null
            target_model: type,
            target_object_id: post_id,
        },
        config
    );
    return response.data;
  } catch (error) {
    console.error("Vui lòng đăng nhập trước khi gửi:", error);
    throw error;
  }
}

export const fetchComments = async (options: CommentsOptions): Promise<Comment[]> => {

    const config = {
      headers: {'Content-Type': 'application/json'},
      withCredentials:true,
    };
    const url = new URL(`${baseURL}/api/comment/`);
    if (options.chapter_type && options.chapter_id) {
        url.searchParams.append("chapter_type", options.chapter_type);
        url.searchParams.append("chapter_id", options.chapter_id);
    } else if (options.content_type && options.object_id) {
        url.searchParams.append("content_type", options.content_type);
        url.searchParams.append("object_id", options.object_id);
    } else {
        throw new Error("Missing required query parameters");
    }

    const response = await axios.get(url.toString(),config);
    console.log("Comments fetched:", response.data.results);
    return response.data.results || [];
}
 

export const updateLike  = async ({ post_id, type }: LikeProp) => {
  try{
      const config = {
            withCredentials:true,
        }
      const response = await axiosAuth.post(`${baseURL}/api/like/`,
        {
          post_id: post_id,
          type: type
        },
        config
      );
      console.log("Like update: ",`${baseURL}/api/like/`);
      console.log("Like update: ",response.data);
      return response.data;
  }

  catch (error) {
    console.error("Error update number of like:", error);
    throw error;
  }
}

export const getFavorite = async ({
  username,
  type,
}: { username: string; type: string }): Promise<any[]> => {
  try {
    const config = { withCredentials: true };
    const response = await axios.get(`${baseURL}/api/favorite/profile/${type}/${username}/`, config);

    console.log("Fav find: ", response.data);
    return response.data.favorite ?? []; // ✅ fallback nếu undefined/null
  } catch (error) {
    console.error("Error find favorite:", error);
    return []; // ✅ fallback lỗi → trả mảng rỗng thay vì throw
  }
};


export const updateFavorite = async (post_id:string, type:string) => {
  try{
    const config = {
      headers: {'Content-Type': 'application/json'},
      withCredentials:true,
    };
    const response = await axiosAuth.post(
      `${baseURL}/api/favorite/${type}/${post_id}/`,
        {},
        config
    );
    console.log("update Favorite:", response.data);   
    return response.data;
  } catch (error) {
    console.error("Vui lòng đăng nhập trước khi gửi:", error);
    throw error;
  }
}

export const updateAvatar = async (formData: FormData) => {
  const res = await axiosAuth.post(`${baseURL}/api/me/avatar/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  console.log("Update avatar:", res.data);
  const userInfo = store.getState().user.user;
    if(userInfo)
        store.dispatch(
            login({
                id: userInfo.id,
                email:userInfo.email,
                name: userInfo.name,
                cover: `${res.data.user.cover}`,
                isLogin: true,
                date_joined: userInfo.date_joined,
                bio: userInfo.bio,
            })
        );
  return res;
};
export const updateProfile = async (email:string | undefined, username:string | undefined, bio:string | undefined) => {
  try{
    const config ={
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  }
    const res = await axiosAuth.post(`${baseURL}/api/me/update/`, {
      email: email,
      username: username,
      bio:bio,
    }, config);
    const updateUser = res.data.user;
    console.log("Update profile: ",updateUser); 
    const userInfo = store.getState().user.user;
    if(userInfo)
        store.dispatch(
            login({
                id: userInfo.id,
                email:updateUser.email,
                name: updateUser.username,
                cover: userInfo.cover,
                isLogin: true,
                date_joined: userInfo.date_joined,
                bio: updateUser.bio,
            })
        );
    console.log("Update profile:", res);
  return res;
  }
  catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
export const deleteProfile = async () => {
  const res = await axiosAuth.post(`${baseURL}/api/me/delete/`,{}, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
};

export const updateVoting = async ({post_id, rating, type}: VoteProp) => {
  try 
  {
    const config = 
    {
      withCredentials: true,
    }
    const response = await axiosAuth.post(`${baseURL}/api/vote/`, 
      {
        post_id: post_id,
        rating: rating,
        type: type,
      },
      config
    );

    console.log("Vote update: ", response.data);
    return response.data;
  }
  catch (error)
  {
    console.error("Error updating vote:", error);
    throw error;
  }
}