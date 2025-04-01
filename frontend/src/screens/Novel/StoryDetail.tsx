import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const StoryDetail = () => {
  const { title } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/story/${title}/`)
      .then(response => setStory(response.data))
      .catch(error => console.error("Error fetching story:", error));
  }, [title]);

  if (!story) return <p>Đang tải...</p>;

  return (
    <div>
      <h1>{story.title}</h1>
      <p><strong>Tác giả:</strong> {story.author}</p>
      <p><strong>Thể loại:</strong> {story.genres.join(", ")}</p>
      <p><strong>Mô tả:</strong> {story.description}</p>
    </div>
  );
};

export default StoryDetail;
