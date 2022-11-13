/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useCallback, useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEraser,
  faRotateLeft,
  faRotateRight,
  faDownload,
  faUpload,
  faEye,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
} from '@fortawesome/free-solid-svg-icons'
import { Slider } from 'antd'
import { FabricContext } from './ImageEditor'
import { DRAW_TYPE } from './constant'
import { handleImageUpload, handleImageDownload } from './fabricFunc/imageTransport'

const ToolBar = () => {
  const { drawCanvas, imageCanvas, drawType, setDrawType, penWidth, setPenWidth } = useContext(FabricContext)

  const handleUpload = useCallback(
    (e) => {
      handleImageUpload(e, drawCanvas, imageCanvas)
    },
    [drawCanvas, imageCanvas],
  )

  const handleDownload = useCallback(() => {
    handleImageDownload(drawCanvas)
  }, [drawCanvas])

  return (
    <div className="flex flex-row space-x-6">
      {/*       <button>
        <FontAwesomeIcon icon={faRotateLeft} />
      </button>
      <button>
        <FontAwesomeIcon icon={faRotateRight} />
      </button> */}
      {/*       <button>
        <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
      </button>
      <button>
        <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
      </button> */}
      <div>
        <input id="input-image" type="file" accept="image/*" onChange={handleUpload} />
        <FontAwesomeIcon icon={faUpload} />
      </div>
      <button onClick={handleDownload}>
        <FontAwesomeIcon icon={faDownload} />
      </button>
      <button
        onClick={() =>
          drawType === DRAW_TYPE.FREE_DRAW ? setDrawType(DRAW_TYPE.NORMAL) : setDrawType(DRAW_TYPE.FREE_DRAW)
        }
      >
        <FontAwesomeIcon icon={faEraser} />
      </button>
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
      <button>
        <FontAwesomeIcon icon={faEye} />
      </button>
      <button
        onClick={() =>
          drawType === DRAW_TYPE.LASSO_DRAW ? setDrawType(DRAW_TYPE.NORMAL) : setDrawType(DRAW_TYPE.LASSO_DRAW)
        }
      >
        Lasso
      </button>
      <button
        onClick={() =>
          drawType === DRAW_TYPE.LASSO_DRAG_POINTS
            ? setDrawType(DRAW_TYPE.NORMAL)
            : setDrawType(DRAW_TYPE.LASSO_DRAG_POINTS)
        }
      >
        Lasso Drag
      </button>
    </div>
  )
}

export default ToolBar
