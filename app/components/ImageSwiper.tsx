import { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { recordSwipe } from '../lib/subabase';
import { imagesList, shuffleArray } from '../lib/utils';

interface ImageSwiperProps {
  sessionId: string;
}

export default function ImageSwiper({ sessionId }: ImageSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const controls = useAnimation();

  useEffect(() => {
    // Shuffle the images when the component mounts
    setImages(shuffleArray(imagesList));
  }, []);

  const handleSwipe = async (direction: 'smash' | 'pass') => {
    const imageName = images[currentIndex].split('/').pop() || '';

    // Record the swipe in the database
    await recordSwipe({
      session_id: sessionId,
      image_name: imageName,
      decision: direction,
    });

    // Animate the card off-screen with rotation and scale
    const targetX =
      direction === 'smash'
        ? window.innerWidth + 200
        : -window.innerWidth - 200;
    const rotation = direction === 'smash' ? 30 : -30; // Rotate clockwise for smash, counter-clockwise for pass

    await controls.start({
      x: targetX,
      opacity: 0,
      rotate: rotation,
      scale: 0.8,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 25,
      },
    });

    // Move to the next card
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex >= images.length) {
        // Reset to the beginning and reshuffle when all cards have been swiped
        setImages(shuffleArray(imagesList));
        return 0;
      }
      return newIndex;
    });

    // Reset the position for the next card with a fade-in effect
    await controls.start({
      x: 0,
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0 },
    });
  };

  const handleDragEnd = async (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100; // Minimum distance for a swipe

    if (Math.abs(info.offset.x) < threshold) {
      // Not swiped far enough, reset position with a spring animation
      await controls.start({
        x: 0,
        rotate: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      });
      return;
    }

    const direction = info.offset.x > 0 ? 'smash' : 'pass';
    await handleSwipe(direction);
  };

  // Add rotation while dragging
  const handleDrag = (_: any, info: PanInfo) => {
    const rotationFactor = 0.1; // Controls how much the card rotates while dragging
    const rotation = info.offset.x * rotationFactor;
    const scale = 1 - Math.min(Math.abs(info.offset.x), 150) / 1500; // Subtle scale down

    controls.start({
      x: info.offset.x,
      rotate: rotation,
      scale: scale,
      transition: { type: 'just' },
    });
  };

  // If we haven't loaded images yet
  if (images.length === 0) {
    return (
      <div className='flex items-center justify-center h-[80vh]'>
        Loading...
      </div>
    );
  }

  return (
    <div className='relative flex flex-col items-center justify-center h-[60vh]'>
      <motion.div
        className='w-80 h-96 bg-white rounded-lg shadow-lg overflow-hidden'
        drag='x'
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        animate={controls}
        initial={{ x: 0, rotate: 0, scale: 1 }}
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          touchAction: 'none',
        }}
        whileTap={{ cursor: 'grabbing' }}
      />

      {/* Instruction text below the image */}
      <div className='text-center mt-4 mb-6 bg-gray-100 p-2 rounded-md text-gray-800'>
        Swipe left to pass. Swipe right if you like the glasses.
      </div>

      <div className='flex gap-8 big-font'>
        <motion.button
          className='p-4 bg-red-700 text-white rounded-full shadow-lg'
          onClick={() => handleSwipe('pass')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🥸 Pass
        </motion.button>

        <motion.button
          className='p-4 bg-green-600 text-white rounded-full shadow-lg'
          onClick={() => handleSwipe('smash')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          😎 I like these glasses
        </motion.button>
      </div>
    </div>
  );
}
