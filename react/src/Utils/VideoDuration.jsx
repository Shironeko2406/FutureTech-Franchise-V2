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

