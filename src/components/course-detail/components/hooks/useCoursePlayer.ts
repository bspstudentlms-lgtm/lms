"use client";
import { useEffect, useMemo, useState } from "react";

export function useCoursePlayer(modules: any[]) {
  const [openModule, setOpenModule] = useState(0);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [watchedTopicIds, setWatchedTopicIds] = useState<Set<number>>(new Set());
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>([]);

  const currentTopic = useMemo(() => {
    return modules?.[openModule]?.topics?.[currentPointIndex];
  }, [modules, openModule, currentPointIndex]);

  const totalVideoCount = useMemo(() => {
    if (!Array.isArray(modules)) return 0;

    return modules.reduce((acc, m) => {
      if (!Array.isArray(m?.topics)) return acc;

      return (
        acc +
        m.topics.filter(
          (t: any) => t && t.type === "video"
        ).length
      );
    }, 0);
  }, [modules]);


  const completedVideoCount = watchedTopicIds.size;

  const progressPercentage =
    totalVideoCount === 0
      ? 0
      : Math.round((completedVideoCount / totalVideoCount) * 100);

  const markWatched = (topicId: number) => {
    setWatchedTopicIds((prev) => new Set(prev).add(topicId));
  };

  const goNext = () => {
    const topics = modules[openModule]?.topics || [];
    if (currentPointIndex < topics.length - 1) {
      setCurrentPointIndex((p) => p + 1);
    } else if (openModule < modules.length - 1) {
      setOpenModule((m) => m + 1);
      setCurrentPointIndex(0);
    }
  };

  const goPrev = () => {
    if (currentPointIndex > 0) {
      setCurrentPointIndex((p) => p - 1);
    } else if (openModule > 0) {
      const prevModule = modules[openModule - 1];
      setOpenModule((m) => m - 1);
      setCurrentPointIndex(prevModule.topics.length - 1);
    }
  };

  return {
    openModule,
    setOpenModule,
    currentPointIndex,
    setCurrentPointIndex,
    currentTopic,
    watchedTopicIds,
    markWatched,
    completedModuleIds,
    progressPercentage,
    completedVideoCount,
    totalVideoCount,
    goNext,
    goPrev,
  };
}
