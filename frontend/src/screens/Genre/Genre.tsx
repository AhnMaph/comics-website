import { useEffect, useState } from "react";
import { fetchGenre } from "../../actions/genreAction";
import type { Genre as GenreType } from "../../types/genre/genreDetails";

const Genre = () => {
  const [genres, setGenres] = useState<GenreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGenres = async () => {
      try {
        const data = await fetchGenre();
        setGenres(data);
      } catch {
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
    <div className="w-full max-w-screen-lg mx-auto mt-3">
      <h2 className="font-bold text-lg text-center mb-4">🌟 THỂ LOẠI 🌟</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {genres.length > 0 ? (
          genres.map((genre) => (
            <div key={genre._id}>
              <a
                href={`/avsearch?include_genres=${genre._id}`}
                className="block bg-white text-black text-sm w-full py-2 rounded hover:bg-yellow-400 hover:text-white text-center transition"
              >
                {genre.name}
              </a>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center">Không có thể loại nào!</p>
        )}
      </div>
    </div>
  );
};

export default Genre;