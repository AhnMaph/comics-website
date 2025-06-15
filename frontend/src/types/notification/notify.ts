export interface Notification {
    _id: string;
    message: string;
    link: string;
    seen: boolean;
    created_at: string;
    user: {
        id: number;
        email: string;
        username: string;
        cover: string;
        groups: any[];
    };
};
