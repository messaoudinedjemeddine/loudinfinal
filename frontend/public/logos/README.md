# Logo Files for Website

This directory contains logo files for your Algerian Elegance website.

## Required Logo Files

### Primary Logos (Required)
- `logo-light.png` - Logo for light theme (white/light background)
- `logo-dark.png` - Logo for dark theme (dark background)

### Optional Logo Files
- `logo.svg` - Vector version for better scaling
- `favicon.ico` - Website favicon (16x16, 32x32, 48x48)
- `apple-touch-icon.png` - iOS home screen icon (180x180)
- `logo-mobile.png` - Smaller version for mobile devices

## Logo Specifications

### Main Logo Files
- **Format**: PNG with transparent background
- **Size**: 64x64px (minimum), 128x128px (recommended)
- **Background**: Transparent
- **Color**: 
  - `logo-light.png`: Dark colors for light backgrounds
  - `logo-dark.png`: Light colors for dark backgrounds

### Favicon
- **Format**: ICO (multiple sizes) or PNG
- **Sizes**: 16x16, 32x32, 48x48 pixels
- **Location**: Can also be placed in `/public/favicon.ico`

### Apple Touch Icon
- **Format**: PNG
- **Size**: 180x180 pixels
- **Background**: Solid color (no transparency)

## Logo Design Guidelines

For an Algerian traditional fashion website, consider:

### Design Elements
- **Traditional motifs**: Geometric patterns, arabesque designs
- **Cultural symbols**: Elements from Algerian heritage
- **Typography**: Arabic and Latin script integration
- **Colors**: Warm earth tones, gold accents, traditional colors

### Style Suggestions
- **Elegant and sophisticated**: Reflects premium fashion brand
- **Cultural authenticity**: Honors Algerian traditions
- **Modern appeal**: Appeals to contemporary women
- **Versatile**: Works in both light and dark themes

## How to Add Your Logo

### 1. Prepare Your Logo Files
1. Create your logo in high resolution (at least 200x200px)
2. Export in PNG format with transparent background
3. Create two versions:
   - Light version (dark colors) for light theme
   - Dark version (light colors) for dark theme

### 2. Place Files in Directory
```
frontend/public/logos/
├── logo-light.png    (dark colors for light theme)
├── logo-dark.png     (light colors for dark theme)
├── logo.svg          (optional vector version)
├── favicon.ico       (optional)
└── apple-touch-icon.png (optional)
```

### 3. Update Favicon (Optional)
If you want to update the main favicon, also place it in:
```
frontend/public/favicon.ico
```

## Logo Usage in Website

The logo is automatically used in:
- **Navbar**: Main navigation header
- **Favicon**: Browser tab icon
- **Mobile menu**: Mobile navigation
- **Admin panel**: Admin interface (if configured)

## Responsive Behavior

- **Desktop**: Shows logo + text
- **Tablet**: Shows logo + text (smaller)
- **Mobile**: Shows logo only (text hidden)

## Testing Your Logo

1. **Light Theme**: Logo should be visible on light backgrounds
2. **Dark Theme**: Logo should be visible on dark backgrounds
3. **Mobile**: Logo should look good at small sizes
4. **Different browsers**: Test across Chrome, Firefox, Safari, Edge

## Logo Optimization Tips

- **File size**: Keep under 50KB for fast loading
- **Compression**: Use PNG optimization tools
- **Scalability**: Consider creating SVG version for vector graphics
- **Accessibility**: Ensure good contrast ratios
- **Branding**: Maintain consistent colors and style

## Troubleshooting

If your logo doesn't appear:
1. Check file names match exactly
2. Verify file format is PNG
3. Ensure transparent background
4. Check file permissions
5. Clear browser cache

## Alternative Logo Implementation

If you prefer to use a single logo file, you can modify the navbar code to use:
```tsx
<Image
  src="/logos/logo.png"
  alt="Algerian Elegance Logo"
  width={40}
  height={40}
  className="w-full h-full object-contain"
/>
``` 