// export default function Leaderboard() {

//     const leaderboard = async () => {
//         try {
//           const response = await fetch("https://playground-s7c9.onrender.com/stack/leaderboard", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                     "limit": 10,
//                     "offset": 10
//             }),
//           });
      
//           const result = await response.json();
//           console.log("Getting leaderboard:", result);
//         } catch (error) {
//           console.error("Error getting leaderboard:", error);
//         }
//       };
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-200 text-white">
//         {/* <h1 className="text-3xl font-bold">Leaderboard</h1>
//         <p className="text-lg text-gray-400 mt-2">Top rankings will be displayed here.</p> */}
//       </div>
//     );
//   }
"use client";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://playground-s7c9.onrender.com/stack/leaderboard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ limit: 10, offset: 10 }),
        });
        
        const result = await response.json();
        console.log("Getting leaderboard:", result);
        console.log("Getting result.leaderboard", result.leaderboard);
        console.log("Getting result.metadata", result.metadata);
        setLeaderboard(result.leaderboard || []);
        setMetadata(result.metadata || null);
      } catch (error) {
        console.error("Error getting leaderboard:", error);
      }
    };
    
    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      {metadata && (
        <div className="w-full max-w-4xl bg-indigo-800 p-6 rounded-lg shadow-md text-center">
          <h1 className="text-4xl font-bold text-yellow-400">{metadata.name}</h1>
          <p className="text-gray-300 mt-2">{metadata.description}</p>
          <img src={metadata.bannerUrl} alt="Banner" className="w-full h-40 object-cover mt-4 rounded-lg" />
        </div>
      )}

      <table className="w-full max-w-4xl mt-6 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-indigo-700 text-yellow-300">
          <tr>
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">Identity</th>
            <th className="py-3 px-4 text-left">Points</th>
            <th className="py-3 px-4 text-left">Badges</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.address} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4 font-semibold text-yellow-300">
                {entry.identities?.ENS?.displayName || "Unknown"}
              </td>
              <td className="py-3 px-4">{entry.points}</td>
              <td className="py-3 px-4">
                {entry.badges.length > 0 ? (
                  <div className="flex gap-2">
                    {entry.badges.map((badge, i) => (
                      <img
                        key={i}
                        src={badge.imageUrl}
                        alt={badge.name}
                        className="w-10 h-10 rounded-full border border-yellow-400"
                      />
                    ))}
                  </div>
                ) : (
                  "No Badges"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

  