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
function capitalizeName(name: string): string {
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
export function parseApiToCharacter(apiResponse: any, img: string) {
    let parsedData;
    console.log(apiResponse, 'apiResponse type')
    if (typeof apiResponse === "object" && apiResponse !== null) {
        parsedData = apiResponse; // Already an object, use it directly
        
    } else {
        console.error("Invalid API response type");
        return getDefaultCharacter(img);
    }

    console.log(parsedData, 'parsedData')

    let jsonCovert = convertToJSON(parsedData.data, true, null);
    console.log(jsonCovert, 'jsonCovert')

    // Extract values safely with fallbacks
    // const {
    //     name = "Unknown",
    //     catchphrase = "No catchphrase",
    //     roleType: role = "Unknown Role",
    //     statCard = {},
    //     strengths = [],
    //     weaknesses = [],
    //     signatureMove = "",
    // } = parsedData;

    // const {
    //     karma = "Unknown",
    //     grit = "Unknown",
    //     mantraPower = "Unknown",
    //     hustleSkill = "Unknown",
    //     signatureRelic = "No relic",
    // } = statCard;

    // const stats: Stat[] = [
    //     { name: "Karma", value: karma, maxValue: 5 },
    //     { name: "Grit", value: grit, maxValue: 5 },
    //     { name: "Mantra Power", value: mantraPower, maxValue: 5 },
    // ];

    // const skills: Skill[] = [
    //     { name: "Signature Move", description: signatureMove || "Unknown Move" }
    // ];

    return {
        name,
        // catchphrase,
        // role,
        // age: "Unknown",
        // image: img || `/images/${name.toLowerCase().replace(/\s+/g, "-")}.png`,
        // stats,
        // skills,
        // relic: signatureRelic,
        // weaknesses: weaknesses.map(w => ({ name: w })),
        // strengths: strengths.map(s => ({ name: s })),
    };
}

/**
 * Converts data to a JSON string with optional formatting
 * @param data The data to convert
 * @param prettyPrint Whether to format the JSON string
 * @param replacer Optional replacer function
 * @returns The JSON string
 */
export default function convertToJSON(data, prettyPrint = false, replacer = null) {
 try {
   // Determine the indentation (spacing) to use
   const spacing = 2;
   
   // Convert the data to a JSON string
   const jsonString = JSON.stringify(data, replacer, spacing);
   
   // Return the JSON string
   return jsonString;
 } catch (error) {
   // Handle any errors that occur during conversion
   throw new Error(`Failed to convert data to JSON: ${error.message}`);
 }
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


// export function parseApiToCharacter(apiResponse: string, img: string): CharacterData {
//     // Extract the markdown from the API response (handle different formats)
//     const markdown = apiResponse;
//     const imageUrl = img || "";

//     console.log(markdown, 'markDown data to format')

//     // const nameM = apiResponse.

//     // Extract basic information with more flexible patterns
//     const nameMatch = markdown.match(/\*\*(?:Character Name|Name|Character):\*\*\s*([^\n(]+)/i);

  
        
//     const catchphraseMatch = markdown.match(/\*\*Catchphrase(?:\/One-liner)?:\*\* "?([^"\n]+)"?/) ||
//         markdown.match(/\*\*Catchphrase:\*\* "?([^"\n]+)"?/);
//     const roleMatch = markdown.match(/\*\*(?:Character Type|Role|Character|Position|Job|Title):\*\* ([^\n]+)/i);

//     const ageMatch = markdown.match(/\*\*Age Range:\*\* ([^\n]+)/);

//     // Improved relic extraction
//     const relicMatch = markdown.match(/\*\*SIGNATURE RELIC(?:\s|\*\*)?:(?:\s|\*\*)?(.+?)(?=\n|$)/i) ||
//         markdown.match(/\| SIGNATURE RELIC \|([^|]+)/) ||
//         markdown.match(/SIGNATURE RELIC \|([^|]+)/);

//     // Improved strengths and weaknesses extraction
//     const strengthsMatch = markdown.match(/\*\*Strengths:\*\*\s+([\s\S]+?)(?=\n\n\*\*|\n\n\n|\n---)/i);
//     const weaknessesMatch = markdown.match(/\*\*Weaknesses:\*\*\s+([\s\S]+?)(?=\n\n\*\*|\n\n\n|\n---)/i);

//     // Stats extraction with better handling of tables
//     const statLines = markdown.match(/\| ([^|]+)\| ([^|]+)\|/g) ||
//         markdown.match(/\| ([^|]+)\s*\|\s*([^|]+)\s*\|(?:\s*[^|]*\s*\|)?/g);

//     // Extract signature move more carefully
//     const signatureMoveMatch = markdown.match(/\*\*Signature Move:\*\*\s+"?([^"\n]+)"?(?:—|-|–)\s+(.+?)(?=\n|$)/) ||
//         markdown.match(/\*\*Signature Move:\*\*\s+([^"\n]+)/) ||
//         markdown.match(/\*\*Signature Move:\*\*\s+"([^"]+)"/);

//         console.log({signatureMoveMatch,statLines,roleMatch,catchphraseMatch,ageMatch,nameMatch});

//     // // Clean text formatting helper
//     // const cleanText = (text: string): string => {
//     //     if (!text) return "";
//     //     return text.replace(/\*\*/g, "").trim();
//     // };

//     // Extract and properly capitalize the name
//     let name = "Unknown";
//     if (nameMatch) {
//         name = capitalizeName(nameMatch[1].trim().split("(")[0].trim());
//     }

//     // Extract basic fields
//     const catchphrase = catchphraseMatch
//         ? catchphraseMatch[1].trim().replace(/"/g, "")
//         : "No catchphrase";

//     const role = roleMatch
//         ? roleMatch[1].trim().split("(")[0].trim()
//         : "Unknown Role";

//     const age = ageMatch
//         ? ageMatch[1].trim()
//         : "Unknown";

//     // Extract relic with better handling
//     let relic = "No relic";
//     if (relicMatch) {
//         relic = relicMatch[1].trim();
//         if (relic.includes("|")) {
//             relic = relic.split("|")[0].trim();
//         }
//     }

//     // Improved extraction of strengths and weaknesses
//     const parseList = (text: string | null): WeaknessOrStrength[] => {
//         if (!text) return [];

//         // Split by periods or newlines if there are no bullet points
//         const items = text.includes("*")
//             ? text.split("\n").filter(line => line.trim().startsWith("*"))
//             : text.split(/\.\s+/).filter(item => item.trim().length > 0);

//         return items.map(item => {
//             // Clean up the text
//             let cleanedItem = item
//                 .replace(/^\*/g, "") // Remove bullet points
//                 .replace(/\*\*/g, "") // Remove bold formatting
//                 .trim();

//             // If the item has a colon (like "Skill: Description"), take only the skill part
//             if (cleanedItem.includes(":")) {
//                 cleanedItem = cleanedItem.split(":")[0].trim();
//             }

//             return { name: cleanedItem };
//         });
//     };

//     // Handle possible paragraph format for strengths/weaknesses
//     const strengths = strengthsMatch
//         ? parseList(strengthsMatch[1])
//         : [];

//     const weaknesses = weaknessesMatch
//         ? parseList(weaknessesMatch[1])
//         : [];

//     // Extract stats from the Markdown table with improved handling
//     const stats: Stat[] = [];
//     if (statLines) {
//         const validStats = ["KARMA", "GRIT", "MANTRA POWER", "MANTRA"];

//         statLines.forEach(line => {
//             const parts = line.split("|").map(part => part.trim()).filter(Boolean);
//             if (parts.length >= 2) {
//                 const statName = parts[0].toUpperCase();

//                 // Only include valid stats, exclude HUSTLE SKILL
//                 if (validStats.some(validStat => statName.includes(validStat))) {
//                     stats.push({
//                         name: capitalizeName(parts[0]),
//                         value: convertStatValue(parts[1].split("(")[0].trim()),
//                         maxValue: 5
//                     });
//                 }
//             }
//         });
//     }

//     // Extract signature move and skills
//     const skills: Skill[] = [];
//     if (signatureMoveMatch) {
//         let moveName;
//         let moveDescription = "";

//         if (signatureMoveMatch.length > 2 && signatureMoveMatch[2]) {
//             moveName = signatureMoveMatch[1].trim();
//             moveDescription = signatureMoveMatch[2].trim();
//         } else {
//             // Handle case where there's no separate description
//             moveName = signatureMoveMatch[1].trim();

//             // Try to split at a dash or similar if present
//             const dashSplit = moveName.match(/(.+?)(?:—|-|–)\s+(.+)/);
//             if (dashSplit) {
//                 moveName = dashSplit[1].trim();
//                 moveDescription = dashSplit[2].trim();
//             }
//         }

//         skills.push({
//             name: moveName,
//             description: moveDescription
//         });
//     }

//     // Add second skill
//     if (skills.length === 0 || skills.length < 2) {
//         skills.push({
//             name: "Energy-Infused Fists",
//             description: ""
//         });
//     }

//     // Ensure we have at least some stats
//     if (stats.length === 0) {
//         stats.push(
//             { name: "Karma", value: 3, maxValue: 5 },
//             { name: "Grit", value: 4, maxValue: 5 },
//             { name: "Mantra Power", value: 3, maxValue: 5 }
//         );
//     }

//     return {
//         name,
//         catchphrase,
//         role,
//         age,
//         image: imageUrl || `/images/${name.toLowerCase().replace(/\s+/g, "-")}.png`,
//         stats,
//         skills,
//         relic,
//         weaknesses,
//         strengths,
//     };
// }

// Helper function to convert text values to numeric stats
function convertStatValue(value: string): number {
    const mapping: Record<string, number> = {
        // Common trait mappings
        "Hustler": 4,
        "Chaos": 5,
        "High": 4,
        "Low": 2,
        "Medium": 3,
        "Undetectable": 1,
        "Iconic": 5,
        "Legendary": 5,
        "Fleeting": 2,
        "Shady": 4,
        "Shady/White Collar": 4
    };

    // Check for specific keywords in the value to determine rating
    if (value.toLowerCase().includes("legendary")) return 5;
    if (value.toLowerCase().includes("high") || value.toLowerCase().includes("hustler")) return 4;
    if (value.toLowerCase().includes("medium") || value.toLowerCase().includes("green")) return 3;
    if (value.toLowerCase().includes("low") || value.toLowerCase().includes("fleeting")) return 2;
    if (value.toLowerCase().includes("undetectable")) return 1;

    return mapping[value] || 3; // Default to 3 if not found
}