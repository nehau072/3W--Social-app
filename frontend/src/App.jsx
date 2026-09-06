import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  const isLoggedIn = () => {
    return !!localStorage.getItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/home"
          element={
            isLoggedIn() ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* ROOT */}
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={
            isLoggedIn() ? (
              <Navigate to="/home" replace />
            ) : (
              <Signup />
            )
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isLoggedIn() ? (
              <Navigate to="/home" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* UNKNOWN URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;