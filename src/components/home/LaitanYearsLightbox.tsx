"use client";

import { useEffect, useMemo, useState } from "react";
import type { LaitanYearSlot } from "@/lib/types";

type LaitanYearsLightboxProps = {
  slots: LaitanYearSlot[];
};

function getOrderedSlots(slots: LaitanYearSlot[]) {
  const slotMap = new Map(slots.map((slot) => [slot.position, slot]));

  return Array.from({ length: 6 }, (_, index) => {
    const position = index + 1;
    const slot = slotMap.get(position);

    return {
      position,
      asset_url: slot?.asset_url ?? null,
      caption: slot?.caption ?? null,
    };
  });
}

export default function LaitanYearsLightbox({ slots }: LaitanYearsLightboxProps) {
  const orderedSlots = useMemo(() => getOrderedSlots(slots), [slots]);
  const filledSlots = useMemo(
    () => orderedSlots.filter((slot) => Boolean(slot.asset_url)),
    [orderedSlots]
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  function closeLightbox() {
    setIsVisible(false);
    window.setTimeout(() => {
      setSelectedIndex(null);
    }, 180);
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((currentIndex) => {
          if (currentIndex === null || filledSlots.length === 0) {
            return currentIndex;
          }

          return (currentIndex + 1) % filledSlots.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((currentIndex) => {
          if (currentIndex === null || filledSlots.length === 0) {
            return currentIndex;
          }

          return (currentIndex - 1 + filledSlots.length) % filledSlots.length;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [filledSlots.length, selectedIndex]);

  function openLightbox(position: number) {
    const nextIndex = filledSlots.findIndex((slot) => slot.position === position);
    if (nextIndex >= 0) {
      setSelectedIndex(nextIndex);
    }
  }

  function goToNext() {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || filledSlots.length === 0) {
        return currentIndex;
      }

      return (currentIndex + 1) % filledSlots.length;
    });
  }

  function goToPrevious() {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null || filledSlots.length === 0) {
        return currentIndex;
      }

      return (currentIndex - 1 + filledSlots.length) % filledSlots.length;
    });
  }

  const selectedSlot = selectedIndex === null ? null : filledSlots[selectedIndex];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {orderedSlots.map((slot) => (
          <div
            key={slot.position}
            className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden"
          >
            {slot.asset_url ? (
              <button
                type="button"
                onClick={() => openLightbox(slot.position)}
                className="group block w-full text-left hover-lift"
                aria-label={`Open photo ${slot.position}`}
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-ivory">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slot.asset_url}
                    alt={slot.caption || `Laitan Throughout the Years photo ${slot.position}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              </button>
            ) : (
              <div className="aspect-[4/5] border-2 border-dashed border-gold-light bg-ivory flex items-center justify-center">
                <svg className="w-10 h-10 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
                </svg>
              </div>
            )}
            {slot.caption ? (
              <div className="px-3 py-3">
                <p className="text-sm text-text-muted text-center">{slot.caption}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {selectedSlot?.asset_url ? (
        <div
          className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute right-4 top-4 rounded-full border border-gold/70 bg-black/50 p-2 text-gold transition-colors hover:bg-black/70"
            aria-label="Close lightbox"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {filledSlots.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 md:left-6 rounded-full border border-gold/60 bg-black/50 p-3 text-gold transition-colors hover:bg-black/70"
                aria-label="Previous photo"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 md:right-6 rounded-full border border-gold/60 bg-black/50 p-3 text-gold transition-colors hover:bg-black/70"
                aria-label="Next photo"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          ) : null}

          <div
            className={`relative flex max-h-[90vh] max-w-[90vw] items-center justify-center transition-all duration-200 ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedSlot.asset_url}
              alt={selectedSlot.caption || `Laitan Throughout the Years photo ${selectedSlot.position}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
