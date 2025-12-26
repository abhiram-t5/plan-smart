"use client";

import React, { useEffect } from "react";
import ChatBox from "./_components/ChatBox";
import Itinerary from "./_components/Itinerary";
import { useTripDetail } from "../provider";

function CreateNewTrip() {
  // @ts-ignore
  const { tripDetailInfo, setTripDetailInfo } = useTripDetail();

  const hasTrip = !!tripDetailInfo;

  // ✅ Reset trip on first load
  useEffect(() => {
    setTripDetailInfo(null);
  }, []);

  // ✅ Auto-scroll to top when trip is generated (mobile UX)
  useEffect(() => {
    if (hasTrip) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hasTrip]);

  return (
    <div className="
        relative
        h-[calc(100vh-70px)]
        overflow-hidden
        grid grid-cols-1 lg:grid-cols-2
        gap-5
        px-4 lg:px-10
        py-4
      ">

      {/* Chat Section */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${hasTrip ? "hidden" : "block"}
          lg:block
        `}
      >
        <ChatBox />
      </div>

      {/* Itinerary Section */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${hasTrip ? "block" : "hidden"}
          lg:block
          relative
        `}
      >
        <Itinerary />
      </div>

      {/* ✅ Floating Back Button (Mobile Only) */}
      {hasTrip && (
        <button
          onClick={() => setTripDetailInfo(null)}
          className="
            lg:hidden
            fixed bottom-5 right-5 z-50
            bg-primary text-white
            px-5 py-3 rounded-full shadow-lg
            active:scale-95 transition
          "
        >
          ← Back to Chat
        </button>
      )}
    </div>
  );
}

export default CreateNewTrip;