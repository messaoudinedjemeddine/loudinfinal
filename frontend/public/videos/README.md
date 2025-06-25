# Video Files for Hero Section

This directory contains video files for the hero section of your website.

## Required Video Files

To ensure optimal performance and browser compatibility, please add the following video files:

### Primary Video (Required)
- `hero-video.mp4` - Main video file in MP4 format (recommended: 1920x1080, 30fps, H.264 codec)

### Optional Formats (for better browser compatibility)
- `hero-video.webm` - WebM format for modern browsers
- `hero-video.ogg` - OGG format for older browsers

## Video Specifications

For best performance, your hero video should have these characteristics:

- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Aspect Ratio**: 16:9 (landscape)
- **Frame Rate**: 24-30 fps
- **Duration**: 10-30 seconds (looping)
- **File Size**: Keep under 10MB for fast loading
- **Codec**: H.264 for MP4, VP9 for WebM

## Video Content Suggestions

For an Algerian traditional fashion website, consider videos featuring:
- Traditional Algerian clothing and textiles
- Cultural celebrations and ceremonies
- Artisan craftsmanship
- Beautiful landscapes of Algeria
- Fashion shows or modeling sessions

## How to Add Your Video

1. Place your video file(s) in this directory
2. Ensure the filename matches exactly: `hero-video.mp4`
3. If you have multiple formats, add them with the same base name
4. The video will automatically load in the hero section

## Fallback Images

If the video fails to load, the system will show a fallback image from `/public/images/hero-fallback.jpg`. Make sure to add this image as well.

## Performance Tips

- Compress your video files to reduce loading time
- Use a CDN for better global performance
- Consider adding a poster image (`/public/images/hero-poster.jpg`) that shows while the video loads 