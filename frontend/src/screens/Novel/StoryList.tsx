import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StoryList = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/stories/")  // Gọi API Django
      .then(response => setStories(response.data))
      .catch(error => console.error("Error fetching stories:", error));
  }, []);

  return (
    <div>
      <h1>Danh sách truyện</h1>
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            <Link to={`/story/${story.title}`}>{story.title}</Link> - {story.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StoryList;
