import { createClient } from '@supabase/supabase-js';
import { imagesList } from './utils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SwipeRecord {
  id?: string;
  session_id: string;
  image_name: string;
  decision: 'pass' | 'smash';
  created_at?: string;
}

export async function recordSwipe(
  record: Omit<SwipeRecord, 'id' | 'created_at'>
) {
  const { data, error } = await supabase
    .from('image_swipes')
    .insert([record])
    .select();

  if (error) {
    console.error('Error recording swipe:', error);
    return null;
  }

  return data?.[0];
}

export interface ImageStats {
  image_name: string;
  smash_count: number;
  pass_count: number;
  total_votes: number;
  smash_percentage: number;
}

export async function getImageStats(): Promise<ImageStats[]> {
  // Fetch raw stats from Supabase
  const { data, error } = await supabase
    .from('image_swipes')
    .select('image_name, decision');

  if (error) {
    console.error('Error fetching image stats:', error);
    return [];
  }

  // Process and aggregate the data
  const statsMap = new Map<string, { smashes: number; passes: number }>();

  // Initialize with all images
  imagesList.forEach((image) => {
    const imageName = image.split('/').pop() || '';
    statsMap.set(imageName, { smashes: 0, passes: 0 });
  });

  // Count smashes and passes
  data.forEach((record) => {
    const current = statsMap.get(record.image_name) || {
      smashes: 0,
      passes: 0,
    };

    if (record.decision === 'smash') {
      current.smashes += 1;
    } else if (record.decision === 'pass') {
      current.passes += 1;
    }

    statsMap.set(record.image_name, current);
  });

  // Convert to array and calculate percentages
  const statsArray: ImageStats[] = Array.from(statsMap.entries()).map(
    ([image_name, counts]) => {
      const total_votes = counts.smashes + counts.passes;
      const smash_percentage =
        total_votes > 0 ? (counts.smashes / total_votes) * 100 : 0;

      return {
        image_name,
        smash_count: counts.smashes,
        pass_count: counts.passes,
        total_votes,
        smash_percentage,
      };
    }
  );

  // Sort by smash percentage (highest first)
  return statsArray.sort((a, b) => b.smash_percentage - a.smash_percentage);
}
