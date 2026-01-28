/**
 * YouTube URL converter utility
 * Converts various YouTube URL formats to embed format
 */

/**
 * Convert YouTube URL to embed format
 * Supports multiple YouTube URL formats:
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID?si=...
 */
export const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;

  try {
    // If already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    // Extract video ID from various URL formats
    let videoId = null;

    // Format: https://youtu.be/VIDEO_ID
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    }
    // Format: https://www.youtube.com/watch?v=VIDEO_ID
    else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    }
    // Format: https://www.youtube.com/embed/VIDEO_ID
    else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('embed/')[1].split('?')[0].split('&')[0];
    }

    if (videoId) {
      // Return proper embed URL
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // If we can't extract video ID, assume it's already correct
    return url;
  } catch (error) {
    console.error('Error converting YouTube URL:', error);
    return url;
  }
};

/**
 * Check if URL is a YouTube URL
 */
export const isYoutubeUrl = (url) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export default {
  getYoutubeEmbedUrl,
  isYoutubeUrl,
};
