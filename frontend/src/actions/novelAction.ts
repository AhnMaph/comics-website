import axios from 'axios';
//import { Dispatch } from 'redux';
import { Novel } from '../types/novel/novelDetails';

const baseURL = import.meta.env.VITE_ADMIN_URL;

export const fetchStoryDetails = async (novelid: string) => {
    try{
      const response = await axios.get(`${baseURL}/api/novel/${novelid}`)
      console.log("novel details:");
      console.log(response.data);
      return response.data;
    }
    catch (error) {
        console.error("Error fetching story details:", error);
        throw error;
    }
};

export const fetchStoryChapters = async (novelid: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/novel/${novelid}/chapters`);
    console.log("list chapters:");
    console.log(response);
    return response.data;
  }

  catch (error) { 
    console.error("Error fetching story chapters:", error);
    throw error;
  }

};

export const fetchChapterDetail = async (chapterId: string) => {
  try {
    const response = await axios.get(`${baseURL}/api/novel/chapter/${chapterId}`);
    console.log("chapter details:");
    console.log(response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching chapter detail:", error);
    throw error;
  }
};

export const fetchNovel = async (page=1): Promise<Novel[]> => {
    try {
            const response = await fetch(`${baseURL}/api/novel/?page=${page}`);
            console.log(response)
            console.log(`${baseURL}/api/novel/?page=${page}`)
            const data = await response.json();
            return Array.isArray(data.results) ? data.results : [];
        } catch (error) {
            console.error("Failed to fetch novel:", error);
            return [];
        }
};
interface Chapter {
  id: string;
  title: string;
  content?: string; // For novels
  images?: File[]; // For manga
}

interface ContentData {
  type: 'novel' | 'manga';
  title: string;
  description: string;
  genres: string[];
  cover_image: File | null;
  chapters: Chapter[];
}
export const uploadContent = async (data: ContentData) => {
  const formData = new FormData();

  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('type', data.type);
  formData.append('genres', JSON.stringify(data.genres));

  if (data.cover_image) {
    formData.append('cover_image', data.cover_image);
  }

  // Append chapters
  data.chapters.forEach((chapter, index) => {
    formData.append(`chapters[${index}][title]`, chapter.title);
    
    if (data.type === 'novel' && chapter.content) {
      formData.append(`chapters[${index}][content]`, chapter.content);
    }

    if (data.type === 'manga' && chapter.images) {
      chapter.images.forEach((img, imgIdx) => {
        formData.append(`chapters[${index}][images][${imgIdx}]`, img);
      });
    }
  });

  const response = await axios.post(`/api/upload-${data.type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
export const getUploader = async (uploader:string): Promise<Novel[]> => {
    try {
            const response = await axios.get(`${baseURL}/api/novel/uploader/${uploader}/`);
            console.log("Uploader: ",response.data)
            console.log(`uploader: ${baseURL}/api/novel/uploader/${uploader}/`)
            return Array.isArray(response.data.post) ? response.data.post : [];
        } catch (error) {
            console.error("Failed to fetch novel:", error);
            return [];
        }
};