import React, { useState, useRef } from 'react'
import { ToolBar, FabricEditor } from './'
import { DRAW_TYPE } from './constant'

export const FabricContext = React.createContext()

const ImageEditor = () => {
  const drawCanvas = useRef(null)
  const [originImage, setOriginImage] = useState(null)
  const [inpaintImage, setInpaintImage] = useState(null)
  const [lassos, setLassos] = useState([]) // polygon control points
  const [activeIndex, setActiveIndex] = useState({ lassoIndex: -1, pointIndex: -1 }) // current polygon element index
  const [hasImage, setHasImage] = useState(false)
  const [drawType, setDrawType] = useState(DRAW_TYPE.NORMAL)
  const [penWidth, setPenWidth] = useState(10)
  // lassos, activeIndex, drawType
  const [snapShots, setSnapShots] = useState([
    { lassos: [], activeIndex: { lassoIndex: -1, pointIndex: -1 }, freeDraw: [], drawType: DRAW_TYPE.NORMAL },
  ])
  const [snapShotsID, setSnapShotsID] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  return (
    <FabricContext.Provider
      value={{
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
        lassos,
        setLassos,
        activeIndex,
        setActiveIndex,
        snapShots,
        setSnapShots,
        snapShotsID,
        setSnapShotsID,
        isLoading,
        setIsLoading,
      }}
    >
      <FabricEditor />
      <ToolBar />
    </FabricContext.Provider>
  )
}

export default ImageEditor
