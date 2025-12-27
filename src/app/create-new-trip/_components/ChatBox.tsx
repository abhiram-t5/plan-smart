"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { Loader, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import EmptyBoxState from "./EmptyBoxState";
import GroupSizeUi from "./GroupSizeUi";
import BudgetUi from "./BudgetUi";
import SelectDays from "./SelectDaysUi";
import FinalUi from "./FinalUi";
import { useMutation } from "convex/react";
import { api } from "@/../../convex/_generated/api";
import { useTripDetail, useUserDetail } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

type Message = {
  role: "user" | "assistant";
  content: string;
  ui?: string | null;
};

export type TripInfo = {
  budget: string;
  destination: string;
  duration: string;
  group_size: string;
  origin: string;
  hotels: Hotel[];
  itinerary: Itinerary[];
};

export type Hotel = {
  hotel_name: string;
  hotel_address: string;
  price_per_night: string;
  hotel_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  description: string;
};

export type Activity = {
  place_name: string;
  place_details: string;
  place_image_url: string;
  geo_coordinates: {
    latitude: number;
    longitude: number;
  };
  place_address: string;
  ticket_pricing: string;
  time_travel_each_location: string;
  best_time_to_visit: string;
};

export type Itinerary = {
  day: number;
  day_plan: string;
  best_time_to_visit_day: string;
  activities: Activity[];
};

/* ---------------- COMPONENT ---------------- */

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [tripDetail, setTripDetail] = useState<TripInfo | null>(null);
  const [tripId, setTripId] = useState<string>("");

  const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail);
  const { userDetail } = useUserDetail();
  //@ts-ignore
  const { setTripDetailInfo } = useTripDetail();
  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ---------------- SEND MESSAGE ---------------- */

  const onSend = async () => {
    if (isFinal) return;
    if (!userInput.trim()) return;

    const newMsg: Message = { role: "user", content: userInput };

    setMessages((prev) => [...prev, newMsg]);
    setUserInput("");
    setLoading(true);

    try {
      const result = await axios.post("/api/aimodel", {
        messages: [...messages, newMsg],
        isFinal: false,
      });

      let data: any = result.data;

      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          data = { resp: data, ui: null };
        }
      }

      const { resp, ui, trip_plan } = data || {};

      if (resp && !trip_plan) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: resp, ui },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FINAL GENERATION (AUTO, ONCE) ---------------- */

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.ui === "final" && !isFinal) {
      setIsFinal(true);

      (async () => {
        try {
          setLoading(true);

          const result = await axios.post("/api/aimodel", {
            messages,
            isFinal: true,
          });

          const trip_plan = result.data?.trip_plan as TripInfo | undefined;
          if (!trip_plan || !userDetail?._id) return;

          const newTripId = uuidv4();

          await SaveTripDetail({
            tripDetail: trip_plan,
            tripId: newTripId,
            uid: userDetail._id,
          });

          setTripId(newTripId);
          setTripDetail(trip_plan);
          setTripDetailInfo(trip_plan);
        } catch (err) {
          console.error("Final generation failed", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [messages, isFinal, SaveTripDetail, setTripDetailInfo, userDetail]);

  /* ---------------- GENERATIVE UI ---------------- */

  const RenderGenerativeUi = (ui?: string | null) => {
    switch (ui) {
      case "budget":
        return (
          <BudgetUi
            onSelectedOption={(v: string) => {
              setUserInput(v);
              onSend();
            }}
          />
        );
      case "groupSize":
        return (
          <GroupSizeUi
            onSelectedOption={(v: string) => {
              setUserInput(v);
              onSend();
            }}
          />
        );
      case "tripDuration":
        return (
          <SelectDays
            onSelectedOption={(v: string) => {
              setUserInput(v);
              onSend();
            }}
          />
        );
      case "final":
        return (
          <FinalUi
            viewTrip={() => router.push("/view-trip/" + tripId)}
            disable={!tripDetail}
          />
        );
      default:
        return null;
    }
  };

  /* ---------------- RENDER ---------------- */

  return (
    <div className="h-[85vh] flex flex-col border shadow rounded-2xl p-5">
      {messages.length === 0 && (
        <EmptyBoxState
          onSelectOption={(v: string) => {
            setUserInput(v);
            onSend();
          }}
        />
      )}

      {/* Messages */}
      <section className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mt-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-lg px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-black"
              }`}
            >
              {msg.content}
              {RenderGenerativeUi(msg.ui)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mt-2">
            <div className="max-w-lg bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader className="animate-spin h-4 w-4" /> Thinking…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </section>

      {/* Input */}
      <section>
        <div className="relative border rounded-2xl p-2">
          <Button
            size="icon"
            onClick={onSend}
            disabled={loading}
            className="absolute right-[5px] top-1/2 -translate-y-1/2 z-10"
          >
            <Send className="h-4 w-4" />
          </Button>

          <Textarea
            placeholder="Start typing here..."
            className="w-full min-h-[112px] bg-transparent border-none focus-visible:ring-0 shadow-none resize-none pr-12 pt-4"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
          />
        </div>
      </section>
    </div>
  );
}

export default ChatBox;
