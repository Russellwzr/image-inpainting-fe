import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { beforeHomeImg, afterHomeImg } from '../../assets'
import './styles.css'

const HomePage = () => {
  const imgRef = useRef(null)
  return (
    <div className="flex mt-16 justify-between">
      <div className="w-2/5">
        <h1 className="text-4xl font-bold">Magic Inpaint</h1>
        <p className="text-xl font-light mt-10">
          Use the most advanced AI model to help you deblur your picture and flexibly remove any unwanted objects in
          seconds.
        </p>
        <Link to="/edit">
          <button className="mt-10 rounded-full px-6 py-2 bg-sky-400 hover:bg-sky-300 text-white">Get Started</button>
        </Link>
      </div>
      <div className="relative shadow-2xl border-2 rounded-xl overflow-hidden">
        <div>
          <img src={beforeHomeImg} alt="before" style={{ width: 650, maxWidth: 650 }} />
        </div>
        <div className="absolute top-0 left-0">
          <div className="resize-container"></div>
          <div className="resize-save">
            <img
              ref={imgRef}
              src={afterHomeImg}
              alt="after"
              onLoad={() => {
                imgRef.current.style.maxWidth = `650px`
                imgRef.current.style.width = `650px`
              }}
            />
          </div>
          <span className="resize-icon"></span>
        </div>
      </div>
    </div>
  )
}

export default HomePage
