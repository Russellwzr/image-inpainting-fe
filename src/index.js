import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './common/layout'
import { NotFoundPage } from './common/notFoundPage'
import { HomePage } from './pages/homePage'
import { EditPage } from './pages/editPage'
import './index.css'
import 'antd/dist/antd.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <HashRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  </HashRouter>,
)
