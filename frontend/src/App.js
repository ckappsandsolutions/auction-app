import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Bidding from "./components/Bidding/Bidding";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Bidding />
              </PrivateRoute>
            }
          />
          <Route path="/today" element={<div>Today's Auction</div>} />
          <Route path="/upcoming" element={<div>Upcoming Auction</div>} />
          <Route path="/prices" element={<div>Prices</div>} />
          <Route path="/clients" element={<div>Clients</div>} />
          <Route path="/register" element={<div>Register Page</div>} />


          <Route path="/profile" element={<div>Profile Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;