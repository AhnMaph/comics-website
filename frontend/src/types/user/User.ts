export interface User{
    _id:string,
    name:string,
    email:string,
}
export interface isValidToken extends User {
    valid:boolean,
}