import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(
    user.photoUrl ||
      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  );
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setError("");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      setError(error.response.data);
      console.error(error);
    }
  };

  const inputClassName =
    "mt-1 px-4 py-2 w-full rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all";
  const labelClassName = "text-sm text-gray-600 font-medium";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/50 to-blue-50/50 py-8 px-4">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl font-bold text-purple-600 text-center mb-8">
          Edit Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">
                      <span className={labelClassName}>First Name</span>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type="text"
                        placeholder="Enter first name"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block mb-1">
                      <span className={labelClassName}>Last Name</span>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        placeholder="Enter last name"
                        className={inputClassName}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">
                    <span className={labelClassName}>Photo URL</span>
                    <input
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      type="text"
                      placeholder="Paste photo URL"
                      className={inputClassName}
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-1">
                      <span className={labelClassName}>Age</span>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        type="number"
                        placeholder="Enter age"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block mb-1">
                      <span className={labelClassName}>Gender</span>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-1 px-4 py-2 w-full rounded border"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">
                    <span className={labelClassName}>About</span>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Write something about yourself"
                      className={`${inputClassName} h-32 resize-none`}
                    />
                  </label>
                </div>

                <button
                  onClick={saveProfile}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Profile Preview
              </h2>
              <p className="text-sm text-gray-500">
                This is how your profile will appear to others
              </p>
            </div>

            <div className="sticky top-8">
              <UserCard
                user={{ firstName, lastName, photoUrl, age, gender, about }}
              />
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Profile updated successfully
          </span>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
