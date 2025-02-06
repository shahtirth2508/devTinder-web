import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed) return null;

  if (feed.length <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
          <div className="text-6xl animate-bounce">🔍</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            No More Profiles
          </h1>
          <p className="text-gray-600 leading-relaxed">
            We're currently looking for more people that match your preferences.
            Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
          Discover People
        </h1>

        <div className="relative w-full flex justify-center">
          <div className="w-96">
            {currentIndex < feed.length && (
              <UserCard
                key={feed[currentIndex]._id}
                user={feed[currentIndex]}
              />
            )}
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          {feed.length - currentIndex} profiles remaining
        </div>
      </div>
    </div>
  );
};

export default Feed;
