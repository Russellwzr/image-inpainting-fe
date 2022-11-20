import { fabric } from 'fabric'
import React, { useRef, useContext, useEffect, useCallback } from 'react'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE } from './constant'
import { zoomInAndOut, panMouseDown, panMouseMove, panMouseUp } from './fabricFunc/zoomAndPan'
import {
  lassoMouseDown,
  lassoDragMouseDown,
  lassoDragMouseMove,
  lassoDragMouseUp,
  clearAllControlPoints,
  drawAllControlPoints,
} from './fabricFunc/lassoInteraction'

const FabricEditor = () => {
  const { drawCanvas, imageCanvas, drawType, penWidth, hasImage } = useContext(FabricContext)

  // lasso.points: polygon control points
  // lasso.circles: fabric circle element for lass control points
  // lasso.polygons: fabric polygon elements for lasso
  const lassos = useRef({})
  const activeIndex = useRef({ lassoIndex: -1, pointIndex: -1 }) // current polygon element index
  const nextIndex = useRef(0) // map key for next polygon
  const isPanning = useRef(false) // panning flag

  const mouseDown = useCallback(
    (opt) => {
      const p = opt.absolutePointer
      switch (drawType) {
        case DRAW_TYPE.FREE_DRAW: {
          break
        }
        case DRAW_TYPE.LASSO_DRAW: {
          lassoMouseDown(p, drawCanvas.current, lassos.current, nextIndex.current)
          break
        }
        case DRAW_TYPE.LASSO_DRAG_POINTS: {
          lassoDragMouseDown(p, lassos.current, activeIndex.current)
          break
        }
        case DRAW_TYPE.NORMAL: {
          isPanning.current = panMouseDown(opt)
          break
        }
        default:
          break
      }
    },
    [drawCanvas, drawType],
  )

  const mouseMove = useCallback(
    (opt) => {
      switch (drawType) {
        case DRAW_TYPE.FREE_DRAW: {
          break
        }
        case DRAW_TYPE.LASSO_DRAW: {
          break
        }
        case DRAW_TYPE.LASSO_DRAG_POINTS: {
          lassoDragMouseMove(opt.absolutePointer, lassos.current, activeIndex.current, drawCanvas.current)
          break
        }
        case DRAW_TYPE.NORMAL: {
          panMouseMove(opt, isPanning.current, drawCanvas.current)
          break
        }
        default:
          break
      }
    },
    [drawCanvas, drawType],
  )

  const mouseUp = useCallback(() => {
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        break
      }
      case DRAW_TYPE.LASSO_DRAW: {
        break
      }
      case DRAW_TYPE.LASSO_DRAG_POINTS: {
        lassoDragMouseUp(activeIndex.current)
        break
      }
      case DRAW_TYPE.NORMAL: {
        isPanning.current = panMouseUp()
        break
      }
      default:
        break
    }
  }, [drawType])

  // init fabric canvas
  useEffect(() => {
    drawCanvas.current = new fabric.Canvas('image-container')
    return () => {
      drawCanvas.current.dispose()
    }
  }, [drawCanvas])

  // update fabric canvas attributes
  useEffect(() => {
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        drawCanvas.current.selection = false
        drawCanvas.current.skipTargetFind = true
        drawCanvas.current.isDrawingMode = true
        drawCanvas.current.freeDrawingBrush.color = 'white'
        drawCanvas.current.freeDrawingBrush.limitedToCanvasSize = true
        break
      }
      case DRAW_TYPE.LASSO_DRAW: {
        drawCanvas.current.selection = false
        drawCanvas.current.skipTargetFind = true
        drawCanvas.current.isDrawingMode = false
        break
      }
      case DRAW_TYPE.LASSO_DRAG_POINTS: {
        drawCanvas.current.selection = false
        drawCanvas.current.skipTargetFind = true
        drawCanvas.current.isDrawingMode = false
        break
      }
      case DRAW_TYPE.NORMAL: {
        drawCanvas.current.isDrawingMode = false
        break
      }
      default:
        break
    }
  }, [drawCanvas, drawType])

  // update pen width
  useEffect(() => {
    drawCanvas.current.freeDrawingBrush.width = penWidth
  }, [drawCanvas, penWidth])

  // update control points
  useEffect(() => {
    if (drawType === DRAW_TYPE.LASSO_DRAG_POINTS) {
      clearAllControlPoints(drawCanvas.current, lassos.current)
      drawAllControlPoints(drawCanvas.current, lassos.current)
    } else clearAllControlPoints(drawCanvas.current, lassos.current)
  }, [drawCanvas, drawType])

  // update events
  useEffect(() => {
    drawCanvas.current.off('mouse:wheel')
    drawCanvas.current.off('mouse:down')
    drawCanvas.current.off('mouse:move')
    drawCanvas.current.off('mouse:up')
    drawCanvas.current.on('mouse:wheel', (opt) => zoomInAndOut(opt, drawCanvas.current))
    drawCanvas.current.on('mouse:down', mouseDown)
    drawCanvas.current.on('mouse:move', mouseMove)
    drawCanvas.current.on('mouse:up', mouseUp)
  }, [drawCanvas, drawType, mouseDown, mouseMove, mouseUp])

  return (
    <div className="flex justify-center mt-10">
      <div className={`${hasImage ? `flex` : `hidden`}`}>
        <canvas
          ref={imageCanvas}
          id="image-container"
          className="border-gray-300 border-2 rounded-xl border-dashed"
        ></canvas>
      </div>
    </div>
  )
}

export default FabricEditor
