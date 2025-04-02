//import Navbar from "../../screens/Navbar/Navbar.tsx"; // Import đúng file Navbar
/* 
    <div className="min-h-screen bg-white " id="Homepage" >
      <div className="container mx-auto text-center py-10">
        <h2 className="text-3xl font-bold text-gray-800">Welcome to My Manga</h2>
        <p className="text-gray-600 mt-4">Explore thousands of manga now!</p>s
      </div>
    </div> 

 */


import { useEffect, useState } from "react";
import { FaCircle } from 'react-icons/fa';
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import homeMobile from "../../assets/home_mobile.jpg";
import kid from "../../assets/kid.jpg";
import book from "../../assets/book.jpg";
import magazine from "../../assets/magazine.jpg";
import video from "../../assets/trailer_web.mp4";
{/*}
import japan from "../../assets/japan.png";
import hanquoc from "../../assets/HQ_charater.png";
import vietnam from "../../assets/VN_character.png";
import trungquoc from "../../assets/TQ_chrater.png";
*/}

const text = "Trải nghiệm đa dạng các thể loại về Comic";
const words = text.split(" ");

const main_title = "Welcome to my website";
const title = main_title.split(" ");

const community = "Tham gia cộng đồng \"nghiện\" Comic tại đây";
const set_community = community.split(" ");

const aboutme = "Về chúng mình";
const set_aboutme = aboutme.split(" ");

const HomePage = () => {
  /// Điều khiển animation cho phần "Trải nghiệm đa dạng..."
  const controls1 = useAnimation();
  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView1) controls1.start("visible");
  }, [inView1, controls1]);

  // Điều khiển animation cho phần "Tham gia cộng đồng..."
  const controls2 = useAnimation();
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView2) controls2.start("visible");
  }, [inView2, controls2]);

    //const [shake, setShake] = useState(false);


    // Điều khiển animation xuất hiện khi cuộn đến
  const controls3 = useAnimation();
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView3) controls3.start("visible");
  }, [inView3, controls3]);

  const [activeIndex] = useState<number | null>(null);

  // Danh sách nội dung
  const aboutData = [
    { title: "Tâm huyết", description: "Thức khuya hơn cú đêm." },
    { title: "Kinh nghiệm", description: "Tay trái code, tay phải viết prompt." },
    { title: "Sáng tạo", description: "Cũng có nhưng không đáng kể." },
    { title: "Đam mê", description: "Làm là phải cháy hết mình." },
  ];

  const timelineData = [
    { date: '3 / 2025', title: 'Bước khởi đầu', description: 'Khởi động dự án với những ý tưởng đột phá.', image: kid },
    { date: '4 / 2025', title: 'Ra mắt các tính năng', description: 'Các sản phẩm độc đáo và đa dạng từ Happy Monkey sẽ được cung cấp tại website.', image: magazine },
    { date: '5 / 2025', title: 'Ra mắt tính năng advanced search', description: 'Tăng trải nghiệm người dùng, dễ dàng kiếm truyện.', image: homeMobile },
  ];

  return (
      <div className="min-h-screen  text-white" style={{
        backgroundImage: `url("${book}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>

        {/* --- PHẦN HEADER --- */}
              <div className="min-h-screen flex flex-col md:flex-row items-start justify-between px-6 pt-10">
                {/* Phần trái: Giới thiệu */}
                <div className="w-full md:w-1/2 flex flex-col items-start text-left space-y-6">
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                    <span>🔧 Không thể bỏ qua</span>
                  </button>
        
                  <h1 className="text-4xl md:text-5xl font-bold text-white ">
                    {title.map((word, index) => (
                      <motion.span
                        key={index}
                        className="inline-block mr-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.3, duration: 0.9 }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </h1>
        <p className="text-lg text-gray-300">
                    Là món ăn tinh thần không thể bỏ lỡ cho các fan chân chính của comic-chan!!!!
                  </p>
        
                  <a href="#" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:opacity-80 transition">
                    Tham gia ngay →
                  </a>
                </div>
        
                {/* Phần phải: Mockups */}
                <div className="relative flex flex col items-center justify-center w-full max-w-[690px] md:mt-0 ml-auto">
                    {/* iPad Mockup */}
                    <div className="relative w-full max-w-[690px] aspect-[4/3] rounded-3xl border-6 border-gray-800 shadow-xl overflow-hidden mt-9 flex items-center flex justify-end">
                      <div className="top-0 left-0 right-0 h-6 rounded-t-2xl"></div>
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${kid}")` }}
                      ></div>
                    </div>
        
                    {/* Mobile Mockup */}
                    <div className="absolute w-[40%] max-w-[280px] aspect-[9/16] bg-gray-900 rounded-[40px] border-[5px] border-gray-800 shadow-xl overflow-hidden left-[-15%] top-[21%] scale-90 hover:scale-100 hover:shadow-2xl transition-transform flex items-center justify-center">
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${homeMobile}")` }}
                      ></div>
                    </div>
                  </div>
        
              </div>

{/* --- PHẦN TRẢI NGHIỆM (KÉO XUỐNG MỚI HIỆN) --- */}
<motion.div
      ref={ref1}
      initial="hidden"
      animate={controls1}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 bg-cover bg-center"
      style={{ backgroundImage: `url(${kid})` }}
      >
      {/* Lớp overlay để tạo hiệu ứng mờ */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Nội dung chính */}
      <div className="relative z-10">
        {/* Tiêu đề có hiệu ứng */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="inline-block mr-2"
              initial="hidden"
              animate={controls1}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

              {/* Mô tả */}
              {/* Mô tả - Hiệu ứng slide-in từ trái */}
            <motion.p
              className="text-lg text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={controls1}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            > Khám phá các thể loại phong phú, từ Kinh Dị, Trinh Thám đến những khoảnh khắc đời thường ấm áp.
            </motion.p>

            {/* Nút CTA - Hiệu ứng slide-up */}
            <motion.div
              className="mt-6 flex space-x-4 justify-center"
              initial="hidden"
              animate={controls1}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.8, delay: 0.8 }}>
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:opacity-80 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >Khám phá ngay
              </motion.button>

              <motion.button
                className="bg-gray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >Tìm hiểu thêm
              </motion.button>
            </motion.div>

            </div>
                <div className="relative w-[790px] h-[520px] flex items-center justify-center md:mt-0 pt-10">
                    <motion.div 
                        className="relative w-[690px] h-[450px] rounded-[40px] border-[10px] border-gray-800 shadow-xl bg-black flex flex-col"
                        //animate={shake ? { rotate: [0, -5, 5, -5, 5, 0] } : {} }
                        transition={{ duration: 0.5 }}
                    >
                        <div className="absolute top-0 left-0 right-0 h-[40px] bg-gray-900 flex items-center px-4 rounded-t-[30px]">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <video 
                            className="w-full h-full object-cover"
                            src={video}
                            autoPlay 
                            loop 
                            muted={true}
                            controls={false} 
                            playsInline
                        />
                        { /*
                        <div className="absolute top-[-70px] left-[-150px] w-54 h-54 cursor-pointer z-[9999]" onClick={() => setShake(true)}>
                            <img src={vietnam} alt="icon" />
                        </div>
                        <div className="absolute top-[-50px] right-[-150px] w-50 h-52 cursor-pointer z-[9999]" onClick={() => setShake(true)}>
                            <img src={japan} alt="icon" />
                        </div>
                        <div className="absolute bottom-[-120px] left-[-150px] w-56 h-56 cursor-pointer z-[9999]" onClick={() => setShake(true)}>
                            <img src={hanquoc} alt="icon" />
                        </div>
                        <div className="absolute bottom-[-50px] right-[-130px] w-42 h-42 cursor-pointer z-[9999]" onClick={() => setShake(true)}>
                            <img src={trungquoc} alt="icon" />
                        </div>
                        */}
                    </motion.div>
                </div>

        </motion.div>


              </div>



    );
};

export default HomePage;