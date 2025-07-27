import React, { useContext, useEffect, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import assistGif from "../assets/ai.gif";
import assistGif1 from "../assets/user.gif";
import { HiMenuAlt3 } from "react-icons/hi";
import { GoX } from "react-icons/go";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [hasInteracted, setHasInteracted] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ham, setHam] = useState(false);

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

    const isHindi = /[\u0900-\u097F]/.test(text);

    if (voices.length > 0) {
      if (isHindi) {
        const hindiVoice = voices.find((v) =>
          v.lang.toLowerCase().includes("hi")
        );
        utterance.voice = hindiVoice || voices[0];
        utterance.lang = "hi-IN";
      } else {
        utterance.voice = voices[0];
        utterance.lang = "en-US";
      }
    }

    utterance.onerror = (e) => {
      console.error("Speech error:", e.error);
      setIsSpeaking(false);
    };

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    const searchQuery = encodeURIComponent(userInput);

    switch (type) {
      case "google_search":
        window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
        break;
      case "calculator_open":
        window.open(`https://www.google.com/search?q=calculator`, "_blank");
        break;
      case "instagram_open":
        window.open(`https://www.instagram.com/`, "_blank");
        break;
      case "facebook_open":
        window.open(`https://www.facebook.com/`, "_blank");
        break;
      case "weather_show":
        window.open(`https://www.google.com/search?q=weather`, "_blank");
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, "_blank");
        break;
      default:
        break;
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

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
      }
    };

    recognition.onerror = (e) => {
      console.error("Recognition error:", e.error);
      recognition.stop();
    };

    recognition.onend = () => {
      console.warn("Recognition ended, restarting...");
      if (hasInteracted) recognition.start();
    };

    recognition.start();
    setRecognitionInstance(recognition);

    return () => recognition.stop();
  }, [userData, hasInteracted]);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-black to-[#02023d] flex justify-center items-center flex-col gap-4 relative overflow-hidden">
      {/* Hamburger Icon for mobile */}
      <HiMenuAlt3
        className="cursor-pointer lg:hidden text-white fixed top-5 right-5 text-4xl z-50"
        onClick={() => setHam(true)}
      />

      {/* Overlay */}
      {ham && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setHam(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[300px] bg-[#2017178d] backdrop-blur-md z-50 transform ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="relative h-full w-full p-5 flex flex-col gap-5">
          <GoX
            className="cursor-pointer text-white absolute top-5 right-5 text-4xl"
            onClick={() => setHam(false)}
          />

          <button
            className="px-5 py-3 w-[150px] bg-white text-black rounded-full font-semibold text-sm mt-16"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="px-5 py-3 bg-white text-black rounded-full font-semibold text-sm"
            onClick={() => navigate("/customize")}
          >
            Customize your Assistant
          </button>

          <div className="w-full h-px bg-gray-400 my-2"></div>
          <h1 className="text-white font-semibold text-lg">History</h1>

          {/* Only this section is scrollable */}
          <div className="w-full max-h-[300px] overflow-y-auto pr-2 scroll-hidden ">
            {userData.history?.map((his, i) => (
              <span key={i} className="text-gray-400 text-sm truncate block mb-1">
                {his}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons for Large Screen */}
      <button
        className="min-w-[150px] h-[50px] text-black font-semibold bg-white rounded-full text-base absolute top-5 right-5 hidden lg:block"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="px-5 h-[50px] text-black font-semibold bg-white rounded-full text-base absolute top-[90px] right-5 hidden lg:block"
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

      <h1 className="text-white text-lg font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {hasInteracted &&
        (isSpeaking ? (
          <img
            src={assistGif}
            className="w-[150px] h-[150px] mt-4"
            alt="Assistant is speaking..."
          />
        ) : (
          <img
            src={assistGif1}
            className="w-[150px] h-[150px] mt-4"
            alt="Waiting for user input..."
          />
        ))}
    </div>
  );
};

export default Home;
