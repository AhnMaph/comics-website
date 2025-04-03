// import { useEffect, useState } from "react";
// import {Manga} from "../../types/manga/mangaDetail";  // Import API function
// import {fetchManga} from "../../actions/mangaActions";

// const Forum = () => {
//     const [mangas, setMangas] = useState<Manga[]>([]);

//     useEffect(() => {
//         const loadMangas = async () => {
//             const data = await fetchManga();
//             setMangas(data);
//         };

//         loadMangas();
//     }, []);

// //     return (
// //         <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }} id="forum">
// //             <h1 style={{ textAlign: "center", color: "#333" }}>Hello. I'm Forum.</h1>
// //             <ul style={{ listStyleType: "none", padding: 0 }}>
// //                 {mangas.map(manga => (
// //                     <li key={manga.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
// //                         <h2 style={{ color: "#555" }}>{manga.title}</h2>
// //                         <p style={{ margin: "5px 0" }}><strong>Author:</strong> {manga.author}</p>
// //                         <p style={{ margin: "5px 0" }}>{manga.description}</p>
// //                         <img src={manga.cover_image} alt={manga.title} style={{ width: "200px", borderRadius: "10px" }} />
// //                     </li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };

// // export default Forum;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Forum = () => {
//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState({ title: "", content: "" });

//   useEffect(() => {
//     axios.get("/api/forum/posts/")
//       .then(response => setPosts(response.data))
//       .catch(error => console.error(error));
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     axios.post("/api/forum/posts/", newPost, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
//       .then(response => setPosts([response.data, ...posts]))
//       .catch(error => console.error(error));
//   };

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold text-center mb-4">Diễn đàn thảo luận</h1>
      
//       <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 mb-6">
//         <input 
//           className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-blue-300" 
//           type="text" 
//           placeholder="Tiêu đề" 
//           value={newPost.title} 
//           onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
//         />
//         <textarea 
//           className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-blue-300" 
//           placeholder="Nội dung" 
//           value={newPost.content} 
//           onChange={(e) => setNewPost({...newPost, content: e.target.value})}
//         ></textarea>
//         <button 
//           className="bg-blue-500 text-white p-2 w-full rounded-lg hover:bg-blue-600 transition duration-300" 
//           type="submit"
//         >
//           Đăng bài
//         </button>
//       </form>
      
//       <div className="space-y-4">
//         {posts.map(post => (
//           <div key={post.id} className="bg-white shadow-md p-4 rounded-lg">
//             <h2 className="text-lg font-semibold">{post.title}</h2>
//             <p className="text-gray-700 mt-1">{post.content}</p>
//             <p className="text-sm text-gray-500 mt-2">Tác giả: {post.author_name} - {new Date(post.created_at).toLocaleString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Forum;
