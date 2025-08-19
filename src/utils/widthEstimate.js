export function widthEstimate(it, pxPerDay, daysInclusiveFn) {
  const PX_PER_CHAR = 7
  const MIN_LABEL_CHARS = 6
  const RELAX_LABEL_CHARS = 0

  const real = Math.max(1, daysInclusiveFn(it.start, it.end)) * pxPerDay
  const minByChars = Math.ceil(MIN_LABEL_CHARS * PX_PER_CHAR)
  const relaxByName = Math.ceil(
    Math.max(0, it.name.length - RELAX_LABEL_CHARS) * PX_PER_CHAR,
  )
  return Math.max(pxPerDay, real, minByChars, relaxByName)
}
