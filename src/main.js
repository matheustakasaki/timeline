// Main.jsx

import { isItemDirty } from './utils/difItem.js'
import { useMemo, useState } from 'react'
import assignLanes from './assignLanes'

import { useBounds, useScale, daysInclusive } from './hooks/useTimeline'
import TimelineHeader from './components/TimelineHeader'
import TimelineItem from './components/TimelineItem'
import { widthEstimate } from './utils/widthEstimate'
const LANE_HEIGHT = 36
const LANE_GAP = 8

export default function Main({ items = [] }) {
  const [data, setData] = useState(items)
  const [pxPerDay, setPxPerDay] = useState(24)

  if (!Array.isArray(data) || data.length === 0) {
    return <div className='text-gray-700'>Nenhum item na timeline.</div>
  }

  const originalsById = useMemo(
    () => new Map(items.map((it) => [it.id, { ...it }])),
    [items],
  )

  // drag/resize/rename
  function updateItem(id, patch) {
    setData((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    )
  }

  // Undo function to reset an item to its original state
  function resetItem(id) {
    const orig = originalsById.get(id)
    if (!orig) return
    setData((prev) => prev.map((it) => (it.id === id ? { ...orig } : it)))
  }

  // Bounds + scale
  const { startBound, endBound } = useBounds(data, 3)
  const { x, totalDays, canvasWidth } = useScale(startBound, endBound, pxPerDay)

  // Compactated Lanes 
  const lanes = useMemo(() => assignLanes(data), [data])
  const height = lanes.length * (LANE_HEIGHT + LANE_GAP) + 40

  // POsition Helpers
  const leftPx = (iso) => x(new Date(iso + 'T00:00:00'))
  const widthPx = (it) => widthEstimate(it, pxPerDay, daysInclusive)

  // Zoom
  const zoomIn = () => setPxPerDay((v) => Math.min(120, Math.round(v * 1.25)))
  const zoomOut = () => setPxPerDay((v) => Math.max(6, Math.round(v / 1.25)))

  //rename/drag/resize
  function updateItem(id, patch) {
    setData((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <div className='font-semibold text-gray-900'>Timeline</div>
        <div className='ml-auto flex items-center gap-2'>
          <button
            className='px-3 py-1 rounded-xl shadow border border-gray-300 text-gray-700'
            onClick={zoomOut}
          >
            −
          </button>
          <div className='px-2 text-sm tabular-nums text-gray-600'>
            {pxPerDay} px/dia
          </div>
          <button
            className='px-3 py-1 rounded-xl shadow border border-gray-300 text-gray-700'
            onClick={zoomIn}
          >
            ＋
          </button>
        </div>
      </div>

      {/* Container scroll */}
      <div
        className='relative overflow-auto border rounded-xl bg-white border-gray-200'
        style={{ height: Math.min(420, height + 24) }}
      >
        <div className='relative' style={{ width: canvasWidth, height }}>
          <TimelineHeader startBound={startBound} endBound={endBound} x={x} />

          {/* Lanes de fundo */}
          {lanes.map((_, laneIndex) => (
            <div
              key={`lane-${laneIndex}`}
              className={`absolute left-0 right-0 border-y border-gray-200 ${
                laneIndex % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
              }`}
              style={{
                top: 32 + laneIndex * (LANE_HEIGHT + LANE_GAP),
                height: LANE_HEIGHT,
              }}
            />
          ))}

          {lanes.map((laneItems, laneIndex) =>
            laneItems.map((it) => (
              <TimelineItem
                key={it.id}
                item={it}
                laneTop={32 + laneIndex * (LANE_HEIGHT + LANE_GAP)}
                pxPerDay={pxPerDay}
                leftPx={leftPx}
                widthPx={widthPx}
                onUpdate={updateItem}
                // 🔹 undo props
                dirty={isItemDirty(it, originalsById.get(it.id))}
                onReset={() => resetItem(it.id)}
              />
            )),
          )}
        </div>
      </div>
    </div>
  )
}
