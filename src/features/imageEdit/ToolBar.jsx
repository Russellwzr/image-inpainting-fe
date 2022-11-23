/* eslint-disable no-unused-vars */
import React, { useCallback, useContext } from 'react'
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
} from '@fortawesome/free-solid-svg-icons'
import { FileImageOutlined } from '@ant-design/icons'
import { Slider, message } from 'antd'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE, server_url } from './constant'
import { handleImageUpload, handleImageDownload, getInpaintFormData } from './fabricFunc/imageTransport'
import { viewReset } from './fabricFunc/zoomAndPan'
import { undoCommand, redoCommand, restoreSnapShot, canUndo, canRedo } from './fabricFunc/fabricSnapShots'
import InputButton from './InputButton'
import ToolButton from './ToolButton'

const ToolBar = () => {
  const {
    drawCanvas,
    originImage,
    setOriginImage,
    inpaintImage,
    setInpaintImage,
    drawType,
    setDrawType,
    penWidth,
    setPenWidth,
    hasImage,
    setHasImage,
    setLassos,
    setActiveIndex,
    snapShots,
    setSnapShots,
    snapShotsID,
    setSnapShotsID,
    setIsLoading,
  } = useContext(FabricContext)

  const handleUpload = useCallback(
    (e) => {
      handleImageUpload(e, drawCanvas.current, setOriginImage, setHasImage)
    },
    [drawCanvas, setHasImage, setOriginImage],
  )

  const handleDownload = useCallback(() => {
    handleImageDownload(inpaintImage)
  }, [inpaintImage])

  const clearCanvas = useCallback(() => {
    const fabricObjects = drawCanvas.current.getObjects()
    for (let i = 0; i < fabricObjects.length; i++) {
      drawCanvas.current.remove(fabricObjects[i])
    }
    setLassos([])
    setActiveIndex({ lassoIndex: -1, pointIndex: -1 })
    setDrawType(DRAW_TYPE.NORMAL)
    setSnapShots([
      { lassos: [], activeIndex: { lassoIndex: -1, pointIndex: -1 }, freeDraw: [], drawType: DRAW_TYPE.NORMAL },
    ])
    setSnapShotsID(0)
  }, [drawCanvas, setActiveIndex, setDrawType, setLassos, setSnapShots, setSnapShotsID])

  const handleInpaint = useCallback(() => {
    const formData = getInpaintFormData(drawCanvas.current, originImage)
    setIsLoading(true)
    axios
      .post(server_url + '/inpaint', formData)
      .then((res) => {
        const inpaintUrl = res.data.image_url
        fabric.Image.fromURL(inpaintUrl, (img) => {
          drawCanvas.current.setBackgroundImage(img, drawCanvas.current.renderAll.bind(drawCanvas.current))
          setInpaintImage(img)
        })
        message.success('success')
        setIsLoading(false)
      })
      .catch((err) => {
        message.error(err)
        setIsLoading(false)
      })
  }, [drawCanvas, originImage, setInpaintImage, setIsLoading])

  return (
    <div className="flex justify-center">
      <div>
        {/* Upload Image Box */}
        <div className={`mb-16 ${!hasImage ? `block` : `hidden`}`}>
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
            hasImage ? `flex` : `hidden`
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

          <ToolButton
            onClick={() => {
              if (!canUndo(snapShotsID)) return
              const curState = undoCommand(snapShots, snapShotsID, setSnapShotsID)
              restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
            }}
            icon={faReply}
            title="undo"
            disabled={!canUndo(snapShotsID)}
          />

          <ToolButton
            onClick={() => {
              if (!canRedo(snapShots, snapShotsID)) return
              const curState = redoCommand(snapShots, snapShotsID, setSnapShotsID)
              restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
            }}
            icon={faShare}
            title="redo"
            disabled={!canRedo(snapShots, snapShotsID)}
          />

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

          <button onClick={handleInpaint}>Inpaint</button>
        </div>
      </div>
    </div>
  )
}

export default ToolBar
