import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bglogin from "@/assets/Logo_real.png";
import { loginUser } from "../../actions/userAction";

export default function LoginScreen() {
  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [pwd, username]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, pwd);
      if (response?.status !== 200) throw Error("Login Failed");
      setSuccess(true);
      setUsername('');
      setPwd('');
    } catch (err) {
      setErrMsg('Login Failed');
      errRef.current?.focus();
      setSuccess(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center bg-orange-800 text-white font-Nurito min-h-screen px-4">
        <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-[600px] text-center animate-fade-in transition-all duration-400">
          <img src={bglogin} alt="Logo" className="w-40 h-28 mx-auto mb-6 object-contain" />
          <h2 className="text-4xl font-extrabold mb-3 text-orange-700">Đăng nhập thành công!</h2>
          <p className="text-base md:text-lg mb-6 text-gray-600">Chào mừng bạn đã trở lại.</p>
          <Link
            to="/"
            className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-orange-200 text-white font-Nurito flex items-center justify-center min-h-screen px-4">
      <div className="bg-white flex flex-col md:flex-row items-center justify-center rounded-2xl shadow-2xl w-full max-w-4xl">
        {/* Left: Image */}
        <div className="hidden md:flex md:w-2/5 items-center justify-center">
          <Link to="/">
            <img src={bglogin} alt="loginbackground" className="max-w-full h-auto" />
          </Link>
        </div>
        {/* Right: Login Form */}
        <div className="bg-orange-800 w-full md:w-3/5 p-8 rounded-lg shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-center">Đăng nhập</h1>
            <p
              ref={errRef}
              className={errMsg ? "errmsg text-red-500 text-center" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <div>
              <label className="block font-medium mb-1">Username</label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="on"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="p-2 border rounded w-full text-white"
                placeholder="Nhập username"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                className="p-2 border rounded w-full text-black"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 text-white p-2 rounded hover:bg-yellow-400 transition"
            >
              Đăng nhập
            </button>
            <div className="flex justify-center items-center mt-4 space-x-2">
              <span>New user?</span>
              <Link to="/auth/register" className="text-red-600 hover:text-yellow-400">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}