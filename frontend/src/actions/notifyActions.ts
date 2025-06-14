import axios from 'axios';
import { useSelector } from "react-redux";
import { selectUser } from "../types/user/userSlice"; 

const baseURL = import.meta.env.VITE_ADMIN_URL;

const handleClick = async () => {
    const userInfo = useSelector(selectUser);
    if (!userInfo) {
        console.log("User not logged in");
        return;
    }
    try {
        const config = {
            headers: {'Content-Type': 'application/json'},
            withCredentials:true,
        };
        const response = await axios.get(
            `${baseURL}/api/notifications/`,  
            config
        ); 

        console.log(response); 
        return response;
    } 
    catch (error) {
        console.error("Error fetching notifications:", error);
    }
};

export default handleClick;