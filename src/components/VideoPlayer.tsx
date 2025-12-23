"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  playbackId: string;
}

const VideoPlayer = ({ playbackId }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.load();

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.warn("Autoplay failed:", err));
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.warn("Autoplay failed:", err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [streamUrl]);

  return (
    <video
      ref={videoRef}
      controls
      width="100%"
      style={{ marginBottom: 20 }}
    />
  );
};

export default VideoPlayer;
