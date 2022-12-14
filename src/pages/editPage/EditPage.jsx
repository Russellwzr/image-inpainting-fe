import React, { memo, useState, useRef } from 'react'
import { DRAW_TYPE, originSnapShot } from './constant'
import ToolBar from './ToolBar'
import FabricEditor from './FabricEditor'

export const FabricContext = React.createContext()

const MemoToolBar = memo(ToolBar)
const MemoFabricEditor = memo(FabricEditor)

const EditPage = () => {
  const drawCanvas = useRef(null)

  const [originImage, setOriginImage] = useState(null) // background image
  const [drawType, setDrawType] = useState(DRAW_TYPE.NORMAL)
  const [penWidth, setPenWidth] = useState(10)
  const [lassos, setLassos] = useState([]) // polygon control points
  const [activeIndex, setActiveIndex] = useState({ lassoIndex: -1, pointIndex: -1 }) // current polygon element index

  const [snapShots, setSnapShots] = useState(originSnapShot) // fabric snapshots for current inpaint
  const [snapShotsID, setSnapShotsID] = useState(0)
  const [inpaintSnapShots, setInpaintSnapShots] = useState(null) // snapshots for each inpaint
  const [inpaintSnapShotsID, setInpaintSnapShotsID] = useState(0)

  const [isLoading, setIsLoading] = useState(false) // inpaint process
  const [showOriginImage, setShowOriginImage] = useState(false)
  return (
    <FabricContext.Provider
      value={{
        drawCanvas,
        originImage,
        setOriginImage,
        drawType,
        setDrawType,
        penWidth,
        setPenWidth,
        lassos,
        setLassos,
        activeIndex,
        setActiveIndex,
        snapShots,
        setSnapShots,
        snapShotsID,
        setSnapShotsID,
        inpaintSnapShots,
        setInpaintSnapShots,
        inpaintSnapShotsID,
        setInpaintSnapShotsID,
        isLoading,
        setIsLoading,
        showOriginImage,
        setShowOriginImage,
      }}
    >
      <MemoFabricEditor />
      <MemoToolBar />
    </FabricContext.Provider>
  )
}

export default EditPage
