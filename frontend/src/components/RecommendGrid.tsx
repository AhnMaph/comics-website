// imports
import { Link} from 'react-router-dom';
import { Manga } from '../types/manga/mangaDetails';
import {Novel} from '../types/novel/novelDetails';
import { useEffect, useState } from 'react';
import { fetchAdvancedSearch, parseQueryToFilters } from '../actions/searchActions';
import { AdvancedFilter } from '../types/search/advanceSearch';
import { Genre } from '../types/genre/genreDetails';
// component
function getRandom(n: number, mangas: Manga[], excludeId?: string) {
  const filtered = excludeId ? mangas.filter(m => m._id !== excludeId) : mangas;
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}
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
const RecommendGrid = ({ type, genre, currentId }: { type:string, genre: Genre|undefined, currentId:string }) => {
  if(type !== 'manga' && type !== 'novel') {
    return <p className="text-red-500">Loại truyện không hợp lệ.</p>;
  }
  const [results, setResults] = useState<Manga[]|Novel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
      const fetchData = async () => {
        console.log("Fetching data for genre:", genre?._id, "and type:", type);
        const filters: AdvancedFilter = parseQueryToFilters(`?include_genres=${genre?._id}`);
        console.log("Parsed Filters:", filters);
        const results = await fetchAdvancedSearch(filters, type);
        const filteredResults = getRandom(10, results, currentId);
        setResults(filteredResults);
        setLoading(false);
      };
  
      fetchData();
    }, [currentId]);
  if (!results || results.length === 0|| genre?._id === undefined) {
    return <p className="text-gray-500">Không có truyện nào để hiển thị.</p>;
  }
  if (loading) {
    return <p className="text-gray-500">Đang tải...</p>;
  }
  return (
    <aside className="w-full lg:w-70 flex-shrink-0 h-full">
      <div className="bg-white rounded-xl shadow p-4 w-full h-[700px] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">Gợi ý cho bạn</h3>
        <div className="space-y-4">
          {results.map(post => (
            <Link
              to={`/${type}/${toSlug(post.title)}/${post._id}`}
              key={post._id}
              className="flex items-center gap-3 hover:bg-sky-100 rounded p-2 transition"
            >
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-20 h-28 md:w-24 md:h-32 object-cover rounded shadow"
              />
              <div className="flex-1">
                <div className="font-semibold text-sm line-clamp-2">{post.title}</div>
                <div className="text-xs text-gray-500">{post.author}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RecommendGrid;
