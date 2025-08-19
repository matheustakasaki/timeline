// useTimeline.js
import { useMemo } from "react";
import { parseISO, addDays, differenceInCalendarDays, min, max } from "date-fns";
import { scaleTime } from "d3-scale";

export function useBounds(items, padDays = 3) {
  return useMemo(() => {
    const starts = items.map((i) => parseISO(i.start));
    const ends = items.map((i) => parseISO(i.end));
    const minStart = min(starts);
    const maxEnd = max(ends);
    return {
      startBound: addDays(minStart, -padDays),
      endBound: addDays(maxEnd, padDays),
    };
  }, [items, padDays]);
}

export function useScale(startBound, endBound, pxPerDay) {
  const totalDays = Math.max(1, differenceInCalendarDays(endBound, startBound));
  const canvasWidth = totalDays * pxPerDay;

  const x = useMemo(
    () => scaleTime().domain([startBound, endBound]).range([0, canvasWidth]),
    [startBound, endBound, canvasWidth]
  );

  return { x, totalDays, canvasWidth };
}

export function daysInclusive(startISO, endISO) {
  return differenceInCalendarDays(parseISO(endISO), parseISO(startISO)) + 1;
}
