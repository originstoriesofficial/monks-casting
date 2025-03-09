/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // ✅ Corrected import
import CharacterCard from "@/components/CharacterCard";



export default function CharacterPage() {
  const { id } = useParams(); // ✅ Fixed `router.query` issue
  const [character, setCharacter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // ✅ Ensures `id` is available before fetching

    const fetchCharacter = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/character/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch character data");
        }

        const result = await response.json();
        setCharacter(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading character data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!character) return <div className="p-8 text-center">No character data found</div>;

  return (
    <div className="p-4 md:p-8 flex justify-center items-center min-h-screen bg-gray-900">
      <CharacterCard characterData={character} />
    </div>
  );
}
