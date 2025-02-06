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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6 bg-white rounded-2xl p-12 shadow-xl max-w-md mx-auto">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            No Connections Yet
          </h1>
          <p className="text-gray-600">
            Start exploring to find your connections!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Your Connections
          </h1>
          <div className="bg-white px-6 py-2 rounded-full shadow-sm">
            <span className="font-medium text-gray-700">
              {connections.length}{" "}
              {connections.length === 1 ? "Connection" : "Connections"}
            </span>
          </div>
        </div>

        <div className="grid gap-6">
          {connections.map((connection, index) => {
            const { firstName, lastName, photoUrl, age, gender, about } =
              connection;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500"
                        src={
                          photoUrl ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                        alt={`${firstName}'s photo`}
                      />
                    </div>
                  </div>

                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {firstName} {lastName}
                      </h2>
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                        {age && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            {age} years
                          </span>
                        )}
                        {gender && (
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            {gender}
                          </span>
                        )}
                      </div>
                    </div>
                    {about && (
                      <p className="text-gray-600 leading-relaxed">{about}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;
