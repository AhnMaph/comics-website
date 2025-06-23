import axios from 'axios';
import { AdvancedFilter } from "../types/search/advanceSearch";
import { Novel } from '../types/novel/novelDetails';
import { GenreState } from '../types/search/advanceSearch';
const baseURL = import.meta.env.VITE_ADMIN_URL;
export const searchKeyword = async(query:string,type:string) =>{
    try
    {
        if (type != "manga" &&type != "audio"&&type != "novel") console.error("Error type not available");
        console.log("URL: ",`${baseURL}/api/${type}/?q=${query}`)
        const response = await axios.get(`${baseURL}/api/${type}/?q=${query}`)
        console.log("DATA: ",response.data)
        return response.data.results;
    }
    catch(error)
    {
        console.error("Unable to search content, error: ",error);
    }

}
export const buildQueryFromFilters = (filters: AdvancedFilter): string => {
  const params = new URLSearchParams();

  Object.entries(filters.genres).forEach(([genreId, state]) => {
    if (state === 1) params.append("include_genres", genreId);
    else if (state === 2) params.append("exclude_genres", genreId);
  });

  if (filters.author) params.set("author", filters.author);
  if (filters.status) params.set("status", filters.status);
  if (filters.minChapters) params.set("minChapters", filters.minChapters.toString());
  if (filters.maxChapters) params.set("maxChapters", filters.maxChapters.toString());

  return params.toString();
};
export const parseQueryToFilters = (query: string): AdvancedFilter => {
  const params = new URLSearchParams(query);
  const genres: Record<string, GenreState> = {};

  // Lặp qua các genres
  params.getAll("include_genres").forEach(id => {
    genres[id] = 1;
  });

  params.getAll("exclude_genres").forEach(id => {
    genres[id] = 2;
  });

  return {
    genres,
    author: params.get("author") || undefined,
    status: params.get("status") || undefined,
    minChapters: params.get("minChapters") ? parseInt(params.get("minChapters")!) : undefined,
    maxChapters: params.get("maxChapters") ? parseInt(params.get("maxChapters")!) : undefined,
  };
};
export const fetchAdvancedSearch = async (
  filters: AdvancedFilter,
  type: string
): Promise<Novel[]> => {
  try {
    if (type !== "manga" && type !== "audio" && type !== "novel")
      throw new Error("Error type not available");

    const queryString = buildQueryFromFilters(filters);

    const response = await axios.get(
      `${baseURL}/api/${type}/advanced-search?${queryString}`
    );

    console.log("Advance search", response.data);
    return response.data.results;
  } catch (error) {
    console.error("Failed to fetch advanced search results:", error);
    return [];
  }
};
