import _ from 'lodash'

const MAX_SNAPSHOTS = 1000
const MAX_INPAINT_SNAPSHOTS = 20

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
  if (newSnapShots.length > MAX_SNAPSHOTS) {
    newSnapShots.shift()
    snapShotID -= 1
  }
  setSnapShots(newSnapShots)
  setSnapShotsID(snapShotID)
}

export const storeInpaintSnapShots = (
  originImage,
  inpaintSnapShots,
  inpaintSnapShotsID,
  setInpaintSnapShots,
  setInpaintSnapShotsID,
) => {
  let newInpaintSnapShots = [...inpaintSnapShots]
  while (inpaintSnapShotsID < newInpaintSnapShots.length - 1) {
    newInpaintSnapShots.pop()
  }
  newInpaintSnapShots.push({
    originImage: _.cloneDeep(originImage),
  })
  inpaintSnapShotsID += 1
  if (newInpaintSnapShots.length > MAX_INPAINT_SNAPSHOTS) {
    newInpaintSnapShots.shift()
    inpaintSnapShotsID -= 1
  }
  setInpaintSnapShots(newInpaintSnapShots)
  setInpaintSnapShotsID(inpaintSnapShotsID)
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

export const restoreInpaintSnapShot = (snapShot, setOriginImage) => {
  const { originImage } = snapShot
  setOriginImage(originImage)
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
  if (snapShots === null) return false
  return snapShots?.length > 0 && snapShotID < snapShots?.length - 1
}
