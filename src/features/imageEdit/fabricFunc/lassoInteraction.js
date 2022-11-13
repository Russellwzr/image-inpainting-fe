import { fabric } from 'fabric'

const RADIUS = 5

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

const drawControlPoints = (drawCanvas, lassos, curIndex) => {
  // delete previous points
  for (let i = 0; i < lassos[curIndex].circles.length; i++) {
    drawCanvas.remove(lassos[curIndex].circles[i])
  }
  // re-add points
  lassos[curIndex].circles = []
  for (let i = 0; i < lassos[curIndex].points.length; i++) {
    const circle = new fabric.Circle({
      top: lassos[curIndex].points[i].y,
      left: lassos[curIndex].points[i].x,
      radius: RADIUS,
      fill: 'red',
      stroke: 'red',
      selectable: false,
    })
    lassos[curIndex].circles.push(circle)
    drawCanvas.add(circle)
  }
}

const drawContour = (drawCanvas, lassos, curIndex) => {
  const points = lassos[curIndex].points
  if (points.length < 2) return
  const newPoints = calCurve(pointsObjToArray(points))
  const curvePoints = pointsArrayToObj(newPoints)
  console.log('polygons', lassos[curIndex].polygon)
  if (lassos[curIndex].polygon !== null) {
    drawCanvas.remove(lassos[curIndex].polygon)
  }
  lassos[curIndex].polygon = new fabric.Polyline(curvePoints, {
    fill: 'red',
    stroke: '#6639a6',
    strokeWidth: 5,
  })
  drawCanvas.add(lassos[curIndex].polygon)
}

const drawLasso = (drawCanvas, lassos, curIndex) => {
  drawControlPoints(drawCanvas, lassos, curIndex)
  drawContour(drawCanvas, lassos, curIndex)
}

export const lassoMouseDown = (p, drawCanvas, lassos, curIndex) => {
  if (!(curIndex in lassos)) {
    lassos[curIndex] = {}
    lassos[curIndex]['points'] = []
    lassos[curIndex]['circles'] = []
    lassos[curIndex]['polygon'] = null
  }
  lassos[curIndex].points.push({
    x: p.x,
    y: p.y,
  })
  drawLasso(drawCanvas, lassos, curIndex)
}

export const lassoDragMouseDown = (p, lassos, activeIndex) => {
  activeIndex.lassoIndex = -1
  activeIndex.pointIndex = -1
  for (let lassoIndex in lassos) {
    const currentLasso = lassos[lassoIndex]
    for (let i = 0; i < currentLasso.points.length; i++) {
      const x = currentLasso.points[i].x
      const y = currentLasso.points[i].y
      const dx = p.x - x
      const dy = p.y - y
      if (dx * dx + dy * dy <= 25) {
        activeIndex.lassoIndex = lassoIndex
        activeIndex.pointIndex = i
        break
      }
    }
  }
}

export const lassoDragMouseMove = (p, lassos, activeIndex, drawCanvas) => {
  if (activeIndex.lassoIndex === -1) return
  lassos[activeIndex.lassoIndex].points[activeIndex.pointIndex].x = p.x
  lassos[activeIndex.lassoIndex].points[activeIndex.pointIndex].y = p.y
  drawLasso(drawCanvas, lassos, activeIndex.lassoIndex)
}

export const lassoDragMouseUp = (activeIndex) => {
  activeIndex.lassoIndex = -1
  activeIndex.pointIndex = -1
}
