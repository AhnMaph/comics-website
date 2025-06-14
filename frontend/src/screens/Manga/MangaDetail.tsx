// src/pages/StoryDetailPage.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from 'react';
import {Link, useParams } from 'react-router-dom';
import {Manga} from '../../types/manga/mangaDetails';
import { updateLike ,updateFavorite} from "../../actions/userAction";
import {MangaChapter} from '../../types/manga/mangaChapters';
import { fetchMangaDetails, fetchMangaChapters, fetchManga} from '../../actions/mangaActions'; 
import { faEye, faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useMemo } from "react";
import { CommentList } from "../../components/CommentGrid";

const StoryDetailPage = () => {
  const { postId } = useParams(); // từ URL /story/:postId
  const [story, setStory] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const firstChapter = chapters[0];
  const lastChapter = chapters[chapters.length - 1];
  const [allMangas, setAllMangas] = useState<Manga[]>([]);

  function getRandomMangas(n: number, mangas: Manga[], excludeId?: string) {
    const filtered = excludeId ? mangas.filter(nv => nv._id !== excludeId) : mangas;
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await fetchMangaDetails(String(postId));

        setStory(detail);
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
      }
    };

    fetchData();
  }, [postId]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const chapterList = await fetchMangaChapters(String(postId));
        setChapters(chapterList);
      } catch (error) {
        console.error("Lỗi khi load chương:", error);
      }
    };
  
    fetchChapter();
  }, [postId]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const mangas = await fetchManga(1); // lấy trang 1, hoặc sửa lại API để lấy nhiều hơn nếu cần
        setAllMangas(mangas);
      } catch (error) {
        console.error("Lỗi khi load danh sách truyện:", error);
      }
    };
    fetchAll();
  }, []);

  const handleFavoriteClick = async () => {
    try {
      if (!postId) {
        console.error("Lỗi khi cập nhật số fav: storyID null");
        return
      }
      const updated = await updateFavorite({post_id:postId, type: "manga"});
      if (story) {
        setStory({ ...story, numFavorites: updated.numFavorites });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượt thích:", error);
    }
  };

  const handleLikeClick = async () => {
      try {
        if (!postId) {
          console.error("Lỗi khi cập nhật số lượt thích:");
          return
        }
        const updated = await updateLike({post_id:postId, type: "manga"});
        console.log(updated.numLikes)
        if (story) {
          setStory({ ...story, numLikes: updated.numLikes });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượt thích:", error);
      }
    };
  
  const recommends = useMemo(
      () => getRandomMangas(10, allMangas, story?._id),
      [allMangas, story?._id]
    );

  return (
    <div className="max-w-screen-lg mx-auto px-0 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start min-h-screen">
        {/* Main content */}
        <div className="flex-1">

          {story ? (
            <>
              {/* Div 1: Ảnh + Thông tin */}
              <div className="flex flex-col md:flex-row gap-5 items-start">
                {/* Ảnh bìa bên trái */}
                <div className="w-1/2 md:w-[200px] flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src={story.cover_image}
                    alt="Ảnh bìa"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>

                {/* Thông tin bên phải */}
                <div style={{ flex: 1 }}>
                  <h1 style={{ marginBottom: '10px' }}>{story.title}</h1>
                  <div > </div>
                  <p>
                    <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />   {story.numViews} 
                    <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 pl-5.5" />   {story.numFavorites} 
                    <FontAwesomeIcon icon={faCommentDots} className="w-3.5 h-3.5  pl-5.5" /> {story.numComments}
                  </p>
                  <p><span className = "Emphasize font-bold">Tác giả: </span> {story.author}</p>

                  <p>
                    <span className="Emphasize font-bold">Thể loại: </span>
                    {Array.isArray(story.genres) &&
                      story.genres.map((genre, index) => (
                        <span key={genre._id}>
                          {genre.name}
                          {index < story.genres.length - 1 && ', '}
                        </span>
                      ))}
                  </p>
                  <p><span className = "Emphasize font-bold">Trạng thái:  </span> {story.status}</p>
                  <p><span className="Emphasize font-bold">Cập nhật: </span> {new Date(story.updated_at).toLocaleDateString('vi-VN')}</p>
                  <p><span className = "Emphasize font-bold"> Lượt favorites:  </span> {story.numFavorites}</p>
                  <div className="justify-between mt-2">
                    {firstChapter && (
                      <Link to={`/manga/chapter/${firstChapter._id}`}>
                        <button className="text-white bg-orange-500 hover:bg-yellow-400 px-2 mr-2 py-2 rounded">Đọc từ đầu</button>
                      </Link>
                    )}
                    {lastChapter && (
                      <Link to={`/manga/chapter/${lastChapter._id}`}>
                        <button className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded">Đọc mới nhất</button>
                      </Link>
                    )}
                    <button
                      className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded"
                      onClick={handleLikeClick}
                    >
                      Thích ({story.numLikes})
                    </button>
                    <button
                      className="text-white bg-orange-500 hover:bg-yellow-400 ml-2 px-2 py-2 rounded"
                      onClick={handleFavoriteClick}
                    >
                      Lưu ({story.numFavorites})
                    </button>
                  </div>
                </div>
              </div>

              {/* Div 2: Description */}
              <div className="flex flex-col" style={{ marginTop: '30px' }}>
                <div className="flex-1">
                  <h2><span className = "Emphasize font-bold">Mô tả</span></h2>
                  <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                    {story.description.split('\n').map((line, index) => (
                      <span key={index}>{line}<br /></span>
                    ))}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p>Đang tải truyện...</p>
          )}
        </div> 
              
            {/* Recommend box */}
              <aside className="w-full lg:w-70 flex-shrink-0 h-full">
                  <div className="bg-white rounded-xl shadow p-4 w-full h-full">
                    <h3 className="font-bold text-lg mb-4">Gợi ý cho bạn</h3>
                    <div className="space-y-4 ">
                      {recommends.map(manga => (
                        <Link
                          to={`/manga/${manga._id}`}
                          key={manga._id}
                          className="flex items-center gap-3 bg-white hover:bg-sky-100 rounded p-2 transition"
                        >
                          <img
                            src={manga.cover_image}
                            alt={manga.title}
                            className="w-20 h-28 md:w-24 md:h-32 object-cover rounded shadow"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-sm line-clamp-2">{manga.title}</div>
                            <div className="text-xs text-gray-500">{manga.author}</div>
                          </div>
                        </Link>
                      ))}
                    </div>  
                  </div>
              </aside>
            </div>
              {/* Danh sách chương */}
              <div className="flex-1 mt-10">
                <div className="bg-orange-300 text-center py-2">
                  <h2 className="text-xl font-semibold">DANH SÁCH CHƯƠNG</h2>
                </div>

                <div className="mt-4 divide-y divide-orange-200">
                  {
                    // Chia danh sách chương thành các hàng 3 cột, 2 cột và 1 cột tùy kích thước
                    Array.from({ length: Math.ceil(chapters.length / 3) }).map((_, rowIndex) => (
                      <div key={rowIndex} className="py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 text-center">
                          {chapters.slice(rowIndex * 3, rowIndex * 3 + 3).map((chapter, colIndex) => (
                            <div key={colIndex}>
                              <Link
                                to={`/manga/chapter/${chapter._id}`}
                                className="text-neutral-700 hover:text-orange-500 dark:text-white"
                              >
                                Chương {chapter.chapter_number}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div className="flex-1 mt-10">
                <CommentList/>
              </div>
    </div>
  );
};
export default StoryDetailPage;
