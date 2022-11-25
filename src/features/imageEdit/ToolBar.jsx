import React, { useCallback, useContext, useMemo } from 'react'
import { fabric } from 'fabric'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEraser,
  faDownload,
  faEye,
  faUpload,
  faShare,
  faReply,
  faDrawPolygon,
  faHand,
  faRotate,
  faArrowLeft,
  faArrowRight,
  faCodeCompare,
} from '@fortawesome/free-solid-svg-icons'
import { FileImageOutlined } from '@ant-design/icons'
import { Slider, message } from 'antd'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE, originSnapShot } from './constant'
import { handleImageUpload, handleImageDownload, getInpaintFormData } from './fabricFunc/imageTransport'
import { viewReset } from './fabricFunc/zoomAndPan'
import {
  undoCommand,
  redoCommand,
  restoreSnapShot,
  canUndo,
  canRedo,
  storeInpaintSnapShots,
  restoreInpaintSnapShot,
} from './fabricFunc/fabricSnapShots'
import InputButton from './InputButton'
import ToolButton from './ToolButton'

export const inpaintAPI = 'http://127.0.0.1:5003/inpaint'

const ToolBar = () => {
  const {
    drawCanvas,
    originImage,
    setOriginImage,
    drawType,
    setDrawType,
    penWidth,
    setPenWidth,
    setLassos,
    setActiveIndex,
    snapShots,
    setSnapShots,
    snapShotsID,
    setSnapShotsID,
    inpaintSnapShots,
    setInpaintSnapShots,
    inpaintSnapShotsID,
    setInpaintSnapShotsID,
    setIsLoading,
    setShowOriginImage,
  } = useContext(FabricContext)

  const clearCanvas = useCallback(() => {
    const fabricObjects = drawCanvas.current.getObjects()
    for (let i = 0; i < fabricObjects.length; i++) {
      drawCanvas.current.remove(fabricObjects[i])
    }
    setLassos([])
    setActiveIndex({ lassoIndex: -1, pointIndex: -1 })
    setDrawType(DRAW_TYPE.NORMAL)
    setSnapShots(originSnapShot)
    setSnapShotsID(0)
  }, [drawCanvas, setActiveIndex, setDrawType, setLassos, setSnapShots, setSnapShotsID])

  const handleUpload = useCallback(
    (e) => {
      clearCanvas()
      setInpaintSnapShots(null)
      setInpaintSnapShotsID(0)
      handleImageUpload(e, drawCanvas.current, setOriginImage, setInpaintSnapShots)
    },
    [clearCanvas, drawCanvas, setInpaintSnapShots, setInpaintSnapShotsID, setOriginImage],
  )

  const handleDownload = useCallback(() => {
    handleImageDownload(originImage)
  }, [originImage])

  const handleInpaint = useCallback(() => {
    const formData = getInpaintFormData(drawCanvas.current, originImage)
    setIsLoading(true)
    axios
      .post(inpaintAPI, formData)
      .then((res) => {
        const inpaintImage = new Image()
        inpaintImage.crossOrigin = 'Anonymous'
        inpaintImage.src = res.data.image_url
        inpaintImage.onload = () => {
          const newImage = new fabric.Image(inpaintImage)
          clearCanvas()
          storeInpaintSnapShots(
            newImage,
            inpaintSnapShots,
            inpaintSnapShotsID,
            setInpaintSnapShots,
            setInpaintSnapShotsID,
          )
          setOriginImage(newImage)
          message.success('success')
          setIsLoading(false)
        }
      })
      .catch((err) => {
        message.error(err)
        setIsLoading(false)
      })
  }, [
    clearCanvas,
    drawCanvas,
    inpaintSnapShots,
    inpaintSnapShotsID,
    originImage,
    setInpaintSnapShots,
    setInpaintSnapShotsID,
    setIsLoading,
    setOriginImage,
  ])

  const undoDisabled = useMemo(() => {
    return !canUndo(snapShotsID)
  }, [snapShotsID])

  const executeUndo = useCallback(() => {
    if (undoDisabled) return
    const curState = undoCommand(snapShots, snapShotsID, setSnapShotsID)
    restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
  }, [drawCanvas, setActiveIndex, setDrawType, setLassos, setSnapShotsID, snapShots, snapShotsID, undoDisabled])

  const redoDisabled = useMemo(() => {
    return !canRedo(snapShots, snapShotsID)
  }, [snapShots, snapShotsID])

  const executeRedo = useCallback(() => {
    if (redoDisabled) return
    const curState = redoCommand(snapShots, snapShotsID, setSnapShotsID)
    restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
  }, [drawCanvas, redoDisabled, setActiveIndex, setDrawType, setLassos, setSnapShotsID, snapShots, snapShotsID])

  const backDisabled = useMemo(() => {
    return !canUndo(inpaintSnapShotsID)
  }, [inpaintSnapShotsID])

  const executeInpaintBack = useCallback(() => {
    if (backDisabled) return
    const curState = undoCommand(inpaintSnapShots, inpaintSnapShotsID, setInpaintSnapShotsID)
    restoreInpaintSnapShot(curState, setOriginImage)
  }, [backDisabled, inpaintSnapShots, inpaintSnapShotsID, setInpaintSnapShotsID, setOriginImage])

  const forwardDisabled = useMemo(() => {
    return !canRedo(inpaintSnapShots, inpaintSnapShotsID)
  }, [inpaintSnapShots, inpaintSnapShotsID])

  const executeInpaintForward = useCallback(() => {
    if (forwardDisabled) return
    const curState = redoCommand(inpaintSnapShots, inpaintSnapShotsID, setInpaintSnapShotsID)
    restoreInpaintSnapShot(curState, setOriginImage)
  }, [forwardDisabled, inpaintSnapShots, inpaintSnapShotsID, setInpaintSnapShotsID, setOriginImage])

  return (
    <div className="flex justify-center">
      <div>
        {/* Upload Image Box */}
        <div className={`mb-16 ${originImage === null ? `block` : `hidden`}`}>
          <InputButton
            onChange={handleUpload}
            tailWindStyle={`hover:bg-gray-200 border-gray-300 border-2 rounded-xl border-dashed bg-gray-100`}
          >
            <div className="flex flex-col space-y-24 mx-40 my-40">
              <FileImageOutlined className="text-6xl" />
              <div className="text-2xl">Upload an image from your file system</div>
            </div>
          </InputButton>
        </div>
        {/* Tool Bar */}
        <div
          className={`mt-8 px-6 py-1 space-x-4 border-gray-300 border-2 rounded-xl border-dashed ${
            originImage === null ? `hidden` : `flex`
          }`}
        >
          <InputButton
            disabledPopConfirm={false}
            tailWindStyle={`hover:bg-gray-100 px-2 py-1 rounded-lg`}
            title="upload"
            onChange={handleUpload}
          >
            <FontAwesomeIcon icon={faUpload} />
          </InputButton>

          <ToolButton onClick={handleDownload} icon={faDownload} title="download" />

          <ToolButton disabledPopConfirm={false} onClick={clearCanvas} icon={faRotate} title="clear" />

          <ToolButton onClick={executeUndo} icon={faReply} title="undo" disabled={undoDisabled} />

          <ToolButton onClick={executeRedo} icon={faShare} title="redo" disabled={redoDisabled} />

          <ToolButton onClick={() => viewReset(drawCanvas.current)} icon={faEye} title="view reset" />

          <ToolButton
            isActive={drawType === DRAW_TYPE.FREE_DRAW}
            onClick={() =>
              drawType === DRAW_TYPE.FREE_DRAW ? setDrawType(DRAW_TYPE.NORMAL) : setDrawType(DRAW_TYPE.FREE_DRAW)
            }
            icon={faEraser}
            title="eraser"
          />

          <div style={{ width: 100 }}>
            <Slider
              tooltip={{ placement: 'bottom' }}
              defaultValue={10}
              max={30}
              min={5}
              value={penWidth}
              onChange={(v) => {
                setPenWidth(v)
              }}
            />
          </div>

          <ToolButton
            isActive={drawType === DRAW_TYPE.LASSO_DRAW}
            onClick={() => {
              if (drawType === DRAW_TYPE.LASSO_DRAW) {
                setDrawType(DRAW_TYPE.NORMAL)
              } else {
                setDrawType(DRAW_TYPE.LASSO_DRAW)
                setActiveIndex({ lassoIndex: -1, pointIndex: -1 })
              }
            }}
            icon={faDrawPolygon}
            title="lasso drawing"
          />

          <ToolButton
            isActive={drawType === DRAW_TYPE.LASSO_DRAG_POINTS}
            onClick={() =>
              drawType === DRAW_TYPE.LASSO_DRAG_POINTS
                ? setDrawType(DRAW_TYPE.NORMAL)
                : setDrawType(DRAW_TYPE.LASSO_DRAG_POINTS)
            }
            icon={faHand}
            title="lasso dragging"
          />

          <ToolButton onClick={executeInpaintBack} icon={faArrowLeft} title="image back" disabled={backDisabled} />

          <ToolButton
            onClick={executeInpaintForward}
            icon={faArrowRight}
            title="image forward"
            disabled={forwardDisabled}
          />

          <ToolButton
            onMouseDown={() => {
              setShowOriginImage(true)
            }}
            onMouseUp={() => {
              setShowOriginImage(false)
            }}
            icon={faCodeCompare}
            title="image comparision"
            disabled={backDisabled}
          />

          <button onClick={handleInpaint}>Inpaint</button>
        </div>
      </div>
    </div>
  )
}

export default ToolBar
