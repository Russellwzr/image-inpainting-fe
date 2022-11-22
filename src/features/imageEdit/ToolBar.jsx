import React, { useCallback, useContext } from 'react'
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
} from '@fortawesome/free-solid-svg-icons'
import { FileImageOutlined } from '@ant-design/icons'
import { Slider } from 'antd'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE } from './constant'
import { handleImageUpload, handleImageDownload } from './fabricFunc/imageTransport'
import { viewReset } from './fabricFunc/zoomAndPan'
import { undoCommand, redoCommand, restoreSnapShot, canUndo, canRedo } from './fabricFunc/fabricSnapShots'
import InputButton from './InputButton'
import ToolButton from './ToolButton'

const ToolBar = () => {
  const {
    drawCanvas,
    imageCanvas,
    drawType,
    setDrawType,
    penWidth,
    setPenWidth,
    hasImage,
    setHasImage,
    setLassos,
    setActiveIndex,
    snapShots,
    snapShotsID,
    setSnapShotsID,
  } = useContext(FabricContext)

  const handleUpload = useCallback(
    (e) => {
      handleImageUpload(e, drawCanvas, imageCanvas, setHasImage)
    },
    [drawCanvas, imageCanvas, setHasImage],
  )

  const handleDownload = useCallback(() => {
    handleImageDownload(drawCanvas)
  }, [drawCanvas])

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
          <InputButton tailWindStyle={`hover:bg-gray-100 px-2 py-1 rounded-lg`} onChange={handleUpload}>
            <FontAwesomeIcon icon={faUpload} />
          </InputButton>
          <ToolButton onClick={handleDownload} icon={faDownload} />
          <ToolButton
            onClick={() => {
              if (!canUndo(snapShotsID)) return
              const curState = undoCommand(snapShots, snapShotsID, setSnapShotsID)
              restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
            }}
            icon={faReply}
            disabled={!canUndo(snapShotsID)}
          />
          <ToolButton
            onClick={() => {
              if (!canRedo(snapShots, snapShotsID)) return
              const curState = redoCommand(snapShots, snapShotsID, setSnapShotsID)
              restoreSnapShot(curState, drawCanvas.current, setLassos, setActiveIndex, setDrawType)
            }}
            icon={faShare}
            disabled={!canRedo(snapShots, snapShotsID)}
          />
          <ToolButton
            isActive={drawType === DRAW_TYPE.FREE_DRAW}
            onClick={() =>
              drawType === DRAW_TYPE.FREE_DRAW ? setDrawType(DRAW_TYPE.NORMAL) : setDrawType(DRAW_TYPE.FREE_DRAW)
            }
            icon={faEraser}
          />
          <div style={{ width: 100 }}>
            <Slider
              tooltip={(value) => value}
              defaultValue={10}
              max={30}
              min={5}
              value={penWidth}
              onChange={(v) => {
                setPenWidth(v)
              }}
            />
          </div>
          <ToolButton onClick={() => viewReset(drawCanvas.current)} icon={faEye} />
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
          />
          <ToolButton
            isActive={drawType === DRAW_TYPE.LASSO_DRAG_POINTS}
            onClick={() =>
              drawType === DRAW_TYPE.LASSO_DRAG_POINTS
                ? setDrawType(DRAW_TYPE.NORMAL)
                : setDrawType(DRAW_TYPE.LASSO_DRAG_POINTS)
            }
            icon={faHand}
          />
        </div>
      </div>
    </div>
  )
}

export default ToolBar
