import { useState, useEffect } from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// redux 
//import {store} from './store'
import { Provider } from "react-redux";


// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     {/* warp the app with the provider, now store is global state */}
//     <Provider store={store}> 
//     <RouterProvider router={router} />
//     </Provider>
//   </StrictMode>
// );


const slides = [
    "https://images2.thanhnien.vn/528068263637045248/2025/1/21/game-173748237921538004969.png",
    "https://images.fbox.fpt.vn/wordpress-blog/2023/10/phim-hoat-hinh-doraemon.jpg",
    "https://img.jakpost.net/c/2017/04/26/2017_04_26_25887_1493204278._large.jpg",
    "https://vcdn1-giaitri.vnecdn.net/2023/09/23/myneighbortotorostill1e1571270-5423-8155-1695440507.png?w=1200&h=0&q=100&dpr=1&fit=crop&s=T79mzKGhGsftTkNfGcE2RA",
    "https://kilala.vn/data/uploads/2023/141120231050-1699933810-kingom-vuot-moc-tram-trieu-ban.jpg",
    "https://www.iamag.co/wp-content/uploads/2017/07/cover-yourname.jpg"
];

// const names = [
//     "Naruto",
//     "Doraemon",
//     "Crayon Shin",
//     "Dragon Ball",
//     "Kingom",
//     "Sword Art"
// ];

// const description = [
//     "Hành trình của Naruto Uzumaki, một cậu bé xa lánh nhưng luôn mơ ước trở thành Hokage để bảo vệ làng Lá.",
//     "Mèo máy Doraemon từ tương lai giúp Nobita vượt qua những rắc rối bằng các bảo bối thần kỳ.",
//     "Câu chuyện hài hước về cậu bé Shin-chan nghịch ngợm với những trò quậy phá bá đạo.",  
//     "Hành trình của Goku từ nhỏ đến khi trở thành chiến binh mạnh nhất vũ trụ, bảo vệ Trái Đất khỏi kẻ xấu",
//     "Câu chuyện về Tín, một cậu bé mồ côi, quyết tâm trở thành vị tướng vĩ đại trong thời kỳ Chiến Quốc Trung Hoa",
//     "Một nhóm game thủ bị mắc kẹt trong thế giới thực tế ảo, nơi cái chết trong game đồng nghĩa với cái chết ngoài đời thực"
// ];

const mangaData = [
    {
      title: "The Namgung Clan’s Great Sage",
      chapter: "C.11",
      time: "14 phút trước",
      image: "https://cdn.novelupdates.com/images/2024/09/Namgung-Clans-Great-Sage-Heavens-Equal.jpeg",
    },
    {
      title: "The Villain Wants to Live",
      chapter: "C.26",
      time: "9 ngày trước",
      image: "https://media.reaperscans.com/file/4SRBHm/rpjkjsuajx9v0z276o8em9i8.png",
    },
    {
      title: "Falling in Love With My Ex-Fiance's Grandfather",
      chapter: "C.36",
      time: "14 giờ trước?",
      image: "https://uploads.namicomi.com/covers/73hLs8EN/2efdb6a0-1da7-467b-91bf-e9629b53a03c.jpg.512.jpg",
    },
    {
      title: "A Messy Fairy Tale",
      chapter: "C.13",
      time: "6 ngày trước",
      image: "https://uploads.namicomi.com/covers/jcUg9skF/03060399-3242-48bd-b549-48a0c7e7289f.jpg.512.jpg",
    },
    {
      title: "After School, We Wander in Space",
      chapter: "C.3",
      time: "6 ngày trước",
      image: "https://preview.redd.it/art-new-serialization-after-school-we-wander-in-space-debut-v0-g8zad1exdple1.jpeg?auto=webp&s=e5ab9c93865244bd62a70608f8062451d152d6c2",
    },
    {
        title: "The Return of the Corpse King",
        chapter: "C.2",
        time: "12 ngày trước",
        image: "https://cdn.novelupdates.com/images/2025/03/The-Return-of-the-Corpse-King-I-the-Former-Hero-Summoned-Once-Again-to-Another-World-to-Stop-the-Chuunibyou-Secret-Society-I-Formed.jpg",
    },
    {
        title: "Kage no Jitsuryokusha ni Naritakute!",
        chapter: "C.71",
        time: "18 ngày trước",
        image: "https://img.animeschedule.net/production/assets/public/img/anime/jpg/default/kage-no-jitsuryokusha-ni-naritakute-78981dc7d8.jpg",
      },
      {
        title: "Dragon Ball: Goku Shiden",
        chapter: "Oneshot",
        time: "Ngày hôm qua",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx4D4VRnz6vZF3tAZdZrrtQGFNEbjV_-aU0A&s",
      },
      {
        title: "Kuroko no Basket - Maison Ushi no Koku (Doujinshi)",
        chapter: "Oneshot",
        time: "2 ngày trước",
        image: "https://kurokuro11.wordpress.com/wp-content/uploads/2017/12/1.jpg",
      },
      {
        title: "Eikoku Roman Giga: Forest Ivy",
        chapter: "C.0",
        time: "Chưa xác định",
        image: "https://www.animenewsnetwork.com/images/encyc/A35237-2015333198.1742399101.jpg",
      },
      {
        title: "Akuyaku Reijou Level 99: Watashi wa UraBoss desu ga Maou de wa Arimasen",
        chapter: "C.21",
        time: "4 tháng trước",
        image: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706238963i/60097326.jpg",
      },
      {
          title: "One Piece",
          chapter: "C.1142",
          time: "11 ngày trước",
          image: "https://dep.com.vn/wp-content/uploads/2019/12/poster-chinh-thuc-phim-one-piece-stampede.jpg",
      },
  ];

  const newMangaData = [
    {
      title: "Spy x Family (FULL HD)",
      chapter: "C.113",
      time: "15 ngày trước",
      image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/152/cover/processed-f7d09a1d2f13b6eb0677d9b811bf10df.jpg",
    },
    {
      title: "Cupid 13",
      chapter: "OneShot",
      time: "1 ngày trước",
      image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2877/cover/processed-e86000dd2e48db139cedaa3628456f7b.jpg",
    },
    {
      title: "Madame Petit",
      chapter: "C.45",
      time: "4 ngày trước?",
      image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2053/cover/processed-cd31eff57b150fb851e6420925b24833.jpg",
    },
    {
      title: "Fairy Tail: Nhiệm Vụ 100 năm",
      chapter: "C.63",
      time: "4 ngày trước",
      image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2841/cover/processed-c4175be221df21401a1b90c28d659df8.jpg",
    },
    {
      title: "Medalist",
      chapter: "C.14",
      time: "4 ngày trước",
      image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2295/cover/processed-12e251ca02907022d66def34edec94e2.jpg",
    },
    {
        title: "Dị giới thất cách",
        chapter: "C.29",
        time: "3 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2436/cover/processed-38e9ad2cd1c25bb79cd111e9039c1ac1.jpg",
    },
    {
        title: "One-Punch Man",
        chapter: "C.244",
        time: "4 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/1288/cover/processed-5921c6a53454ea2288cc076706b9d3e8.jpg",
      },
      {
        title: "Magic Kaito",
        chapter: "C.38",
        time: "20 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2821/cover/processed-7ae4b006d0a5b4448c766e87f1c1d91d.jpg",
      },
      {
        title: "Cigarette and Cherry",
        chapter: "C.109",
        time: "4 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/379/cover/processed-2363e9db66c9002eb0ec61a0352357f4.jpg",
      },
      {
        title: "Radiation House",
        chapter: "C.113",
        time: "5 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/950/cover/processed-5f90d9c921bf3a110237a3edafb62b94.jpg",
      },
      {
        title: "Sakamoto Days (FULL HD)",
        chapter: "C.203",
        time: "11 ngày trước",
        image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/106/cover/processed-75c4561a654bc5f172679365346a2cd0.jpg",
      },
      {
          title: "Diamond no Ace: Act II",
          chapter: "C.221",
          time: "14 ngày trước",
          image: "https://storage-ct.lrclib.net/file/cuutruyen/uploads/manga/2835/cover/processed-81c728e5a78773f28dea1a9c96184788.jpg",
      },
  ];




const MangaPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 3000); // Chuyển slide mỗi 3 giây

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div className="w-full max-w-screen-lg overflow-hidden relative flex justify-center mx-auto">
                {/* Wrapper chứa tất cả slides */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((src, index) => (
                        <div 
                            key={index} 
                            className="relative min-w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] flex items-center justify-center rounded-2xl"
                        >
                            <img src={src} className="w-full h-full rounded-2xl" alt={`slide-${index}`} />
                        </div>
                    ))}
                </div>

                {/* Nút điều hướng */}
                <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                    onClick={() => setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)}
                >
                    ❮
                </button>
                <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
                    onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
                >
                    ❯
                </button>
            </div>

            <div className="h-[50px]"></div>
            <div className="mx-auto justify-center w-full max-w-screen-lg">
                <h2 className="font-bold text-lg ">🌟 NỔI BẬT 🌟</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                    {
                        mangaData.map((manga, index) => (
                            <div key={index} className="p-4 text-black">
                                <img src={manga.image} alt={manga.title} className="w-full object-cover" />
                                <div className="p-2" id="Comic">
                                    <h3 className="text-sm font-bold">{manga.title}</h3>
                                    <p className="text-xs text-gray-400 dark:text-white  ">{manga.chapter}</p>
                                    <p className="text-xs text-gray-400 dark:text-white">{manga.time}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <a href="#" className="flex justify-end mt-2 mr-7 text-black hover:text-orange-500">Xem tất cả</a>
                <div className="h-[20px]"></div>
            </div>
            <div className="mx-auto justify-center w-full max-w-screen-lg">
                <h2 className="font-bold text-lg ">🔥 MỚI CẬP NHẬT 🔥</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-sm">
                    {
                        newMangaData.map((manga, index) => (
                            <div key={index} className="p-4 text-black">
                                <img src={manga.image} alt={manga.title} className="w-full object-cover" />
                                <div className="p-2" id="Comic">
                                    <h3 className="text-sm font-bold">{manga.title}</h3>
                                    <p className="text-xs text-gray-400 dark:text-white">{manga.chapter}</p>
                                    <p className="text-xs text-gray-400 dark:text-white">{manga.time}</p>
                                </div>
                            </div>
                        ))}
                </div>
                <a href="#" className="flex justify-end mt-2 mr-7 text-black hover:text-orange-500">Xem tất cả</a>
                <div className="h-[20px]"></div>
            </div>
            {/* <footer className="bg-black text-white text-center p-3" id="contact">
                <p>&copy; 2025 Music Event. All rights reserved.</p>
                <div>
                    <a className="text-white me-3">Chính sách bảo mật</a>
                    <a className="text-white me-3">Điều khoản dịch vụ</a>
                    <a className="text-white me-3">Liên hệ hỗ trợ</a>           
                </div>
            </footer> */}
        </div>
    );
};

export default MangaPage;
