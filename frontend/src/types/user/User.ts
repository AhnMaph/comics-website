export interface User{
    id:number,
    username:string
    first_name?:string,
    email:string,
    cover:string,
    group?:string,
    status?: string,
    password?: string,
    date_joined?: string,
    bio?: string,
}
export interface typeContent{
    type: 'novel' | 'manga' | 'audio' | 'forum'
}
export interface isValidToken extends User {
    valid:boolean,
}

export interface LikeProp{
    post_id: string;
    type: typeContent['type'];
}
export interface FavoriteProp{
    user_id: string;
    post_id: string;
    type: typeContent['type'];
}
export interface ListFavoriteProp {
    fav: FavoriteProp[];
}
export interface Comment {
    id: number;
    user:User;
    target_model?: string;
    target_object_id?: string;
    content: string;
    parent?: number | null;
    created_at: Date;
    replies?: Comment[];
  }
export interface CommentFormProps {
  submitLabel?: string;
  initialText?: string;
  onSubmit: (text: string) => void;
}
export interface CommentItemProps {
  comment: Comment;
  getReplies?: (id: number) => Comment[];
  addReply: (text: string, parentId: number) => void;
  isNested?: boolean;
}
export interface CommentListProps {
  user?: number;
  type: typeContent["type"];
  post_id: string;
}