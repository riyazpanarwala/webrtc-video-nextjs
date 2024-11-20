import React, { useState } from 'react'
import { Snackbar, Alert, Slide } from '@mui/material'

function SlideTransition(props) {
  return <Slide {...props} direction="right" />
}

const AlertBox = ({ msg }) => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      TransitionComponent={SlideTransition}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        key={'bottom' + 'left'}
        sx={{ width: '100%', bgcolor: '#fff', color: '#000000' }}
      >
        {msg}
      </Alert>
    </Snackbar>
  )
}

export default AlertBox
