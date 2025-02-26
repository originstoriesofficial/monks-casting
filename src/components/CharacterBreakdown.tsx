// app/character/page.tsx
import { parseApiToCharacter, type CharacterData } from "@/lib/utils";
import CharacterProfile from "@/components/CharacterProfile";

// Define the API fetch function

export default  function CharacterPage(markdownData: string,imageData: string) {

console.log({markdownData,imageData});

  
  // Parse the markdown into our character data structure
  const characterData: CharacterData = parseApiToCharacter(markdownData,imageData);
  console.log({characterData});
  
  return (
    <main className="container mx-auto p-4">
      <CharacterProfile {...characterData} />
    </main>
  );
}