import React, { useEffect, useState, useRef } from "react";
import { GenreState, AdvancedFilter, STATUS_OPTIONS } from "../../types/search/advanceSearch";
import { Novel } from '../../types/novel/novelDetails';
import { Genre } from "../../types/genre/genreDetails";
import {fetchGenre} from "../../actions/genreAction"; // nếu có API thật, bạn gọi từ đây
import NovelGrid from "../../components/NovelGrid";
import { useNavigate, useLocation } from "react-router-dom";
import { buildQueryFromFilters } from "../../actions/searchActions"; // nếu có hàm này, bạn gọi từ utils
import { parseQueryToFilters, fetchAdvancedSearch } from "../../actions/searchActions"; // nếu có hàm này, bạn gọi từ utils
const genreStates = ["❌ Không chọn", "✅ Bao gồm", "🚫 Loại trừ"];
const genreColors = ["bg-gray-200", "bg-green-300", "bg-red-300"]; // thêm màu tuỳ thích

const AdvancedSearch: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<AdvancedFilter>({ genres: {} });
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [results, setResults] = useState<Novel[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();


  

  useEffect(() =>{
    const loadGenres = async () => {
        const data = await fetchGenre();
        setAllGenres(data);
        };
        loadGenres();
  }, []);

   useEffect(() => {
    const fetchData = async () => {
      const filters: AdvancedFilter = parseQueryToFilters(location.search);
      console.log("Parsed Filters:", filters);
      const results = await fetchAdvancedSearch(filters, "novel"); // hoặc "manga", tùy bạn
      setResults(results);
      setLoading(false);
    };

    fetchData();
  }, [location.search]); 


  useEffect(() => {
  if (!loading && results.length > 0 && resultsRef.current) {
    resultsRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [results, loading]);

  const toggleGenreState = (genreId: string) => {
    //Cập nhật filter
    setFilters(prev => {
      const prevState = prev.genres[genreId] || 0;
      const newState = (prevState + 1) % 3 as GenreState;
      return {
        ...prev,
        genres: {
          ...prev.genres,
          [genreId]: newState,
        },
      };
    });
  };

  const handleOnClick = () => {
  const queryString = buildQueryFromFilters(filters);
  console.log(`Query String: ${queryString}`); // In ra query string để kiểm tra
  navigate(`/avsearch?${queryString}`);
};

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Bộ lọc nâng cao</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {allGenres.map(g => {
          const state = filters.genres[g._id] ?? 0;
          return (
            <button
              key={g._id}
              onClick={() => toggleGenreState(g._id)}
              className={`px-3 py-1 rounded ${genreColors[state]} hover:opacity-80 text-black transition-all`}
              title={genreStates[state]}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <input
        type="text"
        placeholder="Tác giả"
        className="border p-2 w-full"
        onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
      />

      <select
        value={selectedStatus}
        onChange={(e) => {
          const newStatus = e.target.value;
          setSelectedStatus(newStatus);  // Cập nhật selectedStatus
          setFilters(prev => ({ ...prev, status: newStatus }));  // Cập nhật filters với status mới
        }}
      >
        <option value="">Tất cả</option>
        {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Tối thiểu chương"
        className="border p-2 w-full"
        onChange={(e) =>
          setFilters(prev => ({ ...prev, minChapters: parseInt(e.target.value) || 0 }))
        }
      />

      <button
        onClick={handleOnClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Tìm kiếm
      </button>
      {loading ? (
        <p>Đang tải kết quả...</p>
      ) : results.length === 0 ? (
        <p>Không có kết quả nào phù hợp với bộ lọc của bạn.</p>
      ) : (
       <div ref={resultsRef}>
        <NovelGrid novels={results} />
      </div>

      )}
    </div>
  );
};

export default AdvancedSearch;

