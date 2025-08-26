# Video Setup Guide for Hero Section

## What We've Set Up

I've updated your hero section to use local video files with better performance and browser compatibility. Here's what has been implemented:

### ✅ File Structure Created
```
frontend/public/
├── videos/
│   ├── README.md (instructions for video files)
│   └── [your video files go here]
└── images/
    ├── README.md (instructions for image files)
    ├── hero-poster.jpg (shows while video loads)
    └── hero-fallback.jpg (shows if video fails)
```

### ✅ Enhanced Video Features
- **Multiple format support**: MP4, WebM, OGG for better browser compatibility
- **Loading states**: Smooth transitions when video loads
- **Error handling**: Graceful fallback to image if video fails
- **Poster image**: Shows while video is loading
- **Enhanced controls**: Better styled play/pause button
- **Responsive design**: Works on all screen sizes

### ✅ Improved Styling
- Enhanced video overlay for better text readability
- Smooth loading animations
- Better video controls styling
- Fallback image handling

## Next Steps: Add Your Video Files

### 1. Add Your Main Video
Place your video file in `frontend/public/videos/` with the exact name:
```
frontend/public/videos/hero-video.mp4
```

### 2. Add Fallback Images
Place these images in `frontend/public/images/`:
```
frontend/public/images/hero-poster.jpg    (shows while video loads)
frontend/public/images/hero-fallback.jpg  (shows if video fails)
```

### 3. Optional: Add Multiple Formats
For better browser compatibility, you can also add:
```
frontend/public/videos/hero-video.webm
frontend/public/videos/hero-video.ogg
```

## Video Specifications

For optimal performance, your video should be:
- **Format**: MP4 (H.264 codec)
- **Resolution**: 1920x1080 or 1280x720
- **Aspect Ratio**: 16:9 (landscape)
- **Duration**: 10-30 seconds (will loop)
- **File Size**: Under 10MB for fast loading
- **Frame Rate**: 24-30 fps

## Content Suggestions

For your Algerian traditional fashion website, consider videos featuring:
- Traditional Algerian clothing and textiles
- Cultural celebrations and ceremonies
- Artisan craftsmanship
- Beautiful landscapes of Algeria
- Fashion shows or modeling sessions

## How It Works

1. **Video loads**: Shows poster image while loading
2. **Video plays**: Automatically starts playing (muted, looping)
3. **User controls**: Can pause/play with the button
4. **Fallback**: If video fails, shows fallback image
5. **Responsive**: Works perfectly on all devices

## Testing

Once you add your video files:
1. Start your development server: `npm run dev`
2. Visit your homepage
3. The video should automatically start playing
4. Test the play/pause button
5. Test on different devices and browsers

## Troubleshooting

If the video doesn't play:
1. Check that the filename is exactly `hero-video.mp4`
2. Ensure the file is in the correct directory
3. Check browser console for errors
4. Verify the video format is supported (MP4 with H.264 codec)

The system will automatically fall back to the image if there are any issues with the video. 