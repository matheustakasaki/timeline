import { timeDay, timeWeek } from "d3-time";

export default function TimelineHeader({ startBound, endBound, x }) {
    const dayTicks = timeDay.every(1).range(startBound, endBound);
    const weekSet = new Set(timeWeek.every(1).range(startBound, endBound).map(Number));

    return (
        <div className="absolute top-0 left-0 right-0 h-8 border-b border-gray-200">
            {dayTicks.map((d, i) => {
                const isWeek = weekSet.has(+d);
                return (
                    <div
                        key={i}
                        title={d.toISOString().slice(0, 10)}
                        className={`absolute top-0 bottom-0 border-l ${isWeek ? "border-gray-300" : "border-gray-100"}`}
                        style={{ left: x(d), width: 0 }}
                    />
                );
            })}
        </div>
    );
}
