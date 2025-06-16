import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Manga } from '../../types/manga/mangaDetails';
import { updateLike, updateFavorite } from "../../actions/userAction";
import { MangaChapter } from '../../types/manga/mangaChapters';
import { fetchMangaDetails, fetchMangaChapters} from '../../actions/mangaActions'; 
import { faEye, faCommentDots, faHeart, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import { CommentList } from "../../components/CommentGrid";
import RecommendGrid from "../../components/RecommendGrid";
import ReactStars from "react-rating-stars-component";
// Component: Thông tin truyện
function MangaInfo({ story, firstChapter, lastChapter, onLike, onFavorite }: any) {
  return (
    <div className="flex flex-col md:flex-row gap-5 items-start max-h-[600px]">
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
          <FontAwesomeIcon icon={faThumbsUp} className="w-3.5 h-3.5 pl-5.5" /> {story.numLikes}
          <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 pl-5.5" /> {story.numFavorites}
          <FontAwesomeIcon icon={faCommentDots} className="w-3.5 h-3.5 pl-5.5" /> {story.numComments}
        </p>
        <p><span className="font-bold">Tác giả:</span> {story.author}</p>
        <p>
          <span className="font-bold">Thể loại:</span>{" "}
          {Array.isArray(story.genres) &&
            story.genres.map((genre: {_id: string; name: string}, idx: number) => (
              <span key={genre._id}>
                {genre.name}
                {idx < story.genres.length - 1 && ', '}
              </span>
            ))}
        </p>
        <p><span className="font-bold">Trạng thái:</span> {story.status}</p>
        <p><span className="font-bold">Cập nhật:</span> {new Date(story.updated_at).toLocaleDateString('vi-VN')}</p>
        <div className="justify-between mt-2">
          {firstChapter && (
            <Link to={`/manga/chapter/${firstChapter._id}`}>
              <button className="text-white bg-orange-500 hover:bg-yellow-400 px-2 mr-2 py-2 rounded">Đọc từ đầu</button>
            </Link>
          )}
          {lastChapter && (
            <Link to={`/manga/chapter/${lastChapter._id}`}>
              <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded">Đọc mới nhất</button>
            </Link>
          )}
          <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded" onClick={onLike}>
            Thích ({story.numLikes})
          </button>
          <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded" onClick={onFavorite}>
            Lưu ({story.numFavorites})
          </button>
        </div>
      </div>
    </div>
    
  );
}


// Component: Mô tả truyện
function Description({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > 600);
      setExpanded(el.scrollHeight <= 600); 
    }
  }, [description]);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="flex flex-col mt-8">
      <h2 className="Emphasize font-bold text-2xl mb-2">Mô tả</h2>

      <div
        ref={contentRef}
        className={`text-justify leading-relaxed overflow-hidden transition-all duration-300 ${
          expanded ? 'max-h-full' : 'max-h-[600px]' // Giới hạn chiều cao nếu chưa mở rộng
        }`}
      >
        {description.split('\n').map((line, idx) => (
          <span key={idx}>{line}<br /></span>
        ))}
      </div>

      {isOverflowing && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-blue-500 hover:underline self-start "
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
}
// Component: Danh sách chương
function ChapterList({ chapters, visible, onLoadMore, onCollapse}: any) {
  const rows = Array.from({ length: Math.ceil(chapters.length / 3) });
  const canLoadMore = visible < rows.length;
  const canHide = visible === rows.length && visible > 15
  
  return (
    <div className="flex-1 mt-10">
      <div className="bg-orange-300 text-center py-2">
        <h2 className="text-xl font-semibold">DANH SÁCH CHƯƠNG</h2>
      </div>
      <div className="mt-4 divide-y divide-orange-200">
        {rows.slice(0, visible).map((_, rowIndex) => (
          <div key={rowIndex} className="py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-center">
              {chapters.slice(rowIndex * 3, rowIndex * 3 + 3).map((chapter: MangaChapter, colIndex: number) => (
                <div key={colIndex}>
                  <Link to={`/manga/chapter/${chapter._id}`} className="text-neutral-700 hover:text-orange-500 dark:text-white">
                    Chương {chapter.chapter_number}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-center mt-4">
          {canLoadMore ? (
            <button
              onClick={onLoadMore}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Xem thêm
            </button>
          ) : canHide ?(
            <button
              onClick={onCollapse}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Ẩn bớt
            </button>
          ): null}
        </div>
      </div>
    </div>
  );
}

// Main Page
const StoryDetailPage = () => {
  const { postId } = useParams();
  const [story, setStory] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const [visible, setVisible] = useState(15);
  const handleCollapse = () => setVisible(15);
  const totalRows = Math.ceil(chapters.length / 3);
  const displayRows = Math.min(visible, totalRows)

  useEffect(() => {
    setVisible(15); 
  }, [postId]);

  // Lấy dữ liệu truyện
  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchMangaDetails(String(postId));
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
        const chapterList = await fetchMangaChapters(String(postId));
        setChapters(chapterList);
      } catch (error) {
        console.error("Lỗi khi load chương:", error);
      }
    };
    fetchChapter();
  }, [postId]);

  // Xử lý sự kiện
  const handleLoadMore = () => setVisible(prev => prev + 10);

  const handleFavoriteClick = async () => {
    if (!postId) return;
    try {
      const updated = await updateFavorite(postId, "manga");
      if (story) setStory({ ...story, numFavorites: updated.numFavorites });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt lưu:", error);
    }
  };

  const handleLikeClick = async () => {
    if (!postId) return;
    try {
      const updated = await updateLike({ post_id: postId, type: "manga" });
      if (story) setStory({ ...story, numLikes: updated.numLikes });
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt thích:", error);
    }
  };

  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];

  return (
    <div className="max-w-screen-lg mx-auto px-0 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-screen">
        <div className="flex-1">
          {story ? (
            <>
              <MangaInfo
                story={story}
                firstChapter={firstChapter}
                lastChapter={lastChapter}
                onLike={handleLikeClick}
                onFavorite={handleFavoriteClick}
              />
              <Description description={story.description} />
            </>
          ) : (
            <p>Đang tải truyện...</p>
          )}
        </div>
        {/* Gợi ý truyện */}
        <div className="h-[700px] overflow-y-auto">
          {story ? (
            <>
              <RecommendGrid type="novel" genre={story.genres[0]} currentId={story._id} />
            </>
          ) : (
            <p></p>
          )}
        </div>
      </div>
      <ChapterList chapters={chapters} visible={displayRows} onLoadMore={handleLoadMore} onCollapse={handleCollapse}/>
      <div className="flex-1 mt-10">
        <CommentList />
      </div>
    </div>
  );
};

export default StoryDetailPage;