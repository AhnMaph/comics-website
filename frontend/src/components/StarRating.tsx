import React, { useState, useEffect } from "react";
import { updateVoting } from "../actions/userAction";
import axiosAuth from '../actions/apiClient';
import { typeContent } from "../types/user/User";

interface Props {
  storyId: string;
  initialRating: number;
  totalVotes: number;
  type?: typeContent['type'];
}

const StarRating = ({
  storyId,
  initialRating,
  totalVotes,
  type = "novel",
}: Props) => {
  const [averageRating, setAverageRating] = useState(initialRating || 0);
  const [votes, setVotes] = useState(totalVotes || 0);
  const [userRating, setUserRating] = useState(0);

  // ⭐ Lấy điểm đã vote (nếu có)
  useEffect(() => {
  axiosAuth
    .get(`/api/vote/${storyId}`, {
      params: { type: "novel" },
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.userVote) {
        setUserRating(res.data.userVote);
      }
      setAverageRating(res.data.averageRating);
      setVotes(res.data.numRatings);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy vote của user", err);
    });
}, [storyId]);

  // ⭐ Khi người dùng vote mới
  const ratingChanged = async (newRating: number) => {
    try {
        const res = await updateVoting({ post_id: storyId, rating: newRating, type });
        setUserRating(newRating);
        setAverageRating(res.avgRating);
        setVotes(res.ratingCount);
    } catch (err) {
        console.error("Lỗi khi gửi vote", err);
    }
    };


  return (
    <div className="mb-2">
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                onClick={() => ratingChanged(star)}
                className="focus:outline-none focus:ring-0 bg-transparent hover:bg-transparent p-0"
            >
                <i
                className={`fa-star text-1xl ${
                    userRating >= star ? "fas text-yellow-400" : "far text-gray-400"
                }`}
                ></i>
            </button>
            ))}
            <p className="text-sm text-gray-600 mt-1">
                {(typeof averageRating === "number" ? averageRating.toFixed(1) : "0.0")} / 5 từ {votes} lượt đánh giá
            </p>

        </div>
        
    </div>
  );
};

export default StarRating;
