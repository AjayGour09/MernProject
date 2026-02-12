import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const server_url = "http://localhost:8000";
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  const socketRef = useRef();
  const localVideoref = useRef();
  const localStream = useRef();
  const connections = useRef({});

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);

  const navigate = useNavigate();

  // ================= CONNECT =================
  const connect = async () => {
    setAskForUsername(false);

    socketRef.current = io(server_url);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.pathname);
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current = stream;
    localVideoref.current.srcObject = stream;

    // ============ USER JOINED ============
    socketRef.current.on("user-joined", (id, clients) => {
      clients.forEach((socketListId) => {
        if (socketListId === socketRef.current.id) return;

        connections.current[socketListId] =
          new RTCPeerConnection(peerConfigConnections);

        // Add local tracks
        localStream.current.getTracks().forEach((track) => {
          connections.current[socketListId].addTrack(
            track,
            localStream.current
          );
        });

        // ICE Candidate
        connections.current[socketListId].onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit(
              "signal",
              socketListId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };

        // Remote Stream
        connections.current[socketListId].ontrack = (event) => {
          setVideos((prevVideos) => {
            const alreadyExists = prevVideos.find(
              (v) => v.socketId === socketListId
            );
            if (alreadyExists) return prevVideos;

            return [
              ...prevVideos,
              { socketId: socketListId, stream: event.streams[0] },
            ];
          });
        };

        // 🔥 CREATE OFFER
        connections.current[socketListId]
          .createOffer()
          .then((description) => {
            connections.current[socketListId]
              .setLocalDescription(description)
              .then(() => {
                socketRef.current.emit(
                  "signal",
                  socketListId,
                  JSON.stringify({
                    sdp: connections.current[socketListId].localDescription,
                  })
                );
              });
          });
      });
    });

    // ============ SIGNAL ============
    socketRef.current.on("signal", async (fromId, message) => {
      const signal = JSON.parse(message);

      if (!connections.current[fromId]) {
        connections.current[fromId] =
          new RTCPeerConnection(peerConfigConnections);

        localStream.current.getTracks().forEach((track) => {
          connections.current[fromId].addTrack(
            track,
            localStream.current
          );
        });

        connections.current[fromId].ontrack = (event) => {
          setVideos((prevVideos) => {
            const alreadyExists = prevVideos.find(
              (v) => v.socketId === fromId
            );
            if (alreadyExists) return prevVideos;

            return [
              ...prevVideos,
              { socketId: fromId, stream: event.streams[0] },
            ];
          });
        };

        connections.current[fromId].onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current.emit(
              "signal",
              fromId,
              JSON.stringify({ ice: event.candidate })
            );
          }
        };
      }

      if (signal.sdp) {
        await connections.current[fromId].setRemoteDescription(
          new RTCSessionDescription(signal.sdp)
        );

        if (signal.sdp.type === "offer") {
          const answer =
            await connections.current[fromId].createAnswer();
          await connections.current[fromId].setLocalDescription(answer);

          socketRef.current.emit(
            "signal",
            fromId,
            JSON.stringify({
              sdp: connections.current[fromId].localDescription,
            })
          );
        }
      }

      if (signal.ice) {
        await connections.current[fromId].addIceCandidate(
          new RTCIceCandidate(signal.ice)
        );
      }
    });

    // ============ USER LEFT ============
    socketRef.current.on("user-left", (id) => {
      if (connections.current[id]) {
        connections.current[id].close();
        delete connections.current[id];
      }

      setVideos((prev) => prev.filter((v) => v.socketId !== id));
    });
  };

  // ================= TOGGLE =================
  const handleVideo = () => {
    localStream.current.getVideoTracks()[0].enabled = !video;
    setVideo(!video);
  };

  const handleAudio = () => {
    localStream.current.getAudioTracks()[0].enabled = !audio;
    setAudio(!audio);
  };

  const handleEndCall = () => {
    localStream.current.getTracks().forEach((track) => track.stop());
    socketRef.current.disconnect();
    navigate("/home");
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {askForUsername ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h2 className="text-2xl font-bold">Enter Lobby</h2>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded bg-gray-700"
          />
          <button
            onClick={connect}
            className="bg-orange-500 px-6 py-2 rounded"
          >
            Join Call
          </button>
        </div>
      ) : (
        <>
          {/* Local Video */}
          <video
            ref={localVideoref}
            autoPlay
            muted
            className="w-60 fixed bottom-6 right-6 border-2 border-orange-500 rounded"
          />

          {/* Remote Videos */}
          <div className="flex flex-wrap gap-4 p-6">
            {videos.map((video) => (
              <video
                key={video.socketId}
                autoPlay
                ref={(ref) => {
                  if (ref && video.stream) {
                    ref.srcObject = video.stream;
                  }
                }}
                className="w-80 h-60 bg-black rounded"
              />
            ))}
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 w-full flex justify-center gap-6 py-4 bg-gray-800">
            <button onClick={handleVideo}>
              {video ? "🎥" : "🚫🎥"}
            </button>
            <button onClick={handleAudio}>
              {audio ? "🎤" : "🔇"}
            </button>
            <button onClick={handleEndCall}>
              📞❌
            </button>
          </div>
        </>
      )}
    </div>
  );
}
