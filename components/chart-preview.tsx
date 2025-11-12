"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function ChartPreview() {
  return (
    <div className="flex h-full items-center justify-center bg-zinc-50 p-4 md:p-8">
      <Card className="w-full max-w-4xl shadow-sm">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 md:h-[500px] md:p-12">
          <BarChart3 className="h-12 w-12 text-zinc-300 md:h-16 md:w-16" />
          <div className="text-center">
            <h3 className="text-base font-semibold text-zinc-900 md:text-lg">No data yet</h3>
            <p className="mt-2 text-sm text-zinc-500 md:text-base">
              Upload a CSV or Excel file to get started with your visualization
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
