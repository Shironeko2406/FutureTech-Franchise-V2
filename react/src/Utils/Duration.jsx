import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { decodeVideoDurationFromUrl } from './VideoDuration'

dayjs.extend(duration)

export function formatDuration(minutes) {
  if (!minutes) return '0 phút'
  const dur = dayjs.duration(minutes, 'minutes')
  if (dur.asHours() >= 1) {
    return `${Math.floor(dur.asHours())}h ${dur.minutes()}m`
  }
  return `${minutes} phút`
}

export function formatVideoDuration(seconds) {
  if (!seconds) return '--:--'
  const dur = dayjs.duration(seconds, 'seconds')
  if (dur.asHours() >= 1) {
    return dur.format('H:mm:ss')
  }
  return dur.format('mm:ss')
}

export function getVideoDuration(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = url
    video.onloadedmetadata = () => {
      resolve(Math.floor(video.duration))
    }
    video.onerror = () => resolve(0)
  })
}

export async function calculateChapterStats(materials) {
  // Count files and videos, and calculate total duration
  const stats = materials.reduce((acc, material) => {
    if (material.urlFile) {
      acc.fileCount++;
    }
    if (material.urlVideo) {
      acc.videoCount++;
      const duration = decodeVideoDurationFromUrl(material.urlVideo);
      if (duration) {
        const [minutes, seconds] = duration.split(':').map(Number);
        acc.totalDuration += minutes + (seconds / 60);
      }
    }
    return acc;
  }, { videoCount: 0, fileCount: 0, totalDuration: 0 });

  // Round the total duration to the nearest minute
  stats.totalDuration = Math.round(stats.totalDuration);

  return {
    ...stats,
    formattedDuration: formatDuration(stats.totalDuration)
  };
}
