import React, { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [hasInteracted, setHasInteracted] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const speak = (text) => {
    if (!hasInteracted) {
      console.warn("Voice blocked until user interacts");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      utterance.voice = voices[0];
    }

    utterance.onerror = (e) => {
      console.error("Speech error:", e.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response); // Speak response

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    if (!userData?.assistantName || !hasInteracted) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard : " + transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        console.log("Assistant response:", data);
        handleCommand(data);
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
    };

    recognition.start();
    setRecognitionInstance(recognition);

    return () => {
      recognition.stop();
    };
  }, [userData, hasInteracted]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px]">
      <button
        type="submit"
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[20px] right-[20px]"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        type="submit"
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] absolute top-[100px] right-[20px] px-5"
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>

      {!hasInteracted && (
        <button
          className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold shadow-lg"
          onClick={() => setHasInteracted(true)}
        >
          🎤 Activate Voice
        </button>
      )}

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-lg mt-4">
        <img
          src={userData.assistantImage}
          alt="Assistant"
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
    </div>
  );
};

export default Home;
