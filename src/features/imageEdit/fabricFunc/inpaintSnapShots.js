import _ from 'lodash'

const MAX_INPAINT_SNAPSHOTS = 20

export const storeInpaintSnapShots = (
  originImage,
  snapShots,
  snapShotsID,
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
    snapShots: _.cloneDeep(snapShots),
    snapShotsID: snapShotsID,
  })
  inpaintSnapShotsID += 1
  if (newInpaintSnapShots.length > MAX_INPAINT_SNAPSHOTS) {
    newInpaintSnapShots.shift()
    inpaintSnapShotsID -= 1
  }
  setInpaintSnapShots(newInpaintSnapShots)
  setInpaintSnapShotsID(setInpaintSnapShotsID)
}

export const backToPreviousInpaint = (snapShots, snapShotID, setSnapShotsID) => {
  const snapShot = snapShots[snapShotID]
  snapShotID -= 1
  setSnapShotsID(snapShotID)
  return snapShot
}

export const canBack = (snapShotID) => {
  return snapShotID >= 0
}
