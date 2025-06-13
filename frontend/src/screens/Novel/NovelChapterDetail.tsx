import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { NovelChapter } from '../../types/novel/novelChapters';
import { fetchChapterDetail, fetchStoryChapters } from '../../actions/novelAction';
import AudioPlay from '../../components/AudioPlay';
import { CommentList } from '../../components/CommentGrid';

const ChapterDetailPage = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState<(NovelChapter & {
    previousChapterId?: string | null;
    nextChapterId?: string | null;
  }) | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!chapterId) return;
        const currentChapter = await fetchChapterDetail(chapterId);
        const chapterList = await fetchStoryChapters(currentChapter.novel);

        const currentNumber = currentChapter.chapter_number;
        // Tìm chương trước
        const previous = chapterList
          .filter((c: NovelChapter) => c.chapter_number === currentNumber - 1)
          .sort((a: NovelChapter, b: NovelChapter) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )[0]?._id || null;
        // Tìm chương sau
        const next = chapterList
          .filter((c: NovelChapter) => c.chapter_number === currentNumber + 1)
          .sort((a: NovelChapter, b: NovelChapter) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )[0]?._id || null;

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
      navigate(`/novel/chapter/${chapter.previousChapterId}`);
    }
  };

  const goToNext = () => {
    if (chapter?.nextChapterId) {
      navigate(`/novel/chapter/${chapter.nextChapterId}`);
    }
  };

  if (!chapter) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <span className="text-lg text-gray-500">Đang tải chương...</span>
      </div>
    );
  }

  // Button group component
  const ChapterNavButtons = () => (
    <div className="flex flex-row justify-between items-center gap-4 mt-10 ">
      <button
        onClick={goToPrevious}
        disabled={!chapter.previousChapterId}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow ${
          chapter.previousChapterId
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <span className="inline sm:hidden">&lt;</span>
        <span className="hidden sm:inline">⬅ Chương trước</span>
      </button>
      <Link to={`/novel/${chapter.novel}`}>
        <button className="px-6 py-3 rounded-full font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow">
          📚 Chi tiết
        </button>
      </Link>
      <button
        onClick={goToNext}
        disabled={!chapter.nextChapterId}
        className={`px-6 py-3 rounded-full font-medium transition-all duration-200 shadow ${
          chapter.nextChapterId
            ? "bg-orange-500 text-white hover:bg-orange-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <span className="inline sm:hidden">&gt;</span>
        <span className="hidden sm:inline">Chương sau ➡</span>
      </button>
    </div>
  );

  return (
    <div className="w-full lg:max-w-7xl md:max-w-5xl wmx-auto p-4 sm:p-6 md:p-8 mx-auto">
      {/* Audio player */}
      <div id="audio" className="mb-8">
        <AudioPlay
          audioTitle={chapter._id + ".mp3"}
          nextAudio={chapter.nextChapterId}
          preAudio={chapter.previousChapterId}
        />
      </div>

      {/* Chapter navigation buttons (top) */}
      <ChapterNavButtons />

      {/* Chapter title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-orange-600 mb-8 mt-10 drop-shadow">
        Chương {chapter.chapter_number}: {chapter.title}
      </h1>

      {/* Chapter content */}
      <div className="w-full prose prose-2xl text-2xl lg:prose-3xl max-w-8xl mx-auto text-justify leading-relaxed whitespace-pre-wrap bg-amber-50 text-gray-900 p-8 sm:p-12 rounded-3xl shadow-xl mb-10 mt-10">
        {chapter.content}
      </div>

      {/* Chapter navigation buttons (bottom) */}
      <ChapterNavButtons />

      {/* Comment section */}
      <div className="flex-1 mt-10">
        <CommentList />
      </div>
    </div>
  );
};

export default ChapterDetailPage;