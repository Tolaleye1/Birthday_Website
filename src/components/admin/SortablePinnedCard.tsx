"use client";

import type { DragEvent } from "react";
import type { Contribution } from "@/lib/types";

type SortablePinnedCardProps = {
  contribution: Contribution;
  onTogglePin: (id: string, currentlyPinned: boolean) => void;
  isPinning: boolean;
  isDragging: boolean;
  onDragStart: (id: string) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
};

export default function SortablePinnedCard({
  contribution,
  onTogglePin,
  isPinning,
  isDragging,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: SortablePinnedCardProps) {
  const typeBadgeClass =
    contribution.type === "text"
      ? "bg-blush text-berry"
      : contribution.type === "photo"
        ? "bg-gold-glow text-gold"
        : "bg-purple-primary/10 text-purple-primary";

  return (
    <div
      onDragOver={onDragOver}
      onDrop={() => onDrop(contribution.id)}
      className={`flex items-center gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/80 p-4 transition-opacity ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        draggable
        onDragStart={() => onDragStart(contribution.id)}
        onDragEnd={onDragEnd}
        className="shrink-0 cursor-grab active:cursor-grabbing text-rose-300 hover:text-rose-400 touch-none"
        aria-label="Drag to reorder"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-text-dark text-sm">
            {contribution.submitter_name}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeBadgeClass}`}
          >
            {contribution.type}
          </span>
        </div>
        <p className="text-xs text-text-muted truncate mt-0.5">
          {contribution.message || contribution.caption || "-"}
        </p>
      </div>

      {/* Date */}
      <span className="text-xs text-text-muted whitespace-nowrap hidden sm:block">
        {new Date(contribution.created_at).toLocaleDateString()}
      </span>

      {/* Unpin button */}
      <button
        type="button"
        onClick={() => onTogglePin(contribution.id, true)}
        disabled={isPinning}
        title="Unpin tribute"
        className="shrink-0 text-rose-500 hover:text-rose-700 transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6h2v-6h5v-2l-2-2z" />
        </svg>
      </button>
    </div>
  );
}
