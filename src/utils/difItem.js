export function isItemDirty(curr, orig) {
  if (!orig) return false
  return (
    curr.start !== orig.start ||
    curr.end !== orig.end ||
    curr.name !== orig.name
  )
}
