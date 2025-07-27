import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Costomize from "./pages/Costomize";
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";
import Customize2 from "./pages/Customize2";

const App = () => {
  const { userData } = useContext(userDataContext);

  // Debug logging
  // console.log("App.jsx - userData:", userData);
  // console.log("App.jsx - assistantImage:", userData?.assistantImage);
  // console.log("App.jsx - assistantName:", userData?.assistantName);
  // console.log(
  //   "App.jsx - condition:",
  //   userData?.assistantImage && userData?.assistantName
  // );

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Costomize /> : <Navigate to={"/login"} />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to={"/login"} />}
      />
    </Routes>
  );
};

export default App;
