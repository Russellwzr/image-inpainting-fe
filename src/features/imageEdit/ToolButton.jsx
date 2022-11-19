import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// eslint-disable-next-line react/prop-types
const ToolButton = ({ isActive, onClick, icon }) => {
  return (
    <div>
      <button
        className={`hover:bg-gray-100 px-2 py-1 rounded-lg ${isActive ? `bg-sky-200` : `bg-transparent`}`}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={icon} />
      </button>
    </div>
  )
}

export default ToolButton
