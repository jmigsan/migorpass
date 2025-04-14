'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ImageSwiper from './components/ImageSwiper';
import { generateSessionId } from './lib/utils';

export default function Home() {
  const [sessionId, setSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionId(generateSessionId());
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-900 text-white'>
        <div className='animate-pulse'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='bg-gray-900 min-h-screen text-white'>
      <main className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center mb-6'>
          {/* Logo */}
          <div className='w-64 h-auto mb-4'>
            <Image
              src='/images/logo.png'
              alt='Mig or Pass Logo'
              width={256}
              height={120}
              priority
            />
          </div>

          {/* Results link */}
          <Link
            href='/results'
            className='px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-full 
            transition-colors duration-300 text-white font-medium big-font'
          >
            View Results
          </Link>
        </div>

        <ImageSwiper sessionId={sessionId} />
      </main>
    </div>
  );
}
