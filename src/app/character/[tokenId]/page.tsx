// pages/character/[id].tsx or app/character/[id]/page.tsx (depending on your Next.js setup)
"use client"
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CharacterCard from '@/components/CharacterCard';

interface CharacterData {
  name: string;
  roleType: string;
  signatureMove: string;
  catchphrase: string;
  hp: number;
  statCard: {
    karma: string;
    grit: string;
    mantraPower: string;
    hustleSkill: string;
    signatureRelic: string;
  };
  strengths: string[];
  weaknesses: string[];
}

export default function CharacterPage() {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCharacter() {
      try {
        setLoading(true);
        // You'd typically fetch this from your API
        const response = await fetch(`/api/character/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }
        
        const result = await response.json();
        setCharacter(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCharacter();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading character data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!character) return <div className="p-8 text-center">No character data found</div>;

  return (
    <div className="p-4 md:p-8 flex justify-center items-center min-h-screen bg-gray-900">
      <CharacterCard character={character} />
    </div>
  );
}
