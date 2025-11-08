"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="inline-flex items-center gap-2 px-8 py-6 text-base font-semibold border-2 border-gray-300 text-gray-700 bg-white rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
    >
      <ArrowLeft className="w-5 h-5" strokeWidth={2} />
      Go Back
    </Button>
  );
}

