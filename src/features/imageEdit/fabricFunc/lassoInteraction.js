import { fabric } from 'fabric'

const RADIUS = 5

const CIRCLE_TYPE = 'lasso-circle'
const POLYGON_TYPE = 'lasso-polygon'

const calCurve = (points, tension = 0.5, numOfSeg = 20, close = true) => {
  // Modified from https://github.com/gdenisov/cardinal-spline-js

  // options or defaults
  tension = typeof tension === 'number' ? tension : 0.5
  numOfSeg = numOfSeg ? numOfSeg : 20

  var pts, // clone point array
    res = [],
    l = points.length,
    i,
    cache = new Float32Array((numOfSeg + 2) * 4),
    cachePtr = 4

  pts = points.slice(0)

  if (close) {
    pts.unshift(points[l - 1]) // insert end point as first point
    pts.unshift(points[l - 2])
    pts.push(points[0], points[1]) // first point as last point
  } else {
    pts.unshift(points[1]) // copy 1. point and insert at beginning
    pts.unshift(points[0])
    pts.push(points[l - 2], points[l - 1]) // duplicate end-points
  }

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1

  for (i = 1; i < numOfSeg; i++) {
    var st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3

    cache[cachePtr++] = st23 - st32 + 1 // c1
    cache[cachePtr++] = st32 - st23 // c2
    cache[cachePtr++] = st3 - 2 * st2 + st // c3
    cache[cachePtr++] = st3 - st2 // c4
  }

  cache[++cachePtr] = 1

  // calc. points
  parse(pts, cache, l)

  if (close) {
    //l = points.length;
    pts = []
    pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]) // second last and last
    pts.push(points[0], points[1], points[2], points[3]) // first and second
    parse(pts, cache, 4)
  }

  function parse(pts, cache, l) {
    for (var i = 2; i < l; i += 2) {
      var pt1 = pts[i],
        pt2 = pts[i + 1],
        pt3 = pts[i + 2],
        pt4 = pts[i + 3],
        t1x = (pt3 - pts[i - 2]) * tension,
        t1y = (pt4 - pts[i - 1]) * tension,
        t2x = (pts[i + 4] - pt1) * tension,
        t2y = (pts[i + 5] - pt2) * tension

      for (var t = 0; t <= numOfSeg; t++) {
        var c = t * 4

        res.push(
          cache[c] * pt1 + cache[c + 1] * pt3 + cache[c + 2] * t1x + cache[c + 3] * t2x,
          cache[c] * pt2 + cache[c + 1] * pt4 + cache[c + 2] * t1y + cache[c + 3] * t2y,
        )
      }
    }
  }

  return res
}

const pointsObjToArray = (points) => {
  let flattenPoints = []
  for (let i = 0; i < points.length; i++) {
    flattenPoints.push(points[i].x)
    flattenPoints.push(points[i].y)
  }
  return flattenPoints
}

const pointsArrayToObj = (points) => {
  let curvePoints = []
  for (let i = 0; i <= points.length - 2; i += 2) {
    curvePoints.push({ x: points[i], y: points[i + 1] })
  }
  return curvePoints
}

// clear previous lassos[activeIndex.lassoIndex]
const clearPreviousElements = (drawCanvas, curIndex) => {
  const fabricObjects = drawCanvas.getObjects()
  for (let i = 0; i < fabricObjects.length; i++) {
    const curElement = fabricObjects[i]
    if (curElement?.lassoIndex === curIndex) drawCanvas.remove(curElement)
  }
}

// draw control points for lassos[activeIndex.lassoIndex]
const drawControlPoints = (drawCanvas, lassos, curIndex) => {
  for (let i = 0; i < lassos[curIndex].length; i++) {
    const circle = new fabric.Circle({
      top: lassos[curIndex][i].y - RADIUS,
      left: lassos[curIndex][i].x - RADIUS,
      radius: RADIUS,
      fill: 'red',
      selectable: false,
      lassoIndex: curIndex,
      elementType: CIRCLE_TYPE,
    })
    drawCanvas.add(circle)
  }
}

// draw contour for lassos[activeIndex.lassoIndex]
const drawContour = (drawCanvas, lassos, curIndex) => {
  const points = lassos[curIndex]
  if (points.length < 2) return
  const newPoints = calCurve(pointsObjToArray(points))
  const curvePoints = pointsArrayToObj(newPoints)
  const polygon = new fabric.Polyline(curvePoints, {
    fill: 'white',
    selectable: false,
    lassoIndex: curIndex,
    elementType: POLYGON_TYPE,
  })
  drawCanvas.add(polygon)
}

// update lassos[activeIndex.lassoIndex]
export const updateFabricCanvas = (drawCanvas, lassos, activeIndex) => {
  if (activeIndex.lassoIndex === -1) return
  clearPreviousElements(drawCanvas, activeIndex.lassoIndex)
  drawContour(drawCanvas, lassos, activeIndex.lassoIndex)
  drawControlPoints(drawCanvas, lassos, activeIndex.lassoIndex)
}

export const clearAllControlPoints = (drawCanvas) => {
  const fabricObjects = drawCanvas.getObjects()
  for (let i = 0; i < fabricObjects.length; i++) {
    const curElement = fabricObjects[i]
    if (curElement?.elementType === CIRCLE_TYPE) drawCanvas.remove(curElement)
  }
}

export const drawAllControlPoints = (drawCanvas, lassos) => {
  for (let i = 0; i < lassos.length; i++) {
    drawControlPoints(drawCanvas, lassos, i)
  }
}

export const lassoMouseDown = (p, lassos, activeIndex) => {
  let curIndex = activeIndex.lassoIndex
  let newLassos = [...lassos]
  if (curIndex === -1) {
    curIndex = lassos.length
    newLassos.push([])
  }
  newLassos[curIndex].push({
    x: p.x,
    y: p.y,
  })
  return { newLassos: newLassos, newActiveIndex: { ...activeIndex, lassoIndex: curIndex } }
}

export const lassoDragMouseDown = (p, lassos) => {
  let activeIndex = { lassoIndex: -1, pointIndex: -1 }
  for (let i = 0; i < lassos.length; i++) {
    for (let j = 0; j < lassos[i].length; j++) {
      const x = lassos[i][j].x
      const y = lassos[i][j].y
      const dx = p.x - x
      const dy = p.y - y
      if (dx * dx + dy * dy <= RADIUS * RADIUS + 10) {
        activeIndex.lassoIndex = i
        activeIndex.pointIndex = j
        break
      }
    }
  }
  return activeIndex
}

export const lassoDragMouseMove = (p, lassos, activeIndex) => {
  if (activeIndex.lassoIndex === -1) return lassos
  let newLassos = [...lassos]
  newLassos[activeIndex.lassoIndex][activeIndex.pointIndex].x = p.x
  newLassos[activeIndex.lassoIndex][activeIndex.pointIndex].y = p.y
  return newLassos
}

export const lassoDragMouseUp = () => {
  return { lassoIndex: -1, pointIndex: -1 }
}
