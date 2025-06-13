import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Novel } from '../../types/novel/novelDetails';
import { updateLike, updateFavorite } from "../../actions/userAction";
import { NovelChapter } from '../../types/novel/novelChapters';
import { fetchStoryDetails, fetchStoryChapters, fetchNovel } from '../../actions/novelAction'; 
import { faEye, faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";
import { CommentList } from "../../components/CommentGrid";

// Helper: Lấy ngẫu nhiên n novel, loại trừ id nếu có
function getRandomNovels(n: number, novels: Novel[], excludeId?: string) {
  const filtered = excludeId ? novels.filter(nv => nv._id !== excludeId) : novels;
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// Component: Thông tin truyện
function NovelInfo({
  story,
  firstChapter,
  lastChapter,
  onLike,
  onFavorite,
}: {
  story: Novel;
  firstChapter?: NovelChapter;
  lastChapter?: NovelChapter;
  onLike: () => void;
  onFavorite: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-5 items-start">
      {/* Ảnh bìa */}
      <div className="w-1/2 md:w-[200px] flex-shrink-0 mx-auto md:mx-0">
        <img
          src={story.cover_image}
          alt="Ảnh bìa"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
      {/* Thông tin */}
      <div style={{ flex: 1 }}>
        <h1 className="mb-2">{story.title}</h1>
        <p>
          <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" /> {story.numViews}
          <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 pl-5.5" /> {story.numFavorites}
          <FontAwesomeIcon icon={faCommentDots} className="w-3.5 h-3.5 pl-5.5" /> {story.numComments}
        </p>
        <p><span className="Emphasize font-bold">Tác giả: </span> {story.author}</p>
        <p>
          <span className="Emphasize font-bold">Thể loại: </span>
          {Array.isArray(story.genres) &&
            story.genres.map((genre: { _id: string; name: string }, index: number) => (
              <span key={genre._id}>
                <Link
                  to={`/avsearch?include_genres=${genre._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {genre.name}
                </Link>
                {index < story.genres.length - 1 && ', '}
              </span>
            ))}
        </p>
        <p><span className="Emphasize font-bold">Trạng thái: </span> {story.status}</p>
        <p>
          <span className="Emphasize font-bold">Cập nhật: </span>
          {new Date(story.updated_at).toLocaleDateString('vi-VN')}
        </p>
        <p><span className="Emphasize font-bold">Lượt favorites: </span> {story.numFavorites}</p>
        <div className="justify-between mt-2">
          {firstChapter && (
            <Link to={`/novel/chapter/${firstChapter._id}`}>
              <button className="text-white bg-orange-500 hover:bg-yellow-400 px-2 mr-2 py-2 rounded">Đọc từ đầu</button>
            </Link>
          )}
          {lastChapter && (
            <Link to={`/novel/chapter/${lastChapter._id}`}>
              <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-0.5 px-2 py-2 rounded">Đọc mới nhất</button>
            </Link>
          )}
          <button
            className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded"
            onClick={onLike}
          >
            Thích ({story.numLikes})
          </button>
          <button
            className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded"
            onClick={onFavorite}
          >
            Lưu ({story.numFavorites})
          </button>
        </div>
      </div>
    </div>
  );
}

// Component: Mô tả truyện
function NovelDescription({ description }: { description: string }) {
  return (
    <div className="flex flex-col mt-8">
      <h2 className="Emphasize font-bold text-2xl">Mô tả</h2>
      <p className="text-justify leading-relaxed">
        {description.split('\n').map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </p>
    </div>
  );
}

// Component: Gợi ý truyện
function RecommendBox({ novels }: { novels: Novel[] }) {
  return (
    <aside className="w-full lg:w-70 flex-shrink-0 h-full">
      <div className="bg-white rounded-xl shadow p-4 w-full h-full">
        <h3 className="font-bold text-lg mb-4">Gợi ý cho bạn</h3>
        <div className="space-y-4">
          {novels.map(novel => (
            <Link
              to={`/novel/${novel._id}`}
              key={novel._id}
              className="flex items-center gap-3 hover:bg-sky-100 rounded p-2 transition"
            >
              <img
                src={novel.cover_image}
                alt={novel.title}
                className="w-20 h-28 md:w-24 md:h-32 object-cover rounded shadow"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm line-clamp-2">{novel.title}</div>
                <div className="text-xs text-gray-500">{novel.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Component: Danh sách chương với nút Load More
function ChapterList({
  chapters,
  visible,
  onLoadMore,
}: {
  chapters: NovelChapter[];
  visible: number;
  onLoadMore: () => void;
}) {
  const rows = Array.from({ length: Math.ceil(chapters.length / 3) });
  return (
    <div className="flex-1 mt-10">
      <div className="bg-orange-300 text-center py-2">
        <h2 className="text-xl font-semibold">DANH SÁCH CHƯƠNG</h2>
      </div>
      <div className="mt-4 divide-y divide-orange-200">
        {rows.slice(0, visible).map((_, rowIndex) => (
          <div key={rowIndex} className="py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-center">
              {chapters.slice(rowIndex * 3, rowIndex * 3 + 3).map((chapter, colIndex) => (
                <div key={colIndex}>
                  <Link
                    to={`/novel/chapter/${chapter._id}`}
                    className="text-neutral-700 hover:text-orange-500 dark:text-white"
                  >
                    Chương {chapter.chapter_number}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        {visible < rows.length && (
          <div className="text-center mt-4">
            <button
              onClick={onLoadMore}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Main Page
const StoryDetailPage = () => {
  const { postId } = useParams();
  const [story, setStory] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<NovelChapter[]>([]);
  const [allNovels, setAllNovels] = useState<Novel[]>([]);
  const [visible, setVisible] = useState(15);

  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];

  useEffect(() => {
    setVisible(15); 
  }, [postId]);

  // Lấy dữ liệu truyện
  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchStoryDetails(String(postId));
        setStory(detail);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
    };
    fetchData();
  }, [postId]);

  // Lấy danh sách chương
  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const chapterList = await fetchStoryChapters(String(postId));
        setChapters(chapterList);
      } catch (error) {
        console.error("Lỗi khi load chương:", error);
      }
    };
    fetchChapter();
  }, [postId]);

  // Lấy tất cả novel để gợi ý
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const novels = await fetchNovel(1);
        setAllNovels(novels);
      } catch (error) {
        console.error("Lỗi khi load danh sách truyện:", error);
      }
    };
    fetchAll();
  }, []);

  // Xử lý sự kiện
  const handleLoadMore = () => setVisible(prev => prev + 10);

  const handleFavoriteClick = async () => {
    if (!postId) return;
    try {
      const updated = await updateFavorite({ post_id: postId, type: "novel" });
      if (story) setStory({ ...story, numFavorites: updated.numFavorites });
    } catch (error) {
      console.error("Lỗi khi cập nhật số fav:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!postId) return;
    try {
      const updated = await updateLike({ post_id: postId, type: "novel" });
      if (story) setStory({ ...story, numLikes: updated.numLikes });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt thích:", error);
    }
  };

  const recommends = useMemo(
    () => getRandomNovels(10, allNovels, story?._id),
    [allNovels, story?._id]
  );

  return (
    <div className="max-w-screen-lg mx-auto px-0 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-screen">
        <div className="flex-1">
          {story ? (
            <>
              <NovelInfo
                story={story}
                firstChapter={firstChapter}
                lastChapter={lastChapter}
                onLike={handleLikeClick}
                onFavorite={handleFavoriteClick}
              />
              <NovelDescription description={story.description} />
            </>
          ) : (
            <p>Đang tải truyện...</p>
          )}
        </div>
        <RecommendBox novels={recommends} />
      </div>
      <ChapterList chapters={chapters} visible={visible} onLoadMore={handleLoadMore} />
      <div className="flex-1 mt-10">
        <CommentList />
      </div>
    </div>
  );
};

export default StoryDetailPage;