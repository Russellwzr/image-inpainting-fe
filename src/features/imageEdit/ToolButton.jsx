import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// eslint-disable-next-line react/prop-types
const ToolButton = ({ isActive, onClick, icon, disabled = false }) => {
  const buttonRef = useRef(null)
  useEffect(() => {
    buttonRef.current.disabled = disabled
  }, [disabled])
  return (
    <div>
      <button
        ref={buttonRef}
        className={`${disabled ? `hover:bg-transparent` : `hover:bg-gray-100`} px-2 py-1 rounded-lg ${
          isActive ? `bg-sky-200` : `bg-transparent`
        }`}
        onClick={onClick}
      >
        <FontAwesomeIcon className={`${disabled ? `text-gray-300` : ``}`} icon={icon} />
      </button>
    </div>
  )
}

export default ToolButton
