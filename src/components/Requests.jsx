import React, { useEffect, useState } from "react";
import { addRequest } from "../utils/requestSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";

const Requests = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 2000);
  };

  const reviewRequest = async (status, _id) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );

      showToast(
        `Request ${status} successfully`,
        status === "accepted" ? "success" : "error"
      );

      fetchRequests();
    } catch (error) {
      showToast("Failed to process request", "error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/recieved`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (error) {
      showToast("Failed to fetch requests", "error");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  return (
    <div className="relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            } shadow-lg`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {requests.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-semibold text-gray-600">
            No Requests Found
          </h1>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Received Requests
          </h1>
          <div className="space-y-4">
            {requests.map((request) => {
              const { _id, firstName, lastName, photoUrl, age, gender, about } =
                request.fromUserId;
              return (
                <div
                  key={_id}
                  className="flex items-start gap-6 p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
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
                  <div className="flex flex-col gap-3 min-w-[120px]">
                    <button
                      onClick={() => reviewRequest("accepted", request._id)}
                      disabled={isLoading}
                      className="btn btn-primary bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-none rounded-full btn-sm normal-case font-medium gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="text-lg">♥</span>
                      Accept
                    </button>
                    <button
                      onClick={() => reviewRequest("rejected", request._id)}
                      disabled={isLoading}
                      className="btn btn-outline btn-error hover:bg-error/90 rounded-full btn-sm normal-case font-medium gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <span className="text-lg">×</span>
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
