// import dayjs from 'dayjs'
// import duration from 'dayjs/plugin/duration'

// dayjs.extend(duration)

// export function formatDuration(minutes) {
//   if (!minutes) return '0 min'
//   const dur = dayjs.duration(minutes, 'minutes')
//   if (dur.asHours() >= 1) {
//     return `${Math.floor(dur.asHours())}h ${dur.minutes()}m`
//   }
//   return `${minutes} min`
// }

// export function formatVideoDuration(seconds) {
//   if (!seconds) return '--:--'
//   const dur = dayjs.duration(seconds, 'seconds')
//   if (dur.asHours() >= 1) {
//     return dur.format('H:mm:ss')
//   }
//   return dur.format('mm:ss')
// }

// export function calculateChapterStats(materials) {
//   const stats = materials.reduce((acc, material) => {
//     if (material.urlVideo) {
//       acc.videoCount++
//       // Giả sử mỗi video 10 phút
//       acc.totalDuration += 10
//     }
//     if (material.urlFile) {
//       acc.fileCount++
//     }
//     return acc
//   }, { videoCount: 0, fileCount: 0, totalDuration: 0 })

//   return {
//     ...stats,
//     formattedDuration: formatDuration(stats.totalDuration)
//   }
// }




import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

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
    // First count files and videos
    const stats = materials.reduce((acc, material) => {
      if (material.urlFile) {
        acc.fileCount++
      }
      if (material.urlVideo) {
        acc.videoCount++
      }
      return acc
    }, { videoCount: 0, fileCount: 0, totalDuration: 0 })
    
    // Then process video durations in parallel
    const durationPromises = materials
      .filter(material => material.urlVideo) // Only process materials with videos
      .map(async (material) => {
        const seconds = await getVideoDuration(material.urlVideo)
        return Math.floor(seconds / 60) // Convert seconds to minutes
      })
  
    // Wait for all durations to be calculated
    const durations = await Promise.all(durationPromises)
    
    // Sum up all durations
    stats.totalDuration = durations.reduce((acc, duration) => acc + duration, 0)
  
    return {
      ...stats,
      formattedDuration: formatDuration(stats.totalDuration)
    }
  }
  



// material ví dụ

// {
//     "id": "8cfeb4ab-12c0-46c5-c9f8-08dd235fe6b1",
//     "number": 1,
//     "title": "Chương 1. Các thế giới của Hệ thống Cơ sở Dữ liệu",
//     "urlFile": "https://vardhaman.org/wp-content/uploads/2021/03/CP.pdf",
//     "urlVideo": "https://firebasestorage.googleapis.com/v0/b/imageupdatedb.appspot.com/o/video-test2.mp4?alt=media&token=a6b2597c-1136-4472-82ba-bf217383f266",
//     "description": "Chương 1. Các thế giới của Hệ thống Cơ sở Dữ liệu",
//     "chapterId": "e9178839-95bb-4cb0-419e-08dd235fe6af",
//     "userChapterMaterials": null
//   },

