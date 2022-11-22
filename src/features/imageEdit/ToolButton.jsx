import React, { useEffect, useRef } from 'react'
import { Tooltip, Popconfirm } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// eslint-disable-next-line react/prop-types
const ToolButton = ({ isActive, onClick, icon, title = '', disabledPopConfirm = true, disabled = false }) => {
  const buttonRef = useRef(null)
  useEffect(() => {
    buttonRef.current.disabled = disabled
  }, [disabled])
  return (
    <div>
      <Tooltip title={title} placement="bottom">
        <Popconfirm
          title="This operation will clear the current result, are you sure to continue?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onClick()
          }}
          disabled={disabledPopConfirm}
        >
          <button
            ref={buttonRef}
            className={`${disabled ? `hover:bg-transparent` : `hover:bg-gray-100`} px-2 py-1 rounded-lg ${
              isActive ? `bg-sky-200` : `bg-transparent`
            }`}
            onClick={() => {
              if (!disabledPopConfirm) return
              onClick()
            }}
          >
            <FontAwesomeIcon className={`${disabled ? `text-gray-300` : ``}`} icon={icon} />
          </button>
        </Popconfirm>
      </Tooltip>
    </div>
  )
}

export default ToolButton
