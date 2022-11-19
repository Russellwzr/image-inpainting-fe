import React from 'react'
import { StyledNav, StyledHeader } from './styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
const Header = () => {
  return (
    <StyledHeader>
      <div className="space-x-4">
        <FontAwesomeIcon icon={faWandMagicSparkles} className={`text-3xl text-sky-400`} />
        <span className="text-2xl text-sky-400 font-mono font-semibold">Magic Inpaint</span>
      </div>

      <StyledNav aria-label="Main Navigation">
        <a href="/">home</a>
        <a href="/edit">edit</a>
        <a href="/examples">examples</a>
      </StyledNav>
    </StyledHeader>
  )
}

export default Header
