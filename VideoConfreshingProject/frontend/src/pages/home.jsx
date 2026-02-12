import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate ,Link} from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import logo from '../assets/logo3.png'

function HomeComponent() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">

      {/* Navbar */}
      <div className="flex justify-between items-center px-6 md:px-16 py-4 bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          Let's Connect
        </Link>

        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/history")}
            className="text-gray-700 hover:text-orange-500 transition font-medium"
          >
            History
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
            className="bg-orange-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-orange-600 hover:scale-105 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-12">

        {/* Left Panel */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-snug">
            Providing Quality Video Call Just Like Quality Education
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
            <input
              type="text"
              placeholder="Enter Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <button
              onClick={handleJoinVideoCall}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition duration-300"
            >
              Join
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={logo}
            alt="Video Call"
            className="w-72 md:w-[420px] object-contain drop-shadow-2xl hover:scale-105 transition duration-500"
          />
        </div>
      </div>
    </div>
  );
}

export default withAuth(HomeComponent);
