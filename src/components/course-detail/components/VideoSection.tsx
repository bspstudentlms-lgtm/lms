"use client";
import Muxvideo from "@/components/MuxVideoplayer";

export default function VideoSection({
  topic,
  resumeTime,
  onFinish,
}: any) {
  if (!topic) return null;

  if (topic.type !== "video") return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <Muxvideo
        videos={topic.video || []}
        topicId={String(topic.id)}
        resumeTime={resumeTime}
        autoplay
        onFinish={onFinish}
      />
    </div>
  );
}
