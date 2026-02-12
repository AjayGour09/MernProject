import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);
  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch {
        // Snackbar later
      }
    };

    fetchHistory();
  }, []);

  let formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6 md:p-12">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
          Meeting History
        </h1>

        <button
          onClick={() => routeTo("/home")}
          className="bg-orange-500 text-white px-5 py-2 rounded-xl shadow-md hover:bg-orange-600 hover:scale-105 transition duration-300"
        >
          ⬅ Back Home
        </button>
      </div>

      {/* Meeting Cards */}
      {meetings.length !== 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((e, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 hover:shadow-xl hover:scale-[1.02] transition duration-300"
            >
              <p className="text-sm text-gray-500 mb-2">Meeting Code</p>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {e.meetingCode}
              </h2>

              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium text-orange-600">
                {formatDate(e.date)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No Meeting History Found
        </div>
      )}
    </div>
  );
}
