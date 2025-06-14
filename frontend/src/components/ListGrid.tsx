// components/NovelGrid.tsx
import { Novel } from "../types/novel/novelDetails";
import { Manga } from "../types/manga/mangaDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const ListGrid = ({ posts, type }: { posts: Novel[]|Manga[], type: string }) => {
  if (!posts.length)
    return <p className="text-gray-500">Không có truyện nào để hiển thị.</p>;
  if (type !== "novel" && type !== "manga") {
    return <p className="text-red-500">Loại truyện không hợp lệ.</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {posts.map((post, index) => (
        <div
          key={post._id}
          className="bg-white shadow-md p-3 rounded-lg flex flex-col justify-between min-h-[360px]"
        >
          <Link to={`/${type}/${post._id}`} className="flex flex-col h-full">
            <div className="w-full overflow-hidden rounded"
              style={{ aspectRatio: "5 / 7" }}>
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover rounded"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
              />
            </div>
            <div className="flex-1 flex flex-col justify-between mt-2 bg-white">
              <div>
                <h3
                  className="font-bold text-base text-gray-900 line-clamp-2 text-center"
                  title={post.title}
                >
                  {post.title}
                </h3>
                <p className="text-sm text-gray-700 text-center font-semibold">
                  {post.author}
                </p>
                <p className="text-sm text-gray-600 italic text-center">
                  {post.genres[0]?.name || "Đang cập nhật"}
                </p>
                <p className="text-sm text-gray-600 text-center">{post.status}</p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faEye} className="w-3.5 h-3.5" />
                  {post.numViews || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faCommentDots} className="w-3.5 h-3.5" />
                  {post.numComments || 0}
                </span>
                <span className="flex items-center gap-1">
                  <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5 text-red-400" />
                  {post.numFavorites || 0}
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListGrid;
