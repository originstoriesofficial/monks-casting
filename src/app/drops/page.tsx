import React from "react";

const drops = [
  {
    title: "Mønks",
    mediaUrl: "/media/drop1.jpg",
    minted: 342,
    contract: "0x38BeD286A1EbaB9BA4508A6aF3937A5458f03198",
  },
  {
    title: "Original Monk",
    mediaUrl: "/media/drop2.mp4",
    minted: 239,
    contract: "0x37dae9AF22F4d6c54B11F266A1F158de2429014e",
  },
  {
    title: "Friend of Monk",
    mediaUrl: "/media/drop3.mp4",
    minted: 45,
    contract: "0x69f970FE7b0802FFa6745a1487bCfD81a28e3107",
  },
  {
    title: "La Lotería de MØNKS 001",
    mediaUrl: "/media/drop4.jpg",
    minted: 1001,
    contract: "0x9451BD93cD31D03A1807fA0822D7F1256A24DEFF",
  },
  {
    title: "La Lotería de MØNKS 002",
    mediaUrl: "/media/drop5.jpg",
    minted: 901,
    contract: "0x5DE360C9Ba4e437c7A0486C418312B1E2cE8122C",
  },
  {
    title: "La Lotería de MØNKS 003",
    mediaUrl: "/media/drop6.jpg",
    minted: 900,
    contract: "0xd76AFcF57Ae0429d2B0C79e4b8fCb01798114C99",
  },
  {
    title: "La Monjería",
    mediaUrl: null,
    comingSoon: true,
  },
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
              <>
                <p className="text-sm text-gray-400">Minted: {drop.minted}</p>
                {drop.contract && (
                  <p className="text-xs text-gray-500 break-all mt-1">
                    <span className="text-amber-300">CA:</span> {drop.contract}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
