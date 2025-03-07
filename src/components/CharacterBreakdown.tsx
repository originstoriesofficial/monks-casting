// app/character/page.tsx
import { parseApiToCharacter } from "@/lib/utils";
import CharacterProfile from "@/components/CharacterProfile";

// Define the API fetch function

export default  function CharacterPage(markdownData: string,imageData: string) {

console.log({markdownData,imageData}, 'frontend data here');


  const characterData = parseApiToCharacter(markdownData,imageData);
  console.log({characterData});
  
  return (
    <main className="container mx-auto p-4">
      <CharacterProfile characterData={characterData}  />
    </main>
  );
}