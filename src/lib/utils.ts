// utils/characterParser.ts

type Stat = {
    name: string;
    value: number;
    maxValue: number;
};

type Skill = {
    name: string;
    description: string;
};

type WeaknessOrStrength = {
    name: string;
};

export type CharacterData = {
    name: string;
    catchphrase: string;
    role: string;
    age: string;
    image: string;
    stats: Stat[];
    skills: Skill[];
    relic: string;
    weaknesses: WeaknessOrStrength[];
    strengths: WeaknessOrStrength[];
};



/**
 * Properly capitalizes a name (first letter uppercase, rest lowercase)
 */
export function capitalizeName(name: string): string {
    if (!name) return "Unknown";

    // For names with spaces, capitalize each word
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Parses markdown text from API into CharacterData object
 * @param apiResponse The API response containing markdown
 * @returns A formatted CharacterData object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseApiToCharacter(apiResponse: any, img: string) {
    console.log("Received apiResponse:", apiResponse);
    console.log("Received img:", img);

    let parsedData;

    if (typeof apiResponse === "object" && apiResponse !== null) {
        parsedData = apiResponse;
        console.log("Parsed data as object:", parsedData);
    } else {
        console.error("Invalid API response type");
        return getDefaultCharacter(img);
    }

    const dataString = parsedData.data;
    console.log("Extracted dataString:", dataString);

    // Remove code block markers and any trailing characters
    const jsonString = dataString
    .replace(/^```json[\s\n]*/, "")
    .replace(/```[\s\S]*$/, "")
    .trim();
    console.log("Cleaned jsonString:", jsonString);

    let jsonParsed;
    try {
        jsonParsed = JSON.parse(jsonString);
        console.log("Parsed JSON:", jsonParsed);
    } catch (error) {
        console.error("JSON parsing error:", error);
        return getDefaultCharacter(img);
    }

    const result = {
        ...jsonParsed,
        tokenMetadata: parsedData.tokenMetadata,
        image: img
    };
    console.log("Final result:", result);

    return result;
}
  
  



// Helper function to return default character data
function getDefaultCharacter(img: string): CharacterData {
    return {
        name: "Unknown",
        catchphrase: "No catchphrase",
        role: "Unknown Role",
        age: "Unknown",
        image: img || "/images/unknown.png",
        stats: [],
        skills: [],
        relic: "No relic",
        weaknesses: [],
        strengths: [],
    };
}



