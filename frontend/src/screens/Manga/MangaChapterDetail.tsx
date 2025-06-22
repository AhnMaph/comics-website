import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MangaChapter } from '../../types/manga/mangaChapters';
import { fetchMangaChapterDetail, fetchMangaChapters } from '../../actions/mangaActions';
import { CommentList } from '../../components/CommentGrid';
function toSlug(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
const ChapterMangaDetailPage = () => {
  const { chapterId, postName } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<MangaChapter & {
    previousChapterId?: string | null;
    nextChapterId?: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chapterId) return;
        const currentChapter = await fetchMangaChapterDetail(chapterId);
        const chapterList = await fetchMangaChapters(currentChapter.manga);

        const currentNumber = currentChapter.chapter_number;

        // Find previous and next chapter IDs
        const previous = chapterList
          .filter((c: MangaChapter) => c.chapter_number === currentNumber - 1)
          .sort((a: MangaChapter, b: MangaChapter) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?._id || null;

        const next = chapterList
          .filter((c: MangaChapter) => c.chapter_number === currentNumber + 1)
          .sort((a: MangaChapter, b: MangaChapter) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]?._id || null;

        setChapter({
          ...currentChapter,
          previousChapterId: previous,
          nextChapterId: next,
        });
      } catch (err) {
        console.error("Lỗi khi tải nội dung chương:", err);
      }
    };
    fetchData();
  }, [chapterId]);

  const goToPrevious = () => {
    if (chapter?.previousChapterId) {
      navigate(`/manga/${postName}/chapter/${toSlug(chapter.title)}/${chapter.previousChapterId}`);
    }
  };

  const goToNext = () => {
    if (chapter?.nextChapterId) {
      navigate(`/manga/${postName}/chapter/${toSlug(chapter.title)}/${chapter.nextChapterId}`);
    }
  };

  if (!chapter) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <span className="text-lg text-gray-500">Đang tải chương...</span>
    </div>
  );

  return (
    <div className="max-w-4xl lg:max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-orange-600 mb-4 sm:mb-6 drop-shadow">
        {chapter.title}
      </h1>

      <div className="flex flex-col items-center sm:mb-8">
        {chapter.images && chapter.images.length > 0 ? (
          chapter.images.map((img: any, index: number) => (
            <img
              key={index}
              src={img.image}
              alt={`Trang ${img.page}`}
              className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl rounded-none shadow-none border-none m-0 p-0"
              style={{ background: "#fff", display: 'block' }}
              loading="lazy"
            />
          ))
        ) : (
          <div className="text-center text-gray-400 italic">
            Chưa có ảnh cho chương này.
          </div>
        )}
      </div>


      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-6 mb-6 sm:mt-8 sm:mb-8 overflow-x-auto">
        <button
          onClick={goToPrevious}
          disabled={!chapter.previousChapterId}
          className={`w-full sm:w-auto mb-2 sm:mb-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 shadow ${
            chapter.previousChapterId
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <span className="inline sm:hidden">&lt;</span>
          <span className="hidden sm:inline">⬅ Chương trước</span>
        </button>

        <Link to={`/manga/${toSlug(chapter.title)}/${chapter.manga}`} className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow">
            📚 Chi tiết
          </button>
        </Link>

        <button
          onClick={goToNext}
          disabled={!chapter.nextChapterId}
          className={`w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-200 shadow ${
            chapter.nextChapterId
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <span className="inline sm:hidden">&gt;</span>
          <span className="hidden sm:inline">Chương sau ➡</span>
          
        </button>
      </div>

      <div className="mt-8 sm:mt-10">
        <CommentList />
      </div>
    </div>
  );
};

export default ChapterMangaDetailPage;