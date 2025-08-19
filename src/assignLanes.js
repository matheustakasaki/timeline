/**
  Takes an array of items and returns an array of lanes (each lane = array of items).
Does not handle UI; only allocation
 */
export default function assignLanes(items) {
  // Avoid changing original array
  const sortedItems = [...items].sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  )

  const lanes = []

  function assignItemToLane(item) {
    for (const lane of lanes) {
      // fits if last item in lane < start of current item
      if (new Date(lane[lane.length - 1].end) < new Date(item.start)) {
        lane.push(item)
        return
      }
    }
    lanes.push([item])
  }

  for (const item of sortedItems) {
    assignItemToLane(item)
  }
  return lanes
}
