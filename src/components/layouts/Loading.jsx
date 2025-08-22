import React from 'react'
import { CircleLoader } from 'react-spinners'

const Loading = () => {
  return (
    <div
    className='w-full h-full flex justify-center items-center'
    >
        <CircleLoader  size={"3rem"} />
    </div>
  )
}

export default Loading