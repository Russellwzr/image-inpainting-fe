import { fabric } from 'fabric'
import React, { useRef, useContext, useEffect, useCallback } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { FabricContext } from './EditPage'
import { DRAW_TYPE } from './constant'
import { zoomInAndOut, panMouseDown, panMouseMove, panMouseUp } from './fabricFunc/zoomAndPan'
import {
  lassoMouseDown,
  lassoDragMouseDown,
  lassoDragMouseMove,
  lassoDragMouseUp,
  clearAllControlPoints,
  drawAllControlPoints,
  updateFabricCanvas,
} from './fabricFunc/lassoInteraction'
import { getCurState, storeSnapShots } from './fabricFunc/fabricSnapShots'
import './style.css'

const FabricEditor = () => {
  const {
    drawCanvas,
    drawType,
    penWidth,
    originImage,
    lassos,
    setLassos,
    activeIndex,
    setActiveIndex,
    snapShots,
    setSnapShots,
    snapShotsID,
    setSnapShotsID,
    isLoading,
    showOriginImage,
    inpaintSnapShots,
    inpaintSnapShotsID,
  } = useContext(FabricContext)

  const isPanning = useRef(false) // panning flag

  const addStateToSnapShots = useCallback(() => {
    const curState = getCurState(drawCanvas.current.getObjects(), lassos, activeIndex, drawType)
    storeSnapShots(snapShots, snapShotsID, curState, setSnapShots, setSnapShotsID)
  }, [activeIndex, drawCanvas, drawType, lassos, setSnapShots, setSnapShotsID, snapShots, snapShotsID])

  const mouseDown = useCallback(
    (opt) => {
      const p = opt.absolutePointer
      switch (drawType) {
        case DRAW_TYPE.FREE_DRAW: {
          break
        }
        case DRAW_TYPE.LASSO_DRAW: {
          // add a new control point
          const { newLassos, newActiveIndex } = lassoMouseDown(p, lassos, activeIndex)
          setLassos(newLassos)
          setActiveIndex(newActiveIndex)
          break
        }
        case DRAW_TYPE.LASSO_DRAG_POINTS: {
          // search drag point
          const newActiveIndex = lassoDragMouseDown(p, lassos)
          setActiveIndex(newActiveIndex)
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
    [activeIndex, drawType, lassos, setActiveIndex, setLassos],
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
          // update control point location
          const newLassos = lassoDragMouseMove(opt.absolutePointer, lassos, activeIndex)
          setLassos(newLassos)
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
    [activeIndex, drawCanvas, drawType, lassos, setLassos],
  )

  const mouseUp = useCallback(() => {
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        addStateToSnapShots()
        break
      }
      case DRAW_TYPE.LASSO_DRAW: {
        addStateToSnapShots()
        break
      }
      case DRAW_TYPE.LASSO_DRAG_POINTS: {
        if (activeIndex.pointIndex !== -1) {
          addStateToSnapShots()
        }
        const newActiveIndex = lassoDragMouseUp()
        setActiveIndex(newActiveIndex)
        break
      }
      case DRAW_TYPE.NORMAL: {
        isPanning.current = panMouseUp()
        break
      }
      default:
        break
    }
  }, [activeIndex, addStateToSnapShots, drawType, setActiveIndex])

  // init fabric canvas
  useEffect(() => {
    drawCanvas.current = new fabric.Canvas('image-container')
    drawCanvas.current.selection = false
    drawCanvas.current.skipTargetFind = true
    drawCanvas.current.freeDrawingBrush.color = 'rgba(255, 255, 255, 0.9)'
    drawCanvas.current.freeDrawingBrush.limitedToCanvasSize = true
    return () => {
      drawCanvas.current.dispose()
    }
  }, [drawCanvas])

  // init after switch interaction mode
  useEffect(() => {
    clearAllControlPoints(drawCanvas.current)
    switch (drawType) {
      case DRAW_TYPE.FREE_DRAW: {
        drawCanvas.current.isDrawingMode = true
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
  }, [drawCanvas, drawType, setActiveIndex])

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

  // update pen width
  useEffect(() => {
    drawCanvas.current.freeDrawingBrush.width = penWidth
  }, [drawCanvas, penWidth])

  useEffect(() => {
    if (originImage === null) return
    drawCanvas.current.setBackgroundImage(originImage, drawCanvas.current.renderAll.bind(drawCanvas.current))
  }, [drawCanvas, originImage])

  // draw control points for LASSO_DRAG_POINTS
  useEffect(() => {
    if (drawType === DRAW_TYPE.LASSO_DRAG_POINTS) {
      drawAllControlPoints(drawCanvas.current, lassos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawCanvas, drawType])

  // update fabric canvas drawing
  useEffect(() => {
    updateFabricCanvas(drawCanvas.current, lassos, activeIndex)
  }, [lassos, activeIndex, drawCanvas])

  return (
    <div className="flex justify-center mt-10">
      <div
        className={`${
          originImage === null ? `hidden` : `flex`
        } border-gray-300 border-2 rounded-xl border-dashed relative`}
      >
        <div className={`${showOriginImage ? `max-h-full` : `max-h-0`} origin-img-box rounded-xl`}>
          <img
            src={
              inpaintSnapShotsID > 0
                ? inpaintSnapShots[inpaintSnapShotsID - 1].originImage.toDataURL({ format: 'image/jpeg' })
                : null
            }
          />
        </div>
        <Spin
          spinning={isLoading}
          tip={<span className="mt-8 text-2xl">Processing...</span>}
          size="large"
          indicator={<LoadingOutlined className="text-5xl" spin />}
        >
          <canvas id="image-container" className="rounded-xl"></canvas>
        </Spin>
      </div>
    </div>
  )
}

export default FabricEditor
