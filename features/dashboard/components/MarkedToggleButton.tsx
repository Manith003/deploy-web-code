"use client";

import { Star } from "lucide-react";

interface MarkedToggleButtonProps {
  markedForRevision?: boolean;
}

export default function MarkedToggleButton({
  markedForRevision,
}: MarkedToggleButtonProps) {
  return (
    <>
      <Star
        className={`h-4 w-4 mr-2 ${
          markedForRevision
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
      <span>{markedForRevision ? "Unstar" : "Star"}</span>
    </>
  );
}
