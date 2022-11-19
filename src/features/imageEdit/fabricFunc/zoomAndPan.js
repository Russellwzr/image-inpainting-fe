import { fabric } from 'fabric'

export const zoomInAndOut = (opt, drawCanvas) => {
  opt.e.preventDefault()
  const delta = opt.e.deltaY
  let zoom = drawCanvas.getZoom()
  zoom *= 0.999 ** delta
  if (zoom > 5) zoom = 5
  if (zoom < 0.1) zoom = 0.1
  drawCanvas.zoomToPoint(
    {
      x: opt.e.offsetX,
      y: opt.e.offsetY,
    },
    zoom,
  )
}

export const panMouseDown = (opt) => {
  // set isPanning
  return opt.e.altKey ? true : false
}

export const panMouseMove = (opt, isPanning, drawCanvas) => {
  if (!isPanning) return
  const e = opt.e
  const delta = new fabric.Point(e.movementX, e.movementY)
  drawCanvas.relativePan(delta)
}

export const panMouseUp = () => {
  // set isPanning to false
  return false
}
