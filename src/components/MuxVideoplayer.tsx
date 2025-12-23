import React, { useState, useRef, useEffect } from 'react';
import MuxPlayer from '@mux/mux-player-react';

interface Video {
  playback_id: string;
   status: string;
  created_at: string;
}

interface MuxVideoplayerProps {
  videos: Video[];
  userId: string;
  topicId: string;
  resumeTime?: number;
  currentVideoIndex?: number; // <-- new
  onFinish?: () => void;
   autoplay?: boolean; // Add autoplay prop
}

const Muxvideo: React.FC<MuxVideoplayerProps> = ({
  videos,
  userId,
  topicId,
  resumeTime = 0,
  currentVideoIndex = 0,  // default to 0 if not provided
  onFinish,
   autoplay = false, // Default to false if not passed
}) => {
  const safeIndex = Math.min(currentVideoIndex, videos.length - 1); // never exceed video list
  const [currentIndex, setCurrentIndex] = useState(safeIndex);      // use safe index
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!videos || !videos[currentIndex]) {
      console.warn(`Video not found at index ${currentIndex}`);
      return;
    }

    // const player = playerRef.current;
    // if (player) {
    //   const playPromise = player.play();
    //   if (playPromise !== undefined) {
    //     playPromise.catch((error) => {
    //       console.warn('Autoplay prevented:', error);
    //     });
    //   }
    // }
  }, [currentIndex, videos]);

  useEffect(() => {
    lastSentTime.current = 0;
  }, [currentIndex]);

  const lastSentTime = useRef(0);

  if (!videos || videos.length === 0) {
    return <div>No videos available</div>;
  }

  const video = videos[currentIndex];
  if (!video) {
    console.warn(`Video not found at index ${currentIndex}`);
    return <div>Video not available.</div>;
  }

  // const handleEnded = () => {
  //   if (currentIndex < videos.length - 1) {
  //     setCurrentIndex((i) => i + 1);
  //   } else {
  //     onFinish?.();
  //   }
  // };
const handleEnded = () => {
 
  console.log("Fetch is being called!");
  console.log('Sending payload:', {
    user_id: userId,
    topic_id: topicId,
    playback_id: video.playback_id,
  });

  fetch('https://backstagepass.co.in/reactapi/mark_watched.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      topic_id: topicId
      
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Video marked as watched:', data);

      //  Move to next video or call onFinish
      if (currentIndex < videos.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        onFinish?.();
      }
    })
    .catch((err) => {
      console.error('Error marking video as watched:', err);
    });
};


  const handleTimeUpdate = (event) => {
    const ct = event.currentTarget.currentTime;  // Get current time of video
    const last = lastSentTime.current;           // Access the last sent time

    console.log('Last seen time:', last);  // Debugging log

    // Only send progress if current time has moved by 5 seconds
    //if (ct > last + 5 && last !== 0) {
    if (ct > last + 5) {
      lastSentTime.current = ct;  // Update lastSentTime to current time

      console.log('Current time:', ct);  // Debugging log

      // Send progress data to your API
      fetch('https://backstagepass.co.in/reactapi/mark_watched.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          topic_id: topicId,
          current_time: ct,  // Current time of video playback
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log('Progress saved:', data))
        .catch((err) => console.error('Error saving progress:', err));
    }
  };

  console.log("videos.length", videos.length);
  console.log("currentIndex", currentIndex);
  console.log("currentVideoIndex", currentVideoIndex);
  console.log("video", video);

  return (
    <MuxPlayer
      ref={playerRef}
      playbackId={video.playback_id}
      currentTime={resumeTime}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      autoplay={autoplay}
      muted
      controls
      metadata={{
        video_id: video.playback_id,
        video_title: `Video ${currentIndex + 1}`,
        viewer_user_id: userId,
      }}
      style={{ width: '100%', aspectRatio: '16/9' }}
    />
  );
};
export default Muxvideo;
