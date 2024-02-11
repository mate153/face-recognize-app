import React from 'react'
import './style/Loading.css'

function Loading({ loading }) {

  return (
    <div className="spinner" style={{display: loading ? 'flex' : 'none'}}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Loading