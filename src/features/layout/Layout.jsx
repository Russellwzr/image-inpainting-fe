import React from 'react'
import { GlobalStyles } from 'twin.macro'
import { Global } from '@emotion/react'
import { baseStyles } from './styles'
import { Header, Footer } from '.'

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <>
      <GlobalStyles />
      <Global styles={baseStyles} />
      <Header />
      <main id="main" className="relative" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default Layout
