// SplashScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./LogoIDS.png"; // make sure this path is correct

export default function SplashScreen() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Total splash time
    const totalMs = 3000;

    // Start exit animation a bit before navigation
    const exitAnimMs = 600; // duration of zoom-out animation
    const exitStartMs = totalMs - exitAnimMs;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, exitStartMs);

    const navTimer = setTimeout(() => {
      navigate("/signup", { replace: true });
    }, totalMs);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div style={styles.page}>
    <img
  src={logo}
  alt="Logo"
  style={{
    ...styles.logo,
    animation: isExiting
      ? "zoomInExit 600ms ease-in forwards"
      : "splashIn 900ms ease-out both, floaty 1.8s ease-in-out 1s infinite",
  }}
/>


      <style>{`
        @keyframes splashIn {
          0%   { transform: scale(0.6); opacity: 0; filter: blur(6px); }
          60%  { transform: scale(1.08); opacity: 1; filter: blur(0px); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
          @keyframes zoomInExit {
  0% {
    transform: scale(1);
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
    filter: blur(4px);
  }
}


        /* exit animation */
        @keyframes zoomOut {
          0%   { transform: scale(1); opacity: 1; filter: blur(0px); }
          100% { transform: scale(0.2); opacity: 0; filter: blur(6px); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#ffffff",
    textAlign: "center",
    padding: 24,
  },
  logo: {
    width: 260,
    maxWidth: "80vw",
    willChange: "transform, opacity, filter",
  },
};
