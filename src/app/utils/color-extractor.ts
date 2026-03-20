/**
 * Utility to extract dominant colors from an image using Canvas API
 * and perform color analysis like luminance calculation.
 */
export class ColorExtractor {
  /**
   * Extract dominant colors from an image URL
   * @param url Image source URL
   * @returns Promise with an array of RGB strings and a boolean indicating if it's light
   */
  static async extract(url: string): Promise<{ colors: string[]; isLight: boolean }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ colors: ['#18181b', '#27272a', '#3f3f46'], isLight: false });
          return;
        }

        canvas.width = 10;
        canvas.height = 10;
        ctx.drawImage(img, 0, 0, 10, 10);

        const imageData = ctx.getImageData(0, 0, 10, 10).data;
        const colors: string[] = [];

        // Sample 3 points for a diverse palette
        const points = [
          (0 * 10 + 0) * 4, // Top left
          (5 * 10 + 5) * 4, // Center
          (9 * 10 + 9) * 4, // Bottom right
        ];

        points.forEach((p) => {
          const r = imageData[p];
          const g = imageData[p + 1];
          const b = imageData[p + 2];
          colors.push(`rgb(${r}, ${g}, ${b})`);
        });

        // Calculate luminance of the primary color
        const r = imageData[points[0]];
        const g = imageData[points[0] + 1];
        const b = imageData[points[0] + 2];
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const isLight = luminance > 0.5;

        resolve({ colors, isLight });
      };

      img.onerror = () => {
        resolve({ colors: ['#18181b', '#27272a', '#3f3f46'], isLight: false });
      };
    });
  }
}
