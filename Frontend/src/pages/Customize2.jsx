import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage instanceof File || backendImage instanceof Blob) {
        formData.append("assistantImage", backendImage);
      } else if (selectedImage) {
        formData.append("imageUrl", selectedImage);
      }

      console.log("Sending request with:", {
        assistantName,
        backendImage,
        selectedImage,
      });
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      console.log("API Response:", result.data);
      setUserData(result.data);

      // Only navigate after successful API call
      navigate("/");
    } catch (error) {
      console.log("API Error:", error);
      alert("Failed to update assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px] gap-[20px] relative">
      <IoMdArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
        onClick={() => navigate("/customize")}
      />
      <h1 className="text-white text-[30px] text-center mb-10">
        Enter your <span className="text-[#8888d0b0]">Assistant Name</span>{" "}
      </h1>

      <input
        type="text"
        className="w-[50%] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 py-2 rounded-full"
        placeholder="Ex: sora"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {!loading ? "Create" : "Loading..."}
        </button>
      )}
    </div>
  );
};

export default Customize2;
