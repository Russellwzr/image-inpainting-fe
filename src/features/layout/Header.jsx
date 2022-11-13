import React from 'react'
import { StyledNav, StyledHeader } from './styles'

const Header = () => {
  return (
    <StyledHeader>
      <StyledNav aria-label="Main Navigation">
        <a href="/" className="logo"></a>
        <a href="/">home</a>
        <a href="/edit">edit</a>
        <a href="/examples">examples</a>
      </StyledNav>
    </StyledHeader>
  )
}

export default Header
