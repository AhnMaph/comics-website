import axios from "axios";

const baseURL = "http://localhost:8000";

// Gửi comment
// type CommentPayload = {
//   content: string;
//   parent?: string | number;
// };
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Kiểm tra tên cookie
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// 🟩 Hàm lấy comment theo postId và loại: manga, manga_chapter, novel, novel_chapter
export const fetchComments = async (postId: string | number, type: string) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json", 'X-CSRFToken': getCookie('csrftoken')},
      withCredentials: true,
      params: {
        [type]: postId, // Ví dụ: { manga: 123 }
      },
    };
    const res = await axios.get(`${baseURL}/api/comments/`, config);
    console.log("API trả về:", res.data);
    return res.data.results;
  } catch (error) {
    console.error("Lỗi khi fetch comment:", error);
    throw error;
  }
};

// 🟩 Hàm post 1 comment
// export const postComment = async (payload: CommentPayload) => {
//   try {
//     const config = {
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true,
//     };
//     console.log("payload", payload)
//     const res = await axios.post(`${baseURL}/api/comments/`, payload, config);
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi khi gửi comment:", error);
//     throw error;
//   }
// };

// export const postComment = async (payload: CommentPayload, postId: string | number, type: string) => {
//   try {
//     const config = 
//     {
//       headers: { "Content-Type": "application/json" },
//       withCredentials: true,
//       params: {
//         [type]: postId, 
//       },
//     };
//     console.log("payload", payload)
//     const res = await axios.post(`${baseURL}/api/comments/`, payload, config);
//     return res.data;
//   } catch (error) {
//     console.error("Lỗi khi gửi comment:", error);
//     throw error;
//   }
// };

export const postComment = async (
  commentData: any
) => {
  try 
  {
    const config = {
      headers: { "Content-Type": "application/json", 'X-CSRFToken': getCookie('csrftoken')},
      withCredentials: true,
    };

    const res = await axios.post(`${baseURL}/api/comments/post/`, commentData, config);
    console.log("Đăng comment thành công:", res.data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đăng comment:", error);
    throw error;
  }
};


