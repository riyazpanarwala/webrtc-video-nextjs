import React from 'react'
import { Box, ClickAwayListener } from '@mui/material'
import RenderVideo from '../renderVideo'

function CameraSettings({ cameraStream, handleMiniCamera }) {
  return (
    <ClickAwayListener onClickAway={handleMiniCamera}>
      <Box className="cameraSetting" position={'absolute'}>
        <RenderVideo stream={cameraStream} />
      </Box>
    </ClickAwayListener>
  )
}

export default CameraSettings
