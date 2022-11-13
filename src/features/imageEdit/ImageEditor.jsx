import React, { useState, useRef } from 'react'
import { ToolBar, FabricEditor } from './'
import { DRAW_TYPE } from './constant'

export const FabricContext = React.createContext()

const ImageEditor = () => {
  const drawCanvas = useRef(null)
  const imageCanvas = useRef(null)
  const [drawType, setDrawType] = useState(DRAW_TYPE.NORMAL)
  const [penWidth, setPenWidth] = useState(10)
  return (
    <FabricContext.Provider
      value={{
        drawCanvas,
        imageCanvas,
        drawType,
        setDrawType,
        penWidth,
        setPenWidth,
      }}
    >
      <ToolBar />
      <FabricEditor />
    </FabricContext.Provider>
  )
}

export default ImageEditor
