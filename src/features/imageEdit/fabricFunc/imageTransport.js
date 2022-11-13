import { fabric } from 'fabric'
import { MAX_HEIGHT, MAX_WIDTH } from '../constant'

export const handleImageUpload = (e, drawCanvas, imageCanvas) => {
  const file = e.target.files[0]
  if (!file) return

  const fileUrl = URL.createObjectURL(file)
  const img = new Image()
  img.src = fileUrl

  img.onload = () => {
    URL.revokeObjectURL(img.src)

    const originWidth = img.width
    const originHeight = img.height

    let targetWidth = originWidth
    let targetHeight = originHeight

    if (originWidth > MAX_WIDTH || originHeight > MAX_HEIGHT) {
      if (originWidth / originHeight > MAX_WIDTH / MAX_HEIGHT) {
        targetWidth = MAX_WIDTH
        targetHeight = Math.round(MAX_WIDTH * (originHeight / originWidth))
      } else {
        targetHeight = MAX_HEIGHT
        targetWidth = Math.round(MAX_HEIGHT * (originWidth / originHeight))
      }
    }

    imageCanvas.current.width = targetWidth
    imageCanvas.current.height = targetHeight
    drawCanvas.current.setWidth(targetWidth)
    drawCanvas.current.setHeight(targetHeight)

    const imgElement = new fabric.Image(img)
    drawCanvas.current.setBackgroundImage(imgElement, drawCanvas.current.renderAll.bind(drawCanvas.current), {
      scaleX: drawCanvas.current.getWidth() / img.width,
      scaleY: drawCanvas.current.getHeight() / img.height,
    })

    const imageContext = imageCanvas.current.getContext('2d')
    imageContext.clearRect(0, 0, targetWidth, targetHeight)
    imageContext.drawImage(img, 0, 0, targetWidth, targetHeight)
  }
}

// eslint-disable-next-line no-unused-vars
const dataURLToBlob = (dataurl) => {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

const getMaskUrl = (drawCanvas) => {
  const prevBack = drawCanvas.current.backgroundImage
  const image = new fabric.Image('')
  drawCanvas.current.setBackgroundColor('rgb(0,0,0)', drawCanvas.current.renderAll.bind(drawCanvas.current))
  drawCanvas.current.setBackgroundImage(image, drawCanvas.current.renderAll.bind(drawCanvas.current))
  const maskUrl = drawCanvas.current.toDataURL('image/jpeg')
  drawCanvas.current.setBackgroundImage(prevBack, drawCanvas.current.renderAll.bind(drawCanvas.current))
  return maskUrl
}

export const handleImageDownload = (drawCanvas) => {
  const maskUrl = getMaskUrl(drawCanvas)
  const e = new MouseEvent('click')
  let b = document.createElement('a')
  b.download = 'mask.jpg'
  b.href = maskUrl
  b.dispatchEvent(e)
}
