import { fabric } from 'fabric'
import { MAX_HEIGHT, MAX_WIDTH } from '../constant'

export const handleImageUpload = (e, drawCanvas, setOriginImage, setInpaintSnapShots) => {
  const file = e.target.files[0]
  if (!file) return
  const fileUrl = URL.createObjectURL(file)
  fabric.Image.fromURL(fileUrl, (img) => {
    const originWidth = img.width
    const originHeight = img.height

    let targetWidth = originWidth
    let targetHeight = originHeight

    if (originWidth > MAX_WIDTH || originHeight > MAX_HEIGHT) {
      if (originWidth / originHeight > MAX_WIDTH / MAX_HEIGHT) {
        img.scaleToWidth(MAX_WIDTH)
        targetWidth = MAX_WIDTH
        targetHeight = Math.ceil(img.height * img.scaleY)
      } else {
        img.scaleToHeight(MAX_HEIGHT)
        targetHeight = MAX_HEIGHT
        targetWidth = Math.ceil(img.width * img.scaleX)
      }
    }

    drawCanvas.setWidth(targetWidth)
    drawCanvas.setHeight(targetHeight)
    setOriginImage(img)
    setInpaintSnapShots([{ originImage: img }])
  })
}

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
  const prevBack = drawCanvas.backgroundImage
  drawCanvas.setBackgroundColor('rgb(0,0,0)', drawCanvas.renderAll.bind(drawCanvas))
  drawCanvas.setBackgroundImage(new fabric.Image(''), drawCanvas.renderAll.bind(drawCanvas))
  const maskUrl = drawCanvas.toDataURL('image/jpeg')
  drawCanvas.setBackgroundColor('rgb(255,255,255)', drawCanvas.renderAll.bind(drawCanvas))
  drawCanvas.setBackgroundImage(prevBack, drawCanvas.renderAll.bind(drawCanvas))
  return maskUrl
}

export const handleImageDownload = (inpaintImage) => {
  const inpaintUrl = inpaintImage.toDataURL({ format: 'image/jpeg' })
  const e = new MouseEvent('click')
  let b = document.createElement('a')
  b.download = 'inpaint.jpg'
  b.href = inpaintUrl
  b.dispatchEvent(e)
}

export const getInpaintFormData = (drawCanvas, originImage) => {
  let param = new FormData()
  const maskUrl = getMaskUrl(drawCanvas)
  param.append('mask', dataURLToBlob(maskUrl), 'mask.jpg')
  const originUrl = originImage.toDataURL('image/jpeg')
  param.append('origin', dataURLToBlob(originUrl), 'origin.jpg')
  return param
}

export const getDeblurFormData = (originImage) => {
  let param = new FormData()
  const originUrl = originImage.toDataURL('image/jpeg')
  param.append('origin', dataURLToBlob(originUrl), 'origin.jpg')
  return param
}
