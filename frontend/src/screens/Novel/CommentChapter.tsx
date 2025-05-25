
// Bản mởi nhất comments


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
// import axios from "axios";
import { selectUser } from "../../types/user/userSlice";
import {fetchComments, postComment} from "../../actions/commentAction"
// import { useComment } from "../../actions/userActions";
type Comment = {
  _id: string;
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
  type: string;
  manga: number;
  novel: number;
  manga_chapter: number;
  novel_chapter: number;
};

type CommentSectionProps = {
  postId: number|string;
  type: "novel_chapter" | "manga_chapter" | "manga" | "novel" | "forum";
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

  // Fetch comments from backend
  const loadComments = async (type: string) => {
    try {
      console.log("postId",postId)
      const allComments: Comment[] = await fetchComments(postId.toString(), type);
      console.log("allComments", allComments)
      const topLevel = allComments.filter((c) => !c.parent);
      topLevel.forEach((c) => {
        c.replies = allComments.filter((r) => r.parent === c._id);
      });
      setComments(topLevel);
    } catch (err) {
      console.error("Lỗi khi tải bình luận:", err);
    }
  };

  const handlePostComment = async () => 
  {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    if (newComment.trim() === "") return;

    const commentData: any = 
    {
      content: newComment.trim(),
    };
    if (type === "novel") commentData.novel = postId;
    else if (type === "manga") commentData.manga = postId;
    else if (type === "novel_chapter") commentData.novel_chapter = postId;
    else if (type === "manga_chapter") commentData.manga_chapter = postId; 

    try 
    {
      console.log("commentData", commentData);
      console.log(document.cookie);
      await loadComments(type);
      await postComment(commentData);
      await loadComments(type);
      console.log("loadComments")
      setNewComment("");
    }
    catch (err) 
    {
      console.error("Lỗi khi gửi bình luận:", err);
    };
  }

  const handlePostReply = async (parentId: string) => {
    if (!user) {
      navigate("/auth/login/");
      return;
    }

    const replyText = replyContent[parentId];
    if (!replyText || replyText.trim() === "") return;

    const replyData: any = {
      content: replyText.trim(),
      parent: parentId,
    };

    if (type === "novel") replyData.novel = postId;
    else if (type === "manga") replyData.manga = postId;
    else if (type === "forum") replyData.forum = postId; 
    else if (type === "novel_chapter") replyData.manga_chapter = postId;
    else if (type === "manga_chapter") replyData.novel_chapter = postId; 

    try 
    {
      await postComment(replyData);
      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
      await loadComments(type);  
    } 
    catch (err) 
    {
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
          <div key={comment._id} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-blue-700">{comment.user.name}</span>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-800">{comment.content}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                <button
                  onClick={() => setReplyingTo(comment._id)}
                  className="hover:underline"
                >
                  💬 Trả lời
                </button>
                <span>• {new Date(comment.created_at).toLocaleString()}</span>
              </div>

              {replyingTo === comment._id && (
                <div className="mt-4 pl-8">
                  <textarea
                    className="w-full p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Nhập phản hồi..."
                    rows={2}
                    value={replyContent[comment._id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [comment._id]: e.target.value,
                      }))
                    }
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handlePostReply(comment._id)}
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
                    <div key={reply._id} className="flex flex-col sm:flex-row gap-3">
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