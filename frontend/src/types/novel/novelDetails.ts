import {Genre} from '../genre/genreDetails';
export interface Novel {
    _id: string;
    title: string;
    author: string;
    description: string;
    cover_image: string;
    created_at: string;
    updated_at: string;
    genres: Genre[];
    source: string;
    numComments: number;
    numViews: number;
    numFavorites: number;
    numChapters: number;
    numLikes: number;
    averageRating: number;
    numRatings: number;
    status: 'completed' | 'ongoing' | 'paused' | 'unverified';
}

