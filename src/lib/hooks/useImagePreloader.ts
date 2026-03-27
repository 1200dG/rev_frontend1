import { useEffect } from "react";
import { toast } from "react-toastify";

export const useImagePreloader = (images: string[], onAllImagesLoad?: () => void) => {
  useEffect(() => {
    if (!images || images.length === 0) {
      onAllImagesLoad?.();
      return;
    }

    let loadedCount = 0;
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        onAllImagesLoad?.();
      }
    };

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.onload = checkAllLoaded;
        img.onerror = () => {
          toast.warn(`Image failed to load: ${src}`);
        };
      }
    });
  }, [images, onAllImagesLoad]);
};
