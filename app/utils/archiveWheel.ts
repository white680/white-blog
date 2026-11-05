type ArchiveWheelEvent = Pick<WheelEvent, 'deltaX' | 'deltaY' | 'deltaMode' | 'ctrlKey'>

export function getArchiveWheelAction(
  event: ArchiveWheelEvent,
  scrollLeft: number,
  maxScroll: number,
  viewportWidth: number,
  viewportHeight: number,
): { target: 'timeline' | 'page', delta: number } | null {
  if (event.ctrlKey || maxScroll <= 0 || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return null

  const target = (event.deltaY < 0 && scrollLeft <= 0) || (event.deltaY > 0 && scrollLeft >= maxScroll)
    ? 'page'
    : 'timeline'
  const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? target === 'page' ? viewportHeight : viewportWidth : 1)
  return delta ? { target, delta } : null
}
