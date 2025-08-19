import { useRef, useState } from "react";
import { useDrag } from "@use-gesture/react";
import { parseISO, addDays, formatISO } from "date-fns";
import clsx from "clsx";

export default function TimelineItem({
    item,
    laneTop,
    pxPerDay,
    leftPx,
    widthPx,
    onUpdate,
    dirty = false,
    onReset,
}) {
    const [editing, setEditing] = useState(false);
    const [tempName, setTempName] = useState(item.name);

    function commitEdit() {
        onUpdate(item.id, { name: (tempName || item.name).trim() });
        setEditing(false);
    }
    // Pixels accumulators to avoid visual jumps
    const moveAccPx = useRef(0);
    const leftAccPx = useRef(0);
    const rightAccPx = useRef(0);

    // Util: convert pixels accumulated into days and consumes from accumulator
    const consumeDays = (accRef, dx, pxPerDay) => {
        accRef.current += dx;
        const steps = Math.trunc(accRef.current / pxPerDay);
        if (steps !== 0) {
            accRef.current -= steps * pxPerDay; // consume the steps
        }
        return steps;
    };

    // Body drag(move) 
    const bindMove = useDrag(
        ({ delta: [dx], first, last }) => {
            if (first) moveAccPx.current = 0;
            const stepDays = consumeDays(moveAccPx, dx, pxPerDay);
            if (stepDays !== 0) {
                const s = addDays(parseISO(item.start), stepDays);
                const e = addDays(parseISO(item.end), stepDays);
                onUpdate(item.id, {
                    start: formatISO(s, { representation: "date" }),
                    end: formatISO(e, { representation: "date" }),
                });
            }
            if (last) moveAccPx.current = 0;
        },
        { axis: "x", filterTaps: true, pointer: { capture: true } }
    );

    //  Left Resize 
    const bindLeft = useDrag(
        ({ delta: [dx], first, last }) => {
            if (first) leftAccPx.current = 0;
            const stepDays = consumeDays(leftAccPx, dx, pxPerDay);
            if (stepDays !== 0) {
                const cand = addDays(parseISO(item.start), stepDays);
                const safe = cand <= parseISO(item.end) ? cand : parseISO(item.end);
                onUpdate(item.id, { start: formatISO(safe, { representation: "date" }) });
            }
            if (last) leftAccPx.current = 0;
        },
        { axis: "x", filterTaps: true, pointer: { capture: true } }
    );

    // Right Resize
    const bindRight = useDrag(
        ({ delta: [dx], first, last }) => {
            if (first) rightAccPx.current = 0;
            const stepDays = consumeDays(rightAccPx, dx, pxPerDay);
            if (stepDays !== 0) {
                const cand = addDays(parseISO(item.end), stepDays);
                const safe = cand >= parseISO(item.start) ? cand : parseISO(item.start);
                onUpdate(item.id, { end: formatISO(safe, { representation: "date" }) });
            }
            if (last) rightAccPx.current = 0;
        },
        { axis: "x", filterTaps: true, pointer: { capture: true } }
    );

    function commitEdit() {
        onUpdate(item.id, { name: (tempName || item.name).trim() });
        setEditing(false);
    }

    return (
        <div
            className={clsx(
                "absolute border shadow-sm flex items-center overflow-hidden",
                "bg-sky-100 border-sky-200 group",
                "select-none touch-none" // avoid selection when dragging
            )}
            style={{
                left: leftPx(item.start),
                top: laneTop + 2,
                width: widthPx(item),
                height: 36 - 4,
                willChange: "left,width"
            }}
            title={`${item.name}\n${item.start} — ${item.end}`}
        >
            {/* left handle */}
            <div
                {...bindLeft()}
                className="w-1 h-5 cursor-ew-resize bg-black/25 shrink-0"
                title="Ajustar início"
            />

            <div className="flex-1 px-2 min-w-0">
                {editing ? (
                    <input
                        className="w-full bg-white/80 rounded px-1 text-sm outline-none"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") setEditing(false);
                        }}
                        autoFocus
                    />
                ) : (
                    <div
                        {...bindMove()}
                        className="text-sm font-medium truncate text-gray-900 cursor-grab active:cursor-grabbing"
                        title="Arraste para mover • Duplo clique para renomear"
                        onDoubleClick={() => setEditing(true)}
                    >
                        {item.name}
                    </div>
                )}
            </div>

            {/* right handle  */}
            <div
                {...bindRight()}
                className="w-1 h-5 cursor-ew-resize bg-black/25 shrink-0"
                title="Ajustar término"
            />

            {dirty && (
                <button
                    type="button"
                    onClick={onReset}
                    className="absolute right-1 top-1 px-1.5 py-0.5 rounded text-[11px] leading-none bg-white/90 border border-gray-300 shadow hover:bg-white"
                    title="Undo item's changes"
                >
                    Undo
                </button>
            )}
        </div>
    );
} 