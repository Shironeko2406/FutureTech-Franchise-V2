import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { formatVideoDuration } from './Duration'

dayjs.extend(duration)

export function getVideoDuration(url) {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.src = url
    video.onloadedmetadata = () => {
      resolve(formatVideoDuration(Math.floor(video.duration)))
    }
    video.onerror = () => resolve('--:--')
  })
}

export const decodeVideoDurationFromUrl = (url) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/duration=([\d:]+)/);
    return match ? match[1] : null; // Trích xuất thời lượng (dạng "5:55") hoặc trả về null nếu không tìm thấy
  } catch (error) {
    console.error("Error decoding video URL:", error);
    return null;
  }
};

