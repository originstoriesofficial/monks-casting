import React from "react";

const drops = [
  { title: "Mønks", mediaUrl: "/media/drop1.jpg", minted: 342 },
  { title: "Original Monk", mediaUrl: "/media/drop2.mp4", minted: 239 },
  { title: "Friend of Monk", mediaUrl: "/media/drop3.mp4", minted: 45 },
  { title: "La Lotería de MØNKS 001", mediaUrl: "/media/drop4.jpg", minted: 1001 },
  { title: "La Lotería de MØNKS 002", mediaUrl: "/media/drop5.jpg", minted: 901 },
  { title: "La Lotería de MØNKS 003", mediaUrl: "/media/drop6.jpg", minted: 900 },
  { title: "La Monjería", mediaUrl: null, comingSoon: true },
];

const totalMints = drops.reduce((sum, drop) => sum + (drop.minted || 0), 0);

export default function DropsPage() {
  return (
    <div className="min-h-screen bg-black text-[#e3d7b6] py-12 px-6 relative">
      <h1 className="text-4xl font-bold text-center mb-10">Project Drops</h1>

      <div className="absolute top-6 right-6 text-sm text-gray-400">
        Total Mints: {totalMints}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop, index) => (
          <div
            key={index}
            className="border border-[#bfa36f] rounded-lg p-4 bg-[#1a1208] text-center"
          >
            <h2 className="text-xl font-semibold mb-4">{drop.title}</h2>
            {drop.comingSoon ? (
              <p className="italic text-yellow-400">Coming Soon</p>
            ) : drop.mediaUrl?.endsWith(".mp4") ? (
              <video
                src={drop.mediaUrl}
                className="w-full h-48 object-cover mb-4 rounded"
                controls
              />
            ) : (
              <img
                src={drop.mediaUrl}
                alt={drop.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            {!drop.comingSoon && (
              <p className="text-sm text-gray-400">Minted: {drop.minted}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
