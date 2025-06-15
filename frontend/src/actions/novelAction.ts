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