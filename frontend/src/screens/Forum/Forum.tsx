import { useEffect, useState } from "react";
import {Manga} from "../../types/manga/mangaDetail";  // Import API function
import {fetchManga} from "../../actions/mangaActions";

const Forum = () => {
    const [mangas, setMangas] = useState<Manga[]>([]);

    useEffect(() => {
        const loadMangas = async () => {
            const data = await fetchManga();
            setMangas(data);
        };

        loadMangas();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }} id="forum">
            <h1 style={{ textAlign: "center", color: "#333" }}>Hello. I'm Forum.</h1>
            <ul style={{ listStyleType: "none", padding: 0 }}>
                {mangas.map(manga => (
                    <li key={manga.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                        <h2 style={{ color: "#555" }}>{manga.title}</h2>
                        <p style={{ margin: "5px 0" }}><strong>Author:</strong> {manga.author}</p>
                        <p style={{ margin: "5px 0" }}>{manga.description}</p>
                        <img src={manga.cover_image} alt={manga.title} style={{ width: "200px", borderRadius: "10px" }} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Forum;
