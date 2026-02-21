"use client";

import { memo } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface ContributionGraphProps {
  data: Array<{
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }>;
}

export const ContributionGraph = memo(function ContributionGraph({
  data,
}: ContributionGraphProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  const colorScheme = theme === "dark" ? "dark" : "light";

  const themeColors = {
    light: ["#f4f4f5", "#bfdbfe", "#60a5fa", "#2563eb", "#1d4ed8"],
    dark: ["#27272a", "#1e3a8a", "#2563eb", "#3b82f6", "#60a5fa"],
  };

  return (
    <div className="w-full flex justify-center py-4">
      <ActivityCalendar
        data={data}
        theme={themeColors}
        colorScheme={colorScheme as "light" | "dark"}
        blockSize={12}
        blockMargin={4}
        fontSize={12}
        labels={{
          totalCount: "{{count}} contributions in the last year",
        }}
        showWeekdayLabels
      />
    </div>
  );
});
