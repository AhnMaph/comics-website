import React, { useEffect, useState } from "react";
import { fetchGenre } from "../../actions/genreAction";
import type { Genre } from "../../types/genre/genreDetails";

const Genre: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenre();
        setGenres(data); // Đảm bảo đây là một mảng
      } catch (err) {
        setError("Lỗi khi tải thể loại!");
      } finally {
        setLoading(false);
      }
    };
    getGenres();
  }, []);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full max-w-screen-lg overflow-hidden relative flex justify-center mx-auto mt-3">
        <div className="h-[50px]"></div>
        <div className="w-full max-w-screen-lg overflow-hidden relative"> 
            <h2 className="font-bold text-lg">🌟 THỂ LOẠI 🌟</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mx-auto items-center justify-center">
                {genres.length > 0 ? (
                    genres.map((genre) => (
                    <div>
                        <button className=" bg-white text-black text-sm w-full  hover:bg-yellow-400">
                                <a className="text-black hover:text-white" href={`/tim-truyen/${genre.name}`}>{genre.name}</a>
                        </button>
                    </div>
                    ))
                ) : (
                    <p>Không có thể loại nào!</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Genre;
