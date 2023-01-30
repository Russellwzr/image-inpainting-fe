# Image Inpainting Front-End

Use the most advanced AI model to help you deblur your picture and flexibly remove any unwanted objects in seconds.

* Front-End: React + Fabric + TailwindCSS 
* Back-End: Pytorch + Flask (https://github.com/Russellwzr/image-inpainting-be)


https://user-images.githubusercontent.com/53935275/215541927-25c47292-8ac5-4a82-836e-62ae3916a1f2.mp4


## Features

* Image upload and download
* Clear canvas
* Undo and redo of canvas interactive operations

https://user-images.githubusercontent.com/53935275/215542991-84ad0571-7d8b-4e99-868c-2f804e98b8e7.mp4

* Viewport transformation: zoom in/out (mouse wheel) & pan (alt + left click)
* Eraser with variable thickness
* Drawing and editing of cardinal spline polygons
* Store history of results
* Comparison of before and after results
* Reduce react component re-rendering through memo, useMemo, useCallback etc.
* Inpaint: remove any unwanted objects from images
* Deblur: eliminate blurring artifacts and improve image clarity

## Quick Start

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### `npm install`

Install packages that the project depends on. 

### `npm start`

Run the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\

## Where the related APIs are called

### Inpaint

* Front-End:  `src/pages/editPage/ToolBar.jsx/handleInpaint`
* Back-End:  `app.py/inpaint`

### Deblur

* Front-End:  `src/pages/editPage/ToolBar.jsx/handleDeblur`
* Back-End:  `app.py/deblur`

