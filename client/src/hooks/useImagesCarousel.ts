import { useState } from "react";

// This hook is used to manage the state of an image carousel component
export const useImagesCarousel = (imagesNumber: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const atStart = currentIndex === 0;
  const atEnd = currentIndex === imagesNumber - 1;

  const nextImage = () => {
    if (!atEnd) {
      setCurrentIndex(prev => prev + 1);
    }
  }

  const previousImage = () => {
    if (!atStart) {
      setCurrentIndex(prev => prev - 1);
    }
  }

  return {
    currentIndex,
    nextImage,
    previousImage,
    atStart,
    atEnd,
  }
}
