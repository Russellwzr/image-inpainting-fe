import _ from 'lodash'

export const getCurState = (fabricObjects, lassos, activeIndex, drawType) => {
  let freeDraw = []
  for (let i = 0; i < fabricObjects.length; i++) {
    const curElement = fabricObjects[i]
    if (!curElement?.lassoIndex >= 0) {
      freeDraw.push(_.cloneDeep(curElement))
    }
  }
  return {
    lassos: _.cloneDeep(lassos),
    activeIndex: _.cloneDeep(activeIndex),
    freeDraw: freeDraw,
    drawType: drawType,
  }
}

export const storeSnapShots = (snapShots, snapShotID, curState, setSnapShots, setSnapShotsID) => {
  let newSnapShots = [...snapShots]
  while (snapShotID < newSnapShots.length - 1) {
    newSnapShots.pop()
  }
  newSnapShots.push(curState)
  snapShotID += 1
  setSnapShots(newSnapShots)
  setSnapShotsID(snapShotID)
}

export const restoreSnapShot = (snapShot, drawCanvas, setLassos, setActiveIndex, setDrawType) => {
  const { lassos, activeIndex, freeDraw, drawType } = snapShot
  const fabricObjects = drawCanvas.getObjects()
  for (let i = 0; i < fabricObjects.length; i++) {
    drawCanvas.remove(fabricObjects[i])
  }
  for (let i = 0; i < freeDraw.length; i++) {
    drawCanvas.add(freeDraw[i])
  }
  setLassos(lassos)
  setActiveIndex(activeIndex)
  setDrawType(drawType)
}

export const undoCommand = (snapShots, snapShotID, setSnapShotsID) => {
  snapShotID -= 1
  setSnapShotsID(snapShotID)
  return snapShots[snapShotID]
}

export const redoCommand = (snapShots, snapShotID, setSnapShotsID) => {
  snapShotID += 1
  setSnapShotsID(snapShotID)
  return snapShots[snapShotID]
}

export const canUndo = (snapShotID) => {
  return snapShotID > 0
}

export const canRedo = (snapShots, snapShotID) => {
  return snapShots.length > 0 && snapShotID < snapShots.length - 1
}
