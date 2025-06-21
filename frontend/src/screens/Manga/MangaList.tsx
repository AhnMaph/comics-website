import { useEffect, useState } from "react";
import { Manga } from '../../types/manga/mangaDetails'; 
import { fetchManga } from "../../actions/mangaActions"; 
import ListGrid from "../../components/ListGrid";

const MangaList = () => {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadNovels = async () => {
      setIsLoading(true);
      const data = await fetchManga(page);
      setMangas(data);
      setIsLoading(false);
    };
    loadNovels();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if(mangas.length!==0)setPage(page + 1);
  };

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">📚 Danh sách truyện ({mangas.length})</h2>

      {isLoading ? (
        <p>Đang tải...</p>
      ) : (
        <ListGrid posts={mangas} type={"manga"} />
      )}

      <div className="flex justify-center items-center gap-6 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>←</span> Trang trước
        </button>

        <span className="text-base font-semibold text-gray-700">
          <span className="text-blue-600">Trang {page}</span>
        </span>
 
        <button
          onClick={handleNextPage}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white shadow-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Trang sau <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default MangaList;
