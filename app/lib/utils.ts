import { v4 as uuidv4 } from 'uuid';

export function generateSessionId(): string {
  // Look for existing session ID in localStorage or generate a new one
  const existingSessionId =
    typeof window !== 'undefined'
      ? localStorage.getItem('swipe_session_id')
      : null;

  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = uuidv4();

  if (typeof window !== 'undefined') {
    localStorage.setItem('swipe_session_id', newSessionId);
  }

  return newSessionId;
}

export const imagesList = [
  '/images/mig1.png',
  '/images/mig2.png',
  '/images/mig3.png',
  '/images/mig4.png',
  '/images/mig5.png',
  '/images/mig6.png',
  '/images/mig7.png',
  '/images/mig8.png',
  '/images/mig9.png',
  '/images/mig10.png',
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
