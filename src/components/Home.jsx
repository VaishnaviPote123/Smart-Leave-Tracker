import React from "react";

const Home = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    minHeight: "100vh",
    padding: "40px 20px",
    color: "#fff",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(270deg, #96e6a1, #d4fc79, #ffe29f, #ffa99f)",
    backgroundSize: "800% 800%",
    animation: "gradientBG 15s ease infinite",
  };

  const fadeInStyle = (i) => ({
    opacity: 0,
    transform: "translateY(20px)",
    animation: `fadeInUp 1s forwards`,
    animationDelay: `${i * 0.5}s`,
  });

  const bounceStyle = {
    opacity: 0,
    animation: `fadeInUp 1s forwards, bounce 1s infinite`,
    animationDelay: `2.5s`,
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginTop: "20px",
  };

  const h2Style = {
    fontSize: "3rem",
    marginBottom: "20px",
    color: "#fff",
    textShadow: "2px 2px 10px rgba(0,0,0,0.3)",
  };

  const pStyle = {
    fontSize: "1.2rem",
    marginBottom: "15px",
    color: "#fff",
    textShadow: "1px 1px 8px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s, color 0.3s",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ ...h2Style, ...fadeInStyle(1) }}>
        Welcome to Smart Leave Tracker
      </h2>
      <p
        style={{ ...pStyle, ...fadeInStyle(2) }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        Track your leaves and manage employees efficiently!
      </p>
      <p
        style={{ ...pStyle, ...fadeInStyle(3) }}
        onMouseEnter={(e) => (e.target.style.color = "#ffeb3b")}
        onMouseLeave={(e) => (e.target.style.color = "#fff")}
      >
        Save time, improve productivity, and stay organized.
      </p>
      <p style={bounceStyle}>Simple. Smart. Effective.</p>

      <style>
        {`
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>
    </div>
  );
};

export default Home;
