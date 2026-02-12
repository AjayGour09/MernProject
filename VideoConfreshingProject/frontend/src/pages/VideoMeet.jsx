import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const server_url = "http://localhost:8000"; // change if needed
var connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  const socketRef = useRef();
  const localVideoref = useRef();

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [screen, setScreen] = useState(false);
  const [showModal, setModal] = useState(false);
  const [screenAvailable, setScreenAvailable] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(0);
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);

  const navigate = useNavigate();
  const localStream = useRef();

  useEffect(() => {
    if (navigator.mediaDevices.getDisplayMedia) {
      setScreenAvailable(true);
    }
  }, []);

  const getUserMediaSuccess = (stream) => {
    localStream.current = stream;
    localVideoref.current.srcObject = stream;

    socketRef.current.on("user-joined", (id, clients) => {
      clients.forEach((socketListId) => {
        connections[socketListId] = new RTCPeerConnection(
          peerConfigConnections
        );

        connections[socketListId].onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        connections[socketListId].ontrack = (event) => {
          setVideos((videos) => {
            const videoExists = videos.find(
              (video) => video.socketId === socketListId
            );
            if (videoExists) return videos;
            return [...videos, { socketId: socketListId, stream: event.streams[0] }];
          });
        };

        stream.getTracks().forEach((track) => {
          connections[socketListId].addTrack(track, stream);
        });
      });
    });

    socketRef.current.on("signal", (fromId, message) => {
      const signal = JSON.parse(message);
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId].setLocalDescription(description).then(() => {
                    socketRef.current.emit(
                      "signal",
                      fromId,
                      JSON.stringify({ sdp: connections[fromId].localDescription })
                    );
                  });
                });
            }
          });
      }

      if (signal.ice) {
        connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice));
      }
    });
  };

  const connect = () => {
    setAskForUsername(false);
    socketRef.current = io.connect(server_url);

    navigator.mediaDevices
      .getUserMedia({ video, audio })
      .then(getUserMediaSuccess);

    socketRef.current.emit("join-call", window.location.href, username);

    socketRef.current.on("chat-message", (data) => {
      setMessages((prev) => [...prev, data]);
      setNewMessages((prev) => prev + 1);
    });
  };

  const handleVideo = () => {
    localStream.current.getVideoTracks()[0].enabled = !video;
    setVideo(!video);
  };

  const handleAudio = () => {
    localStream.current.getAudioTracks()[0].enabled = !audio;
    setAudio(!audio);
  };

  const handleScreen = () => {
    navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
      const screenTrack = stream.getTracks()[0];
      Object.values(connections).forEach((connection) => {
        const sender = connection.getSenders().find(
          (s) => s.track.kind === "video"
        );
        sender.replaceTrack(screenTrack);
      });

      screenTrack.onended = () => {
        Object.values(connections).forEach((connection) => {
          const sender = connection.getSenders().find(
            (s) => s.track.kind === "video"
          );
          sender.replaceTrack(localStream.current.getVideoTracks()[0]);
        });
      };

      setScreen(true);
    });
  };

  const handleEndCall = () => {
    localStream.current.getTracks().forEach((track) => track.stop());
    navigate("/home");
  };

  const sendMessage = () => {
    socketRef.current.emit("chat-message", {
      sender: username,
      data: message,
    });
    setMessage("");
  };

  const closeChat = () => {
    setModal(false);
    setNewMessages(0);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {askForUsername ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
          <h2 className="text-3xl font-bold">Enter into Lobby</h2>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 w-80 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={connect}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            Connect
          </button>

          <video
            ref={localVideoref}
            autoPlay
            muted
            className="mt-6 w-96 rounded-xl shadow-2xl"
          />
        </div>
      ) : (
        <div className="relative w-full h-screen flex flex-col">
          {showModal && (
            <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 shadow-2xl z-50 flex flex-col">
              <div className="p-4 border-b border-gray-700 flex justify-between">
                <h1 className="text-lg font-bold">Chat</h1>
                <button onClick={closeChat}>✖</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length !== 0 ? (
                  messages.map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold text-orange-400">
                        {item.sender}
                      </p>
                      <p className="text-sm">{item.data}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No Messages Yet</p>
                )}
              </div>

              <div className="p-4 border-t border-gray-700 flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter message..."
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <video
            ref={localVideoref}
            autoPlay
            muted
            className="absolute bottom-24 right-6 w-60 rounded-xl shadow-2xl border-2 border-orange-500"
          />

          <div className="flex flex-wrap gap-4 p-6 justify-center items-center flex-1 overflow-auto">
            {videos.map((video) => (
              <div
                key={video.socketId}
                className="bg-black rounded-xl overflow-hidden shadow-xl"
              >
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  className="w-80 h-60 object-cover"
                />
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 w-full flex justify-center gap-6 py-4 bg-gray-800 border-t border-gray-700">
            <button
              onClick={handleVideo}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
            >
              {video ? "🎥" : "🚫🎥"}
            </button>

            <button
              onClick={handleAudio}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
            >
              {audio ? "🎤" : "🔇"}
            </button>

            {screenAvailable && (
              <button
                onClick={handleScreen}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full"
              >
                🖥️
              </button>
            )}

            <button
              onClick={handleEndCall}
              className="bg-red-600 hover:bg-red-700 p-3 rounded-full"
            >
              📞❌
            </button>

            <button
              onClick={() => setModal(!showModal)}
              className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full relative"
            >
              💬
              {newMessages > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-xs px-2 py-0.5 rounded-full">
                  {newMessages}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
