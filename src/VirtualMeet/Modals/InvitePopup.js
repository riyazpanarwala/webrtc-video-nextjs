import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import {Box,IconButton, Typography } from '@mui/material'
import { Close, ContentCopy, Done } from '@mui/icons-material'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

export default function AlertDialogSlide({ open, handleClose }) {
  const [copy, setCopy] = useState(false)

  const handleCopiedOpen = () => {
    setCopy(true)
  }
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '400px',
          height: '200px',
          bottom: '20%',
          bgcolor: '#000',
          color: '#fff',
          border: '0.5px solid #2e2e2e'
        }
      }}
    >
      <Box
        sx={{
          height: { xs: '100vh', sm: '200px', md: '200px', lg: '200px' },
          width: { xs: '100%', sm: '400px', md: '400px', lg: '400px' },
          position: {
            xs: 'fixed',
            sm: 'absolute',
            md: 'absolute',
            lg: 'absolute'
          },
          top: { xs: 0 },
          left: { xs: 0 },
          bottom: { sm: '20%', md: '20%', lg: '20%' }
        }}
        className="invite-dialogBox"
      >
      <DialogTitle sx={{ fontWeight: 600 }}>{'Invite more people'}</DialogTitle>
      <DialogContent>
        <DialogContentText mb={1} mt={1} sx={{  color: '#fff', fontSize: { xs: '15px', sm: '16px', md: '16px', lg: '16px' } }}>
          Share the meeting link to invite others
        </DialogContentText>
        <Button
          onClick={handleCopiedOpen}
          variant="contained"
          className="copy-btn"
          sx={{ bgcolor: copy ? '#189B55 !important' : '#246fe5 !important' }}
        >
          {copy ? (
            <Done sx={{ fontSize: '18px' }} />
          ) : (
            <ContentCopy sx={{ fontSize: '18px' }} />
          )}
          <Typography variant="h6" sx={{ fontSize: '16px' }}>
            {copy ? 'Link copied to clipboard' : 'Copy meeting link'}
          </Typography>
        </Button>
      </DialogContent>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff'
        }}
      >
        <Close />
      </IconButton>
      </Box>
    </Dialog>
  )
}
