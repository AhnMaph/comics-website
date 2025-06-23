import axios from 'axios';
import { Manga } from '../types/manga/mangaDetails'; 
import { MangaChapter } from '../types/manga/mangaChapters'; 
import { AdvancedFilter } from "../types/search/advanceSearch";
const baseURL = import.meta.env.VITE_ADMIN_URL;

export const fetchMangaDetails = async (mangaid: string) => {
    try{
      const response = await axios.get(`${baseURL}/api/manga/${mangaid}`);
      console.log("manga details:");
      console.log(response.data);
      const mangaData = response.data;
      let coverImage = mangaData.cover_image || '';
      const prefixToRemove = `${baseURL}/media/https%3A/`;
      if (coverImage.startsWith(prefixToRemove)) {
        coverImage = coverImage.replace(prefixToRemove, '');
      }
      console.log("Debug image",coverImage)
      if (coverImage && !coverImage.startsWith('https://')) {
        coverImage = `https://${coverImage}`;
      }
      return {
        ...mangaData,
        cover_image: coverImage,
      };
      
    }
    catch (error) {
        console.error("Error fetching manga details:", error);
        throw error;
    }
};

export const fetchMangaChapters = async (mangaid: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/manga/${mangaid}/chapters`);
    console.log("list chapters:");
      console.log(response.data);
      return response.data;
  }

  catch (error) { 
    console.error("Error fetching manga chapters:", error);
    throw error;
  }

};

export const fetchMangaChapterDetail = async (chapterId: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/manga/chapter/${chapterId}`);
    console.log("Raw response data:", response.data);

    const raw = response.data;
    const chapter: MangaChapter = {
      _id: raw._id,
      manga: raw.manga,
      title: raw.title,
      chapter_number: raw.chapter_number,
      created_at: raw.created_at,
      images: raw.chapterImages.map((img: any) => {
        return {
          ...img,
          image: img.image, // Giữ nguyên URL từ Cloudinary
        };
      }),
      previousChapterId: raw.previousChapterId ?? null,
      nextChapterId: raw.nextChapterId ?? null,
    };
    return chapter;
  } catch (error) {
    console.error("Error fetching chapter detail:", error);
    throw error;
  }
};

const API_BASE_URL = `${baseURL}/api/manga/`
export const fetchManga = async (page = 1): Promise<Manga[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}?page=${page}`);
    console.log(`${baseURL}/api/manga/?page=${page}`);
    const data = await response.json();
    console.log(data);

    // Xử lý dữ liệu để lấy cover_image và làm sạch URL
    const processedData = Array.isArray(data.results)
      ? data.results.map((manga: any) => {
          // Lấy giá trị cover_image
          let coverImage = manga.cover_image || '';

          // Loại bỏ tiền tố http://localhost:8000/media/https%3A/ nếu có
          const prefixToRemove = `${baseURL}/media/https%3A/`;
          if (coverImage.startsWith(prefixToRemove)) {
            coverImage = coverImage.replace(prefixToRemove, '');
          }

          // Đảm bảo URL bắt đầu bằng https://
          if (coverImage && !coverImage.startsWith('https://')) {
            coverImage = `https://${coverImage}`;
          }

          // Trả về đối tượng manga với cover_image đã xử lý
          return {
            ...manga,
            cover_image: coverImage,
          };
        })
      : [];
    console.log("processedData", processedData)
    return processedData;
  } catch (error) {
    console.error("Failed to fetch manga:", error);
    return [];
  }
};

export const fetchAdvancedSearch = async (filters: AdvancedFilter): Promise<Manga[]> => {
    try {
        const query = new URLSearchParams();
        Object.entries(filters.genres).forEach(([genreId, state]) => {
            if(state ===1) query.append("include_genres", genreId);
            else if(state ===2) query.append("exclude_genres", genreId);
        });
        
        if (filters.minChapters) query.set("min_chapters", filters.minChapters.toString());
        if (filters.maxChapters) query.set("min_chapters", filters.maxChapters.toString());
        if (filters.author) query.set("author", filters.author);
        if (filters.status) query.set("status", filters.status);
        const response = await axios.get(`${API_BASE_URL}advanced-search?${query}/`);
        console.log(response.data);
        return response.data.results;
    } catch (error) {
        console.error("Failed to fetch advanced search results:", error);
        return [];
    }
} 