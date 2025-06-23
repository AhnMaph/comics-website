
// Bản mởi nhất comments


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { selectUser } from "../../types/user/userSlice";
// import { useComment } from "../../actions/userActions";
type Comment = {
  id: string;
  user: {
    username: string;
    email: string;
    name: string;
    id: number;
  };
  content: string;
  created_at: string;
  parent?: string;
  replies: Comment[];
  post_id: string;
  type: string;
};

type CommentSectionProps = {
  postId: string;
  type: "novel" | "manga" | "audio" | "forum";

};

export default function CommentSection({ postId, type }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [visibleComments, setVisibleComments] = useState(5);
  const [showMore, setShowMore] = useState(false);

  const navigate = useNavigate();
  const user = useSelector(selectUser);

const baseURL = import.meta.env.VITE_ADMIN_URL;
  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${baseURL}}/api/comments/`, {
        withCredentials: true, // Sử dụng cookie để xác thực     
      });
      console.log(res.data);

      const allComments: Comment[] = res.data;

      // Xử lý cấu trúc cha-con
      const topLevel = allComments.filter((c) => !c.parent);
      topLevel.forEach((c) => {
        c.replies = allComments.filter((r) => r.parent === c.id);
      });

      setComments(topLevel);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handlePostComment = async () => {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    if (newComment.trim() === "") return;

    try {
      // const response = await useComment({
      //   content: newComment.trim(),
      //   post_id: postId,
      //   type,
      // });

      setNewComment("");
      fetchComments(); // Tải lại danh sách bình luận
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  const handlePostReply = async (parentId: string) => {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    const replyText = replyContent[parentId];
    if (!replyText || replyText.trim() === "") return;

    try {
      await axios.post(
        `${baseURL}/api/comments/`,
        {
          content: replyText.trim(),
          post_id: postId,
          parent: parentId,
          type,
        },
        {
          withCredentials: true, // Sử dụng cookie để xác thực
        }
      );

      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
      fetchComments(); // Tải lại danh sách bình luận
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
    }
  };

  const handleLoadMore = () => {
    setVisibleComments(comments.length);
    setShowMore(true);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bình luận</h2>

      <div className="flex flex-col mb-6">
        <textarea
          className="w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Mời bạn để lại bình luận..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          onClick={handlePostComment}
          className="self-end mt-3 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
        >
          Gửi bình luận
        </button>
      </div>

      <div className="space-y-8">
        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment.id} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-blue-700">{comment.user.name}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-800">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="hover:underline"
                >
                  💬 Trả lời
                </button>
                <span>• {new Date(comment.created_at).toLocaleString()}</span>
              </div>

              {replyingTo === comment.id && (
                <div className="mt-4 pl-8">
                  <textarea
                    className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Nhập phản hồi..."
                    rows={2}
                    value={replyContent[comment.id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handlePostReply(comment.id)}
                      className="bg-orange-500 text-white py-1 px-4 rounded-lg hover:bg-orange-600 transition"
                    >
                      Gửi phản hồi
                    </button>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="text-red-500 py-1 px-4 hover:underline"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              {comment.replies.length > 0 && (
                <div className="mt-6 space-y-4 pl-8 border-l-2 border-gray-200">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-blue-700">
                            {reply.user.name}
                          </span>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <p className="text-gray-700 text-sm">{reply.content}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>
                            • {new Date(reply.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {comments.length > visibleComments && !showMore && (
        <button
          onClick={handleLoadMore}
          className="w-full bg-gray-200 text-gray-700 py-2 mt-6 rounded-lg hover:bg-gray-300 transition"
        >
          Xem thêm bình luận ({comments.length - visibleComments} bình luận)
        </button>
      )}
    </div>
  );
}








// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux"; // 
// import { selectUser } from "../../types/user/userSlice";


// type Comment = {
//   id: number;
//   username: string;
//   avatar: string;
//   level: number;
//   content: string;
//   time: string;
//   likes: number;
//   replies: Comment[];
// };

// export default function CommentSection() {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
//   const [replyingTo, setReplyingTo] = useState<number | null>(null);
//   const [visibleComments, setVisibleComments] = useState(5); 
//   const [showMore, setShowMore] = useState(false);

//   const navigate = useNavigate();
//   const user = useSelector(selectUser);


//   // Load comments từ localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("comments");
//     if (saved) {
//       setComments(JSON.parse(saved));
//     }
//   }, []);

//   // Cập nhật localStorage mỗi khi comments thay đổi
//   useEffect(() => {
//     localStorage.setItem("comments", JSON.stringify(comments));
//   }, [comments]);

//   const handlePostComment = () => {
//     if (!user) {
//       navigate("/auth/login/");
//       return;
//     }

//     if (newComment.trim() === "") return;

//     const comment: Comment = {
//       id: Date.now(),
//       username: user.name,
//       avatar: user.avatar,
//       level: user.level || 1,
//       content: newComment.trim(),
//       time: "Vừa xong",
//       likes: 0,
//       replies: [],
//     };

//     setComments([comment, ...comments]);
//     setNewComment("");
//   };

//   const handleLoadMore = () => {
//     setVisibleComments(comments.length); // Hiển thị tất cả bình luận
//     setShowMore(true); // Ẩn nút "Xem thêm bình luận"
//   };

//   const handlePostReply = (parentId: number) => {
//     if (!user) {
//         navigate("/auth/login/");
//       return;
//     }

//     const replyText = replyContent[parentId];
//     if (!replyText || replyText.trim() === "") return;

//     const reply: Comment = {
//       id: Date.now(),
//       username: user.name,
//       avatar: user.avatar,
//       level: user.level || 1,
//       content: replyText.trim(),
//       time: "Vừa xong",
//       likes: 0,
//       replies: [],
//     };

//     setComments((prev) =>
//       prev.map((comment) =>
//         comment.id === parentId
//           ? { ...comment, replies: [...comment.replies, reply] }
//           : comment
//       )
//     );
//     setReplyingTo(null);
//     setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
//   };

//   const handleLike = (id: number, parentId?: number) => {
//     if (parentId) {
//       setComments((prev) =>
//         prev.map((c) =>
//           c.id === parentId
//             ? {
//                 ...c,
//                 replies: c.replies.map((r) =>
//                   r.id === id ? { ...r, likes: r.likes + 1 } : r
//                 ),
//               }
//             : c
//         )
//       );
//     } else {
//       setComments((prev) =>
//         prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
//       );
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       {/* Header */}
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Bình luận</h2>

//       {/* New Comment */}
//       <div className="flex flex-col mb-6">
//         <textarea
//           className="w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//           placeholder="Mời bạn để lại bình luận..."
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//         />
//         <button
//           onClick={handlePostComment}
//           className="self-end mt-3 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
//         >
//           Gửi bình luận
//         </button>
//       </div>

//       {/* Comment List */}
//       <div className="space-y-8">
//         {comments.map((comment) => (
//           <div key={comment.id} className="flex flex-col sm:flex-row gap-4">
//             <img
//               src={comment.avatar}
//               alt="Avatar"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="font-semibold text-blue-700">{comment.username}</span>
//                 <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                   Cấp {comment.level}
//                 </span>
//               </div>
//               <div className="bg-gray-100 p-4 rounded-lg">
//                 <p className="text-gray-800">{comment.content}</p>
//               </div>
//               <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
//                 <button
//                   onClick={() => setReplyingTo(comment.id)}
//                   className="hover:underline"
//                 >
//                   💬 Trả lời
//                 </button>
//                 <button
//                   onClick={() => handleLike(comment.id)}
//                   className="hover:underline"
//                 >
//                   👍 {comment.likes}
//                 </button>
//                 <span>• {comment.time}</span>
//               </div>

//               {/* Reply Section */}
//               {replyingTo === comment.id && (
//                 <div className="mt-4 pl-8">
//                   <textarea
//                     className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//                     placeholder="Nhập phản hồi..."
//                     rows={2}
//                     value={replyContent[comment.id] || ""}
//                     onChange={(e) =>
//                       setReplyContent((prev) => ({
//                         ...prev,
//                         [comment.id]: e.target.value,
//                       }))
//                     }
//                   />
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => handlePostReply(comment.id)}
//                       className="bg-orange-500 text-white py-1 px-4 rounded-lg hover:bg-orange-600 transition"
//                     >
//                       Gửi phản hồi
//                     </button>
//                     <button
//                       onClick={() => setReplyingTo(null)}
//                       className="text-red-500 py-1 px-4 hover:underline"
//                     >
//                       Hủy
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Show replies */}
//               {comment.replies.length > 0 && (
//                 <div className="mt-6 space-y-4 pl-8 border-l-2 border-gray-200">
//                   {comment.replies.map((reply) => (
//                     <div key={reply.id} className="flex flex-col sm:flex-row gap-3">
//                       <img
//                         src={reply.avatar}
//                         alt="Avatar"
//                         className="w-10 h-10 rounded-full object-cover"
//                       />
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-blue-700">{reply.username}</span>
//                           <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
//                             Cấp {reply.level}
//                           </span>
//                         </div>
//                         <div className="bg-gray-100 p-3 rounded-lg">
//                           <p className="text-gray-700 text-sm">{reply.content}</p>
//                         </div>
//                         <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                           <button
//                             onClick={() => setReplyingTo(comment.id)}
//                             className="hover:underline"
//                           >
//                             💬 Trả lời
//                           </button>
//                           <button
//                             onClick={() => handleLike(reply.id, comment.id)}
//                             className="hover:underline"
//                           >
//                             👍 {reply.likes}
//                           </button>
//                           <span>• {reply.time}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Nút Xem thêm */}
//     {comments.length > visibleComments && !showMore && (
//         <button
//           onClick={handleLoadMore}
//           className="w-full bg-gray-200 text-gray-700 py-2 mt-6 rounded-lg hover:bg-gray-300 transition"
//         >
//           Xem thêm bình luận ({comments.length - visibleComments} bình luận)
//         </button>
//      )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { selectUser } from "../../types/user/userSlice";
// import axios from "axios";

// type Comment = {
//   id: string;
//   user: {
//     username: string;
//     email: string;
//     name: string;
//     id: number;
//   };
//   content: string;
//   created_at: string;
//   parent?: string;
//   replies: Comment[];
//   post_id: string;
//   type: string;
// };

// type CommentSectionProps = {
//   postId: string;
//   type: string;
// };

// export default function CommentSection({ postId, type }: CommentSectionProps) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [visibleComments, setVisibleComments] = useState(5);
//   const [showMore, setShowMore] = useState(false);

//   const navigate = useNavigate();
//   const user = useSelector(selectUser);

//   const fetchComments = async () => {
//     try {

//       const res = await axios.get("http://localhost:8000/api/user/comment/", {
//         headers: {
//           Authorization: `Bearer ${yourToken}`,
//         },
//       });

      
      

//       const allComments: Comment[] = res.data;

//       const filtered = allComments.filter(
//         (c) => c.post_id === postId && c.type === type
//       );

//       const topLevel = filtered.filter((c) => !c.parent);
//       topLevel.forEach((c) => {
//         c.replies = filtered.filter((r) => r.parent === c.id);
//       });
//       setComments(topLevel);
//     } catch (err) {
//       console.error("Lỗi khi tải bình luận:", err);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, [postId, type]);

//   const handlePostComment = async () => {
//     if (!user) return navigate("/auth/login/");
//     if (newComment.trim() === "") return;

//     try {
//       await axios.post(
//         "http://localhost:8000/api/user/comment/",
//         {
//           content: newComment,
//           type,
//           post_id: postId,
//         },
//         { withCredentials: true }
//       );
//       setNewComment("");
//       fetchComments();
//     } catch (err) {
//       console.error("Lỗi khi gửi bình luận:", err);
//     }
//   };

//   const handlePostReply = async (parentId: string) => {
//     if (!user) return navigate("/auth/login/");
//     const content = replyContent[parentId];
//     if (!content || content.trim() === "") return;

//     try {
//       await axios.post(
//         "http://localhost:8000/api/user/comment/",
//         {
//           content: content,
//           type,
//           post_id: postId,
//           parent: parentId,
//         },
//         { withCredentials: true }
//       );
//       setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
//       setReplyingTo(null);
//       fetchComments();
//     } catch (err) {
//       console.error("Lỗi khi gửi phản hồi:", err);
//     }
//   };

//   const handleLoadMore = () => {
//     setVisibleComments(comments.length);
//     setShowMore(true);
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800">Bình luận</h2>

//       <div className="flex flex-col mb-6">
//         <textarea
//           className="w-full p-4 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//           placeholder="Mời bạn để lại bình luận..."
//           rows={3}
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//         />
//         <button
//           onClick={handlePostComment}
//           className="self-end mt-3 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition"
//         >
//           Gửi bình luận
//         </button>
//       </div>

//       <div className="space-y-8">
//         {comments.slice(0, visibleComments).map((comment) => (
//           <div key={comment.id} className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <div className="flex items-center gap-2 mb-1">
//                 <span className="font-semibold text-blue-700">
//                   {comment.user.name}
//                 </span>
//               </div>
//               <div className="bg-gray-100 p-4 rounded-lg">
//                 <p className="text-gray-800">{comment.content}</p>
//               </div>
//               <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
//                 <button
//                   onClick={() => setReplyingTo(comment.id)}
//                   className="hover:underline"
//                 >
//                   💬 Trả lời
//                 </button>
//                 <span>• {new Date(comment.created_at).toLocaleString()}</span>
//               </div>

//               {replyingTo === comment.id && (
//                 <div className="mt-4 pl-8">
//                   <textarea
//                     className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//                     placeholder="Nhập phản hồi..."
//                     rows={2}
//                     value={replyContent[comment.id] || ""}
//                     onChange={(e) =>
//                       setReplyContent((prev) => ({
//                         ...prev,
//                         [comment.id]: e.target.value,
//                       }))
//                     }
//                   />
//                   <div className="flex gap-2 mt-2">
//                     <button
//                       onClick={() => handlePostReply(comment.id)}
//                       className="bg-orange-500 text-white py-1 px-4 rounded-lg hover:bg-orange-600 transition"
//                     >
//                       Gửi phản hồi
//                     </button>
//                     <button
//                       onClick={() => setReplyingTo(null)}
//                       className="text-red-500 py-1 px-4 hover:underline"
//                     >
//                       Hủy
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {comment.replies.length > 0 && (
//                 <div className="mt-6 space-y-4 pl-8 border-l-2 border-gray-200">
//                   {comment.replies.map((reply) => (
//                     <div key={reply.id} className="flex flex-col sm:flex-row gap-3">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-blue-700">
//                             {reply.user.name}
//                           </span>
//                         </div>
//                         <div className="bg-gray-100 p-3 rounded-lg">
//                           <p className="text-gray-700 text-sm">{reply.content}</p>
//                         </div>
//                         <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
//                           <button
//                             onClick={() => setReplyingTo(comment.id)}
//                             className="hover:underline"
//                           >
//                             💬 Trả lời
//                           </button>
//                           <span>
//                             • {new Date(reply.created_at).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {comments.length > visibleComments && !showMore && (
//         <button
//           onClick={handleLoadMore}
//           className="w-full bg-gray-200 text-gray-700 py-2 mt-6 rounded-lg hover:bg-gray-300 transition"
//         >
//           Xem thêm bình luận ({comments.length - visibleComments} bình luận)
//         </button>
//       )}
//     </div>
//   );
// }










































































































































































































































