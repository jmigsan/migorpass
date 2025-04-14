'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageStats, ImageStats } from '../lib/subabase';

export default function ResultsPage() {
  const [stats, setStats] = useState<ImageStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const imageStats = await getImageStats();
      setStats(imageStats);
      setLoading(false);
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-xl'>Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <header className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 text-center'>
          Mig or Pass Results
        </h1>
        <p className='text-gray-600 text-center mb-4 big-font'>
          See what people thought about these images!
        </p>
        <div className='text-center'>
          <Link href='/' className='text-blue-500 hover:underline'>
            ← Back to Voting
          </Link>
        </div>
      </header>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {stats.map((stat) => (
          <div
            key={stat.image_name}
            className='bg-white rounded-lg shadow-md overflow-hidden'
          >
            <div className='relative h-64 w-full'>
              <Image
                src={`/images/${stat.image_name}`}
                alt={`Image ${stat.image_name}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='p-4'>
              <h3 className='font-semibold text-lg mb-2'>
                {stat.image_name.replace(/\.[^/.]+$/, '')}
              </h3>

              <div className='flex justify-between mb-2 big-font'>
                <div className='text-green-600'>
                  <span className='font-bold'>{stat.smash_count}</span> migs
                </div>
                <div className='text-red-600'>
                  <span className='font-bold'>{stat.pass_count}</span> passes
                </div>
              </div>

              <div className='mb-2'>
                <div className='w-full bg-gray-200 rounded-full h-2.5'>
                  <div
                    className='bg-green-600 h-2.5 rounded-full'
                    style={{ width: `${stat.smash_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className='text-right text-sm text-gray-600'>
                {stat.smash_percentage.toFixed(1)}% mig rate
              </div>

              <div className='mt-2 text-xs text-gray-500'>
                Total votes: {stat.total_votes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
