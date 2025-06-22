import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./screens/Home/HomePage";
import Error from "./screens/Error";
import UserProfilePage from "./screens/Auth/ProfileScreen";
import UploadScreen from "./screens/Auth/UploadScreen";
import MangaList from "./screens/Manga/MangaList.tsx";
import NovelList from "./screens/Novel/NovelList.tsx";
// import Forum from "./screens/Forum/Forum";
import Genre from "./screens/Genre/Genre.tsx";
import Leaderboard from "./screens/Leaderboard/Leaderboard";
import AdvanceSearch from "./screens/Search/AdvanceSearch.tsx";
import AuthRoutes from "./router/AuthRoutes";
import NovelData from './screens/Novel/NovelDetail.tsx'
import MangaData from './screens/Manga/MangaDetail.tsx'
import NovelChapterDetailPage from './screens/Novel/NovelChapterDetail'
import NovelChapterDetail from './screens/Novel/NovelChapterDetail'
import MangaChapterDetailPage from './screens/Manga/MangaChapterDetail.tsx'
import MangaChapterDetail from './screens/Manga/MangaChapterDetail.tsx'

// redux 

import {store} from './store'
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,  // Đặt App làm layout chính
    errorElement: <Error />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/profile/me", element: <UserProfilePage /> },
      { path: "/profiles/:username", element: <UserProfilePage /> },
      { path: "/profile/me/upload", element: <UploadScreen/> },
      { path: "/manga", element: <MangaList /> },
      { path: "/novel", element: <NovelList /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      // { path: "/forum", element: <Forum /> },
      { path: "/genre", element: <Genre /> },
      { path: "/avsearch", element: <AdvanceSearch /> },
      { path: "/auth/*", element: <AuthRoutes /> },
      { path: "/novel/:postName/:postId", element: <NovelData />},
      { path: "/manga/:postName/:postId", element: <MangaData />},
      { path: "/novel/:postName/chapter/:chapterName/:chapterId", element: <NovelChapterDetail/>},
      { path: "/chapter/:chapterId", element: <NovelChapterDetailPage />},
      { path: "/manga/:postName/chapter/:chapterName/:chapterId", element: <MangaChapterDetail/>},
      { path: "/chapter/:chapterId", element: <MangaChapterDetailPage />},
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* warp the app with the provider, now store is global state */}
    <Provider store={store}> 
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

