/* eslint-disable react/prop-types */
import { fabric } from 'fabric'
import React, { useRef, useContext, useEffect } from 'react'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE } from './constant'
import { zoomInAndOut, panMouseDown, panMouseMove, panMouseUp } from './fabricFunc/zoomAndPan'
import { lassoMouseDown, lassoDragMouseDown, lassoDragMouseMove, lassoDragMouseUp } from './fabricFunc/lassoInteraction'

const FabricEditor = () => {
  const { drawCanvas, imageCanvas, drawType, penWidth } = useContext(FabricContext)

  // lasso.points: polygon control points
  // lasso.circles: fabric circle element for lass control points
  // lasso.polygons: fabric polygon elements for lasso
  const lassos = useRef({})
  const activeIndex = useRef({ lassoIndex: -1, pointIndex: -1 }) // current polygon element index
  const nextIndex = useRef(0) // map key for next polygon
  const isPanning = useRef(false) // panning flag

  const mouseDown = (opt) => {
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
  }

  const mouseMove = (opt) => {
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
  }

  const mouseUp = () => {
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        break
      }
      case DRAW_TYPE.LASSO_DRAW: {
        break
      }
      case DRAW_TYPE.LASSO_DRAG_POINTS: {
        lassoDragMouseUp(activeIndex)
        break
      }
      case DRAW_TYPE.NORMAL: {
        isPanning.current = panMouseUp()
        break
      }
      default:
        break
    }
  }

  // init fabric canvas
  useEffect(() => {
    drawCanvas.current = new fabric.Canvas('image-container')
    // drawCanvas.current.setZoom(1)
    // drawCanvas.current.absolutePan({ x: 0, y: 0 })
    drawCanvas.current.on('mouse:wheel', (opt) => zoomInAndOut(opt, drawCanvas.current))
    drawCanvas.current.on('mouse:down', mouseDown)
    drawCanvas.current.on('mouse:move', mouseMove)
    drawCanvas.current.on('mouse:up', mouseUp)
    return () => {
      drawCanvas.current.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // update fabric canvas attributes
  useEffect(() => {
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        drawCanvas.current.isDrawingMode = true
        drawCanvas.current.freeDrawingBrush.color = 'white'
        drawCanvas.current.freeDrawingBrush.limitedToCanvasSize = true
        break
      }
      case DRAW_TYPE.LASSO_DRAW: {
        drawCanvas.current.isDrawingMode = false
        break
      }
      case DRAW_TYPE.LASSO_DRAG_POINTS: {
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

  useEffect(() => {
    drawCanvas.current.freeDrawingBrush.width = penWidth
  }, [drawCanvas, penWidth])

  useEffect(() => {
    drawCanvas.current.on('mouse:wheel', (opt) => zoomInAndOut(opt, drawCanvas.current))
    drawCanvas.current.on('mouse:down', mouseDown)
    drawCanvas.current.on('mouse:move', mouseMove)
    drawCanvas.current.on('mouse:up', mouseUp)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawCanvas, drawType])

  return (
    <div>
      <canvas ref={imageCanvas} id="image-container" style={{ border: '1px solid #ccc' }}></canvas>
    </div>
  )
}

export default FabricEditor
