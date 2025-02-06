import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

  const [swipeDirection, setSwipeDirection] = useState(null);
  const [dragDistance, setDragDistance] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const isProfileView = location.pathname.includes("profile");

  const handleSendRequest = async (status, userId) => {
    if (swipeDirection) return;

    try {
      setSwipeDirection(status === "interested" ? "right" : "left");
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      setTimeout(() => {
        dispatch(removeUserFromFeed(userId));
      }, 300);
    } catch (error) {
      console.error(error);
      setSwipeDirection(null);
      setDragDistance(0);
    }
  };

  const handleDragStart = (e) => {
    if (swipeDirection || isProfileView) return;

    setIsDragging(true);
    startXRef.current = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    currentXRef.current = startXRef.current;

    if (e.type.includes("mouse")) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging || isProfileView) return;

    const currentX = e.type.includes("mouse")
      ? e.clientX
      : e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    currentXRef.current = currentX;

    const rotation = (diff / window.innerWidth) * 25;
    setDragDistance(diff);

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${diff}px) rotate(${rotation}deg)`;
    }
  };

  const handleDragEnd = () => {
    if (isProfileView) return;

    setIsDragging(false);
    const threshold = window.innerWidth * 0.3;

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);

    if (Math.abs(dragDistance) > threshold) {
      const direction = dragDistance > 0 ? "interested" : "ignored";
      handleSendRequest(direction, _id);
    } else {
      if (cardRef.current) {
        cardRef.current.style.transform = "none";
        setDragDistance(0);
      }
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card || isProfileView) return;

    card.addEventListener("touchstart", handleDragStart);
    card.addEventListener("touchmove", handleDragMove);
    card.addEventListener("touchend", handleDragEnd);

    return () => {
      card.removeEventListener("touchstart", handleDragStart);
      card.removeEventListener("touchmove", handleDragMove);
      card.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging, isProfileView]);

  const getCardStyle = () => {
    if (swipeDirection) {
      return {
        transform: `translateX(${
          swipeDirection === "left" ? "-150%" : "150%"
        }) rotate(${swipeDirection === "left" ? "-30deg" : "30deg"})`,
        transition: "transform 0.3s ease-out",
      };
    }
    return {
      transform: isDragging ? cardRef.current?.style.transform : "none",
      transition: isDragging
        ? "none"
        : "transform 0.3s ease-out, box-shadow 0.3s ease-out",
    };
  };

  const swipeOverlayStyle = {
    opacity: Math.min(Math.abs(dragDistance) / (window.innerWidth * 0.3), 1),
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={!isProfileView ? handleDragStart : undefined}
      className={`w-96 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 ${
        !isProfileView ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      style={getCardStyle()}
    >
      <div className="relative h-80 overflow-hidden">
        {!isProfileView && (
          <>
            <div
              className="absolute inset-0 bg-red-500/50 flex items-center justify-center z-20 transition-opacity"
              style={{
                ...swipeOverlayStyle,
                opacity: dragDistance < 0 ? swipeOverlayStyle.opacity : 0,
              }}
            >
              <span className="text-white text-6xl">×</span>
            </div>

            <div
              className="absolute inset-0 bg-pink-500/50 flex items-center justify-center z-20 transition-opacity"
              style={{
                ...swipeOverlayStyle,
                opacity: dragDistance > 0 ? swipeOverlayStyle.opacity : 0,
              }}
            >
              <span className="text-white text-6xl">♥</span>
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <img
          src={
            photoUrl ||
            "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          }
          alt={`${firstName}'s photo`}
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <h2 className="text-2xl font-bold text-white mb-1">
            {firstName} {lastName}
          </h2>
          {age || gender ? (
            <p className="text-gray-200 text-sm">
              {[age && `${age} years`, gender].filter(Boolean).join(", ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        {about && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{about}</p>
          </div>
        )}

        {!isProfileView && (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSendRequest("ignored", _id)}
                className="btn bg-red-500 hover:bg-red-600 text-white border-none flex-1 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={swipeDirection !== null}
              >
                <span className="text-lg">×</span>
                Pass
              </button>
              <button
                onClick={() => handleSendRequest("interested", _id)}
                className="btn bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-none flex-1 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                disabled={swipeDirection !== null}
              >
                <span className="text-lg">♥</span>
                Like
              </button>
            </div>
            <div className="text-center text-gray-500 text-sm">
              Swipe right to like, left to pass
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
