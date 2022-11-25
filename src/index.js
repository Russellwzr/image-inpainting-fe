import React from 'react'
import ReactDOM from 'react-dom/client'
import { Layout } from './features/layout'
import { ImageEditor } from './features/imageEdit'
import './index.css'
import 'antd/dist/antd.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Layout>
    <ImageEditor />
  </Layout>,
)
