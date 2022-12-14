import React, { useRef, memo } from 'react'
import { Tooltip, Popconfirm } from 'antd'

// eslint-disable-next-line react/prop-types
const InputButton = memo(({ onChange, tailWindStyle = '', title = '', disabledPopConfirm = true, children = null }) => {
  const inputRef = useRef(null)
  return (
    <div>
      <Tooltip title={title} placement="bottom">
        <Popconfirm
          title="This operation will clear the current result, are you sure to continue?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            inputRef.current.click()
          }}
          disabled={disabledPopConfirm}
        >
          <button
            className={tailWindStyle}
            onClick={() => {
              if (disabledPopConfirm) {
                inputRef.current.click()
              }
            }}
          >
            {children}
          </button>
        </Popconfirm>
        <input ref={inputRef} style={{ display: 'none' }} type="file" accept="image/*" onChange={onChange} />
      </Tooltip>
    </div>
  )
})

export default InputButton
