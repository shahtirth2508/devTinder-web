import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";
import { BASE_URL } from "../utils/constansts";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-semibold text-gray-600">
          No Connections Found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Connections</h1>
      <div className="space-y-4">
        {connections.map((connection) => {
          const { firstName, lastName, photoUrl, age, gender, about } =
            connection;
          return (
            <div className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex-shrink-0">
                <img
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                  src={
                    photoUrl ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  alt={`${firstName}'s photo`}
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-2">
                  {firstName} {lastName}
                  {age && (
                    <span className="text-gray-500 text-base ml-2">
                      {age} years
                    </span>
                  )}
                  {gender && (
                    <span className="text-gray-500 text-base ml-2">
                      • {gender}
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 leading-relaxed">{about}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
