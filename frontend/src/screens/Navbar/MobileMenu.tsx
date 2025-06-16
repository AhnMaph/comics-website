import { Link } from "react-router-dom";
import { navbarItems } from "../../components/Navbarapi";
import {useSelector } from "react-redux";
import {selectUser } from "../../types/user/userSlice";
import { logout } from "../../types/user/userSlice";
import { logoutUser } from "../../actions/userAction";
import { useDispatch } from "react-redux";
import SearchBar from "./SearchBar";
interface MobileMenuProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ setIsOpen }) => {
    const userInfo = useSelector(selectUser);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
    };
    return (
    <div className="lg:hidden fixed inset-0 overflow-y-auto w-full dark:bg-gray-800 z-50 shadow-md text-sm text-left pl-2 mt-12"
              style={{marginTop: "clamp(6rem, 4vh, 3rem)"}}>
        <SearchBar isMobile = {true} />
        <div className="rounded-sm bg-white text-black  dark:bg-gray-600">
            <ul className="flex flex-col text-left border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-black dark:text-white rounded-lg">
                {navbarItems.map((item, index) => (
                <li key={index}>
                    <Link
                      to={item.path}
                      className="block py-3 pl-3 bg-white dark:bg-gray-600 text-black dark:text-white hover:text-white hover:bg-yellow-400 hover:border-yellow-500 hover:rounded-lg transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                </li>
                ))}
            </ul>
            {!userInfo ? (
                    <>
                        <div className="flex flex-col bg-white text-black text-left dark:bg-gray-600">
                            <Link to="/auth/login"
                                    className="block py-3 text-black pl-3 dark:text-white dark:bg-gray-600 hover:text-white hover:bg-yellow-400 hover:border-yellow-500 hover:rounded-lg transition duration-300"
                                    onClick={() => setIsOpen(false)}
                            >Đăng nhập</Link>
                            <Link to="/auth/register"
                                    className="block py-3 text-black pl-3 dark:text-white dark:bg-gray-600 hover:text-white hover:bg-yellow-400 hover:border-yellow-500 hover:rounded-lg transition duration-300"
                                    onClick={() => setIsOpen(false)}
                            >Đăng ký</Link>
                        </div>
                    </>
                ):(
                    <>
                        <div>
                            <div className="flex flex-col bg-white text-black text-left dark:bg-gray-600">
                                <Link to="/profile/me" className="block py-3 text-black pl-3 dark:text-white dark:bg-gray-600 hover:text-white hover:bg-yellow-400 hover:border-yellow-500 hover:rounded-lg transition duration-300">
                                Hồ sơ
                                </Link>
                                <button onClick={handleLogout} className="block py-3 text-black pl-3 dark:text-white dark:bg-gray-600 hover:text-white hover:bg-yellow-400 hover:border-yellow-500 hover:rounded-lg transition duration-300">
                                <Link to = "/" className="text-black hover:text-black">Đăng xuất</Link>
                                </button>
                            </div>
                        </div>
                    </>
                )}
        </div>
    </div>
  );
};

export default MobileMenu;
