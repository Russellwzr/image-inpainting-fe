import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './features/layout'
import { ImageEditor } from './features/imageEdit'
import reportWebVitals from './reportWebVitals'
import './index.css'
import 'antd/dist/antd.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <Layout>
      <ImageEditor />
    </Layout>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
