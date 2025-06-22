import React,{useState} from 'react';
import { searchKeyword } from '../../actions/searchActions';
import {Link} from 'react-router-dom';
interface SearchBarProps {
  isMobile: boolean;
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
const SearchBar:React.FC<SearchBarProps> = ({isMobile}) => {
  const [query,setQuery] = useState<string>('');
  const [results,setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  /* Request về database */
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    // console.log("Input Changed:", query); 
    setQuery(query);  // Cập nhật giá trị query

    // Nếu query trống thì không gọi API và reset kết quả
    if (query.trim() === '') {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await searchKeyword(query, 'novel');
      // console.log("API Response:", response); 
      setResults(response);
      setShowResults(true);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setResults([]);
      setShowResults(false);
    }
  };
  return (
    !isMobile ? (
      <div className="hidden lg:block w-full max-w-4xl relative">
        <input 
          type="text" 
          placeholder="Hôm nay Người đẹp muốn đọc gì..." 
          onChange={handleSearchChange}
          value = {query}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
        />
        {showResults && results.length > 0 ? (
          <ul className="search-results" aria-live="assertive">
            {results.map((item) => (
              <li key={item._id} className="search-result-item">
                <Link to = {`/novel/${toSlug(item.title)}/${item._id}`} 
                    onClick={()=>{
                      setQuery('');
                      setResults([]);
                      setShowResults(false);
                    }}>
                <strong>{item.title}</strong> — {item.author}
                </Link>
              </li>
            ))}
          </ul>
        ) : showResults ? (
          <ul className="search-results" aria-live="assertive">
            <li className="search-result-item">Không tìm thấy kết quả</li>
          </ul>
        ) : null}
      </div>
    ) : (
      <div className="flex w-full items-center px-2 sm:px-3 py-2 sm:py-3 text-left relative">
            <input 
              type="text" 
              placeholder="Hôm nay Người đẹp muốn đọc gì..."
              onChange={handleSearchChange} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none bg-white dark:bg-gray-900 text-black dark:text-white"
            />
            {showResults && results.length > 0 ? (
            <ul className="search-results" aria-live="assertive">
              {results.map((item) => (
                <li key={item.id} className="search-result-item">
                  <strong>{item.title}</strong> — {item.author}
                </li>
              ))}
            </ul>
          ) : showResults ? (
            <ul className="search-results" aria-live="assertive">
              <li className="search-result-item">Không tìm thấy kết quả</li>
            </ul>
          ) : null}
      </div>
    )
  );
  
};

export default SearchBar;
