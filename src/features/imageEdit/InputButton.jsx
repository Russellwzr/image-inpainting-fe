import React, { useRef } from 'react'

// eslint-disable-next-line react/prop-types
const InputButton = ({ onChange, tailWindStyle, children }) => {
  const inputRef = useRef(null)
  return (
    <div>
      <button className={tailWindStyle} onClick={() => inputRef.current.click()}>
        {children}
      </button>
      <input ref={inputRef} style={{ display: 'none' }} type="file" accept="image/*" onChange={onChange} />
    </div>
  )
}

export default InputButton
