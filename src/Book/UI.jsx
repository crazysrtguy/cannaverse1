import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

const pictures = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "2",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "18",
});

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const [audio] = useState(new Audio("/audios/page-flip-01a.mp3"));

  // Trigger audio playback in response to user interaction
  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  useEffect(() => {
    if (isUserInteracted) {
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }
  }, [page, isUserInteracted]);

  return (
    <>
<main className="pointer-events-none select-none z-20 fixed inset-0 flex justify-between flex-col" onClick={handleUserInteraction}>
<a
          className="pointer-events-auto mt-5 ml-5"
          href="https://t.me/+v5_6cI2X8Lw3ZDBh"
        >
          <img className="w-20" src="textures/logo.png" />
        </a>
        <div className="w-full overflow-auto pointer-events-auto flex justify-center">
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => {
                  setPage(index);
                  handleUserInteraction(); // Ensure audio playback is handled
                }}
              >
                {index === 0 ? "Cover" : `Page ${index}`}
              </button>
            ))}
            <button
              className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                page === pages.length
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => {
                setPage(pages.length);
                handleUserInteraction(); // Ensure audio playback is handled
              }}
            >
              Back Cover
            </button>
          </div>
        </div>
      </main>

      <div className="fixed inset-0 flex items-center -rotate-2 select-none">
        <div className="relative">
          <div className="bg-white/0  animate-horizontal-scroll flex items-center gap-8 w-max px-8">
            <h1 className="shrink-0 text-white text-10xl font-black ">
              CannaVerse
            </h1>
            <h2 className="shrink-0 text-white text-8xl italic font-light">
              META
            </h2>
            <h2 className="shrink-0 text-white text-12xl font-bold">
              Community
            </h2>
            <h2 className="shrink-0 text-transparent text-12xl font-bold italic outline-text">
              is
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-medium">
              ON
            </h2>
            <h2 className="shrink-0 text-white text-9xl font-extralight italic">
              the
            </h2>
            <h2 className="shrink-0 text-white text-13xl font-bold">
              way to
            </h2>
            <h2 className="shrink-0 text-transparent text-13xl font-bold outline-text italic">
              Take Over
            </h2>
          </div>
          <div className="absolute top 50 left-0 bg-white/0 animate-horizontal-scroll-2 flex items-center gap-18 px-8 w-max">
            <h2 className="shrink-0 text-white text-10xl font-black ">
              SOLANA
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
