import React from 'react'
import { Link } from 'react-router-dom'
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
        <Link to="/">home</Link>
        <Link to="/edit">edit</Link>
        <Link to="/examples">examples</Link>
      </StyledNav>
    </StyledHeader>
  )
}

export default Header
