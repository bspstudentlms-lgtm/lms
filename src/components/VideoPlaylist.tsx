"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import mux from 'mux-embed';
const USER_ID = "user_123"; // Replace with your actual user ID
const VideoPlaylist = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch playlist once
  useEffect(() => {
    fetch("https://www.backstagepass.co.in/mux/mux-videos.php")
      .then((res) => res.json())
      .then((data) => {
        const ids = data
          .filter((item: any) => item.status === "ready")
          .map((item: any) => item.playback_id);
        setPlaylist(ids);
      })
      .catch((err) => console.error("Error fetching playlist:", err));
  }, []);

  // Load new video when index or playlist changes
  useEffect(() => {
  const video = videoRef.current;
  if (!video || playlist.length === 0) return;

  const playbackId = playlist[currentIndex];
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  setIsLoading(true);
console.log("playbackId:", playbackId);
console.log("currentIndex:", currentIndex);
console.log("USER_ID:", USER_ID);
  // ✅ Monitor with mux-embed AFTER playbackId is defined
  mux.monitor(video, {
    debug: true, // remove this in production
    data: {
      env_key: "42arfmo0o9r6enrng2p33q9t2", // 🔑 replace with your real env key
      player_name: "MyCustomPlayer",
      video_id: playbackId,
      video_title: `Video ${currentIndex + 1}`,
      viewer_user_id: USER_ID,
    },
  });

  // Destroy previous HLS instance
  if (hlsRef.current) {
    console.log("Destroying previous HLS instance");
    hlsRef.current.destroy();
    hlsRef.current = null;
  }

  // Clear video source to fully reset
  video.pause();
  video.removeAttribute("src");
  video.load();

  if (Hls.isSupported()) {
    const hls = new Hls();
    hlsRef.current = hls;

    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      console.log("HLS media attached");
      hls.loadSource(streamUrl);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("HLS manifest parsed, playing video");
      video.play().catch((err) => console.warn("Autoplay error:", err));
      setIsLoading(false);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error("HLS.js error:", data);
    });
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = streamUrl;
    video.addEventListener("loadedmetadata", () => {
      console.log("Native HLS loaded");
      video.play().catch((err) => console.warn("Autoplay error:", err));
      setIsLoading(false);
    });
  } else {
    console.error("HLS not supported in this browser");
  }

  // Cleanup on unmount
  return () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  };
}, [currentIndex, playlist]);
useEffect(() => {
  const startTime = Date.now();

  return () => {
  const endTime = Date.now();
  const watchTime = Math.floor((endTime - startTime) / 1000);

  console.log("About to send watch log for video:", playlist[currentIndex]);

  fetch("https://www.backstagepass.co.in/mux/log-watch.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "user_123",
      video_id: playlist[currentIndex],
      watch_time: watchTime,
      timestamp: new Date().toISOString()
    })
  })
  .then(res => {
    console.log("Raw fetch response", res);
    return res.text();  // Use text() to avoid JSON parse errors if not JSON response
  })
  .then(text => {
    console.log("Response text:", text);
    try {
      const json = JSON.parse(text);
      console.log("Parsed JSON:", json);
    } catch (e) {
      console.warn("Response is not valid JSON");
    }
  })
  .catch(err => console.error("Fetch error:", err));
};
}, [currentIndex]);


  // Handle video end
  const handleEnded = () => {
    if (currentIndex < playlist.length - 1) {
      console.log("Video ended. Loading next...");
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 300); // small delay to ensure smooth cleanup
    } else {
      console.log("Playlist complete");
    }
  };

  if (playlist.length === 0) return <p>Loading video playlist...</p>;

  return (
    <div>
      <h2>Mux Video Playlist</h2>
      <video
        ref={videoRef}
        controls
        autoPlay
        onEnded={handleEnded}
        width="100%"
        style={{ marginBottom: 20 }}
      />
      {isLoading && <p>Loading next video...</p>}
      <p>
        Now playing video {currentIndex + 1} of {playlist.length}
      </p>
    </div>
  );
};

export default VideoPlaylist;
