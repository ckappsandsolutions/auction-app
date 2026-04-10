import Navbar from "../Navbar";

const AuctionLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "2rem",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "1200px", 
          boxSizing: "border-box",
          overflowY: "auto",
          margin: "16px", 
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AuctionLayout;