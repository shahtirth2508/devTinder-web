import React from "react";
import { useLocation } from "react-router-dom";

const UserCard = ({ user }) => {
  const location = useLocation();
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;

  return (
    <div className="w-96 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Image Container with Gradient Overlay */}
      <div className="relative h-80 overflow-hidden">
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

      {/* Card Content */}
      <div className="p-6">
        {about && (
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{about}</p>
          </div>
        )}

        {!location.pathname.includes("profile") && (
          <div className="flex justify-center gap-4">
            <button className="btn bg-red-500 hover:bg-red-600 text-white border-none flex-1 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <span className="text-lg">×</span>
              Ignore
            </button>
            <button className="btn bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-none flex-1 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              <span className="text-lg">♥</span>
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
