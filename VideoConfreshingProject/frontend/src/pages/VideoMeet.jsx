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
  const iceQueue = useRef({});

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const [videos, setVideos] = useState([]);
  const [username, setUsername] = useState("");
  const [askForUsername, setAskForUsername] = useState(true);

  const navigate = useNavigate();

  // ================= CONNECT =================
  const connect = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setAskForUsername(false);

    // Socket connection
    socketRef.current = io(server_url);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.pathname);
    });

    // Get local media
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStream.current = stream;

    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
      localVideoref.current.play().catch(() => {});
    }

    // ================= EXISTING USERS =================
    socketRef.current.on("existing-users", (clients) => {
      clients.forEach((id) => createPeerConnection(id, true));
    });

    // ================= NEW USER JOINED =================
    socketRef.current.on("user-joined", (id) => {
      createPeerConnection(id, false);
    });

    // ================= SIGNAL =================
    socketRef.current.on("signal", async (fromId, message) => {
      const signal = JSON.parse(message);
      if (!connections.current[fromId]) createPeerConnection(fromId, false);
      const pc = connections.current[fromId];

      if (signal.sdp) {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

        // Flush queued ICE candidates
        if (iceQueue.current[fromId]) {
          for (let ice of iceQueue.current[fromId]) {
            await pc.addIceCandidate(new RTCIceCandidate(ice));
          }
          iceQueue.current[fromId] = [];
        }

        if (signal.sdp.type === "offer") {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socketRef.current.emit(
            "signal",
            fromId,
            JSON.stringify({ sdp: pc.localDescription })
          );
        }
      }

      if (signal.ice) {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(signal.ice));
        } else {
          if (!iceQueue.current[fromId]) iceQueue.current[fromId] = [];
          iceQueue.current[fromId].push(signal.ice);
        }
      }
    });

    // ================= USER LEFT =================
    socketRef.current.on("user-left", (id) => {
      if (connections.current[id]) {
        connections.current[id].close();
        delete connections.current[id];
      }
      setVideos((prev) => prev.filter((v) => v.socketId !== id));
    });
  };

  // ================= CREATE PEER CONNECTION =================
  const createPeerConnection = (id, createOffer) => {
    const pc = new RTCPeerConnection(peerConfigConnections);
    connections.current[id] = pc;

    // Add local tracks first
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => pc.addTrack(track, localStream.current));
    }

    // Remote track
    pc.ontrack = (event) => {
      setVideos((prev) => {
        const newVideo = { socketId: id, stream: event.streams[0] };
        const exists = prev.find((v) => v.socketId === id);
        if (exists) {
          return prev.map((v) => (v.socketId === id ? newVideo : v));
        }
        return [...prev, newVideo];
      });
    };

    // ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("signal", id, JSON.stringify({ ice: event.candidate }));
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("Connection State:", pc.connectionState, id);
    };

    // Create offer after adding tracks
    if (createOffer) {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer).then(() => {
          socketRef.current.emit("signal", id, JSON.stringify({ sdp: pc.localDescription }));
        });
      });
    }
  };

  // ================= TOGGLE VIDEO / AUDIO =================
  const handleVideo = () => {
    if (localStream.current) {
      localStream.current.getVideoTracks()[0].enabled = !video;
      setVideo(!video);
    }
  };

  const handleAudio = () => {
    if (localStream.current) {
      localStream.current.getAudioTracks()[0].enabled = !audio;
      setAudio(!audio);
    }
  };

  // ================= END CALL =================
  const handleEndCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }

    Object.values(connections.current).forEach((pc) => pc.close());
    connections.current = {};

    setVideos([]);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    navigate("/home");
  };

  // ================= VIDEO PLAYER COMPONENT =================
  const VideoPlayer = ({ stream }) => {
    const ref = useRef();
    useEffect(() => {
      if (ref.current && stream) {
        ref.current.srcObject = stream;
        ref.current.onloadedmetadata = () => ref.current.play().catch(() => {});
      }
    }, [stream]);

    return <video ref={ref} autoPlay playsInline className="w-80 h-60 bg-black rounded" />;
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
          <button onClick={connect} className="bg-orange-500 px-6 py-2 rounded">
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
            playsInline
            className="w-60 fixed bottom-6 right-6 border-2 border-orange-500 rounded"
          />

          {/* Remote Videos */}
          <div className="flex flex-wrap gap-4 p-6">
            {videos.map((video) => (
              <VideoPlayer key={video.socketId} stream={video.stream} />
            ))}
          </div>

          {/* Controls */}
          <div className="fixed bottom-0 w-full flex justify-center gap-6 py-4 bg-gray-800">
            <button onClick={handleVideo}>{video ? "🎥" : "🚫🎥"}</button>
            <button onClick={handleAudio}>{audio ? "🎤" : "🔇"}</button>
            <button onClick={handleEndCall}>📞❌</button>
          </div>
        </>
      )}
    </div>
  );
}
