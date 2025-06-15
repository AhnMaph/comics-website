import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Comment, CommentFormProps, CommentItemProps } from '../types/user/User';
import { fetchComments, postComment } from '../actions/userAction';
import { useContentInfo } from '../hooks/useContentInfo';

export const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit = () => {},
  initialText = '',
  submitLabel = 'Đăng bình luận',
}) => {
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <textarea
        className="flex-grow resize-none border border-orange-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition min-h-[80px] max-h-40 w-full sm:w-auto"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Viết bình luận của bạn..."
        rows={3}
      />
      <button
        type="submit"
        className="bg-orange-600 hover:bg-orange-400 text-white font-semibold px-5 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!text.trim()}
      >
        {submitLabel}
      </button>
    </form>
  );
};

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  addReply,
  isNested = false,
}) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className={`my-4 ${isNested ? 'ml-8 sm:ml-12' : ''}`}>
      <div className="flex items-start gap-3">
        {comment.user.cover ? (
          <img
            src={comment.user.cover}
            alt={`${comment.user.username}'s avatar`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 font-semibold uppercase">
            {comment.user.username?.[0] || '?'}
          </div>
        )}

        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/profiles/${comment.user.username}`}
              className="font-semibold text-orange-900"
            >
              {comment.user.username}
            </Link>
            <span className="text-xs text-gray-800">
              • {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-gray-800 whitespace-pre-wrap">{comment.content}</p>

          <button
            onClick={() => setIsReplying((prev) => !prev)}
            className="mt-2 text-sm font-medium text-orange-600 hover:underline focus:outline-none"
            aria-expanded={isReplying}
          >
            {isReplying ? 'Hủy' : 'Trả lời'}
          </button>

          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={(text) => {
                  addReply(text, comment.id);
                  setIsReplying(false);
                }}
                submitLabel="Gửi trả lời"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentList: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { type, objectId } = useContentInfo();

  // Để tham chiếu tới phần cuối cùng khi load thêm để cuộn xuống
  const lastCommentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedComments = await fetchComments({ object_id: objectId, content_type: type });
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [objectId, type]);

  const addComment = async (content: string, parent: number | null = null) => {
    try {
      if (!objectId || !type) return;
      const info = await postComment(objectId, content, type, parent);
      const newComment: Comment = {
        id: info.id,
        parent,
        user: info.user,
        target_model: type,
        target_object_id: objectId,
        content,
        created_at: info.created_at || new Date(),
      };
      setComments((prev) => [newComment, ...prev]);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  interface CommentTree extends Comment {
    children: CommentTree[];
  }

  const buildCommentTree = (comments: Comment[]): CommentTree[] => {
    const commentMap: { [key: number]: CommentTree } = {};
    const tree: CommentTree[] = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, children: [] };
    });

    comments.forEach((comment) => {
      if (comment.parent === null) {
        tree.push(commentMap[comment.id]);
      } else {
        if (comment.parent && commentMap[comment.parent]) {
          commentMap[comment.parent].children.push(commentMap[comment.id]);
        }
      }
    });

    return tree;
  };

  // Giới hạn số comment hiển thị, mặc định 5, tăng dần 5 khi bấm "Xem thêm"
  const [visibleCount, setVisibleCount] = useState(5);

  // Khi visibleCount tăng, cuộn xuống comment cuối mới hiện
  useEffect(() => {
    if (lastCommentRef.current) {
      lastCommentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleCount]);

  const renderComments = (commentTree: CommentTree[], isNested: boolean = false) => {
    // Lọc comment để render dựa vào visibleCount
    const limitedComments = commentTree.slice(0, visibleCount);

    return limitedComments.map((comment, idx) => {
      // Nếu comment này là comment cuối cùng được render, gắn ref để scroll
      const isLastVisible = idx === limitedComments.length - 1;

      return (
        <div key={comment.id} ref={isLastVisible ? lastCommentRef : undefined}>
          <CommentItem comment={comment} addReply={addComment} isNested={isNested} />
          {comment.children.length > 0 && (
            <div className="border-l border-gray-300 pl-4 ml-4 mt-2">
              {renderComments(comment.children, true)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) return <p className="text-center py-10 text-gray-900">Đang tải bình luận...</p>;

  const commentTree = buildCommentTree(comments);

  // Kiểm tra còn comment chưa hiển thị không
  const hasMore = commentTree.length > visibleCount;

  return (
    <section className="max-w-5xl mx-auto mt-10 p-6 bg-amber-50 rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Bình luận</h2>
      <CommentForm onSubmit={(text) => addComment(text)} />
      <div className="mt-8">{renderComments(commentTree)}</div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 3)}
            className="bg-orange-600 hover:bg-orange-300 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Xem thêm bình luận
          </button>
        </div>
      )}
    </section>
  );
};
