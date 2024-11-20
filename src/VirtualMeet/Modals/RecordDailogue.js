import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Box, IconButton, FormControlLabel, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import { styled } from '@mui/material/styles'
import Switch from '@mui/material/Switch'

export default function RecordDialog(props) {
  const {
    showStartDialog,
    showStopDialog,
    setShowStartDialog,
    setShowStopDialog,
    startRecording,
    stopRecording
  } = props
  const IOSSwitch = styled(props => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      checked={true}
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2ECA45' : '#246FE5',
          opacity: 1,
          border: 0
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5
        }
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff'
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600]
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3
      }
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500
      })
    }
  }))

  return (
    <>
      {showStartDialog && (
        <Dialog
          open={showStartDialog}
          onClose={() => setShowStartDialog(false)}
          sx={{
            '& .MuiPaper-root': {
              width: '400px',
              height: '320px',
              bottom: '15%',
              bgcolor: '#000',
              color: '#fff',
              border: '0.5px solid #2e2e2e'
            }
          }}
        >
           <Box
            sx={{
              height: { xs: '100vh', sm: '320px', md: '320px', lg: '320px' },
              width: { xs: '100%', sm: '400px', md: '400px', lg: '400px' },
              position: {
                xs: 'fixed',
                sm: 'absolute',
                md: 'absolute',
                lg: 'absolute'
              },
              top: { xs: 0 },
              left: { xs: 0 },
              bottom: { sm: '15%', md: '15%', lg: '15%' }
            }}
            className="record-dialogBox"
          >
          <DialogTitle display={'flex'} mb={1} justifyContent={'space-between'}>
            <Box sx={{ fontWeight: 600 }}>Start recording</Box>
            <IconButton>
              <CloseIcon
                onClick={() => setShowStartDialog(false)}
                sx={{ color: '#fff' }}
              />
            </IconButton>
          </DialogTitle>

          <Box className="dividerLine"></Box>

          <Box className="save-recordBox">
              <Box
                className="download-btn"
                sx={{
                  width: { xs: '35px', sm: '45px', md: '45px', lg: '45px' },
                  height: { xs: '35px', sm: '45px', md: '45px', lg: '45px' }
                }}
              >
              <FileDownloadOutlinedIcon
                sx={{ color: 'blue', fontSize: '25px' }}
              />
            </Box>
            <Box sx={{ fontSize: { xs: '14px', sm: '16px', md: '16px', lg: '16px' } }}>
              Save recording file locally (Beta)
            </Box>
            <FormControlLabel control={<IOSSwitch defaultChecked />} />
          </Box>
          <DialogContent sx={{ overflowY: 'hidden' }}>
            <Typography variant="h6" className="record-Text">
              Make sure you select the current tab in order to use the right
              viedo and audio . the recording is currently limited to 1GB. which
              is around 100 minutes
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowStartDialog(false)}
              className="record-closebtn"
            >
              Cancel
            </Button>
            <Button
              autoFocus
              className="start-recordbtn"
              disableRipple
              onClick={startRecording}
            >
              Start Recording
            </Button>
          </DialogActions>
          </Box>
        </Dialog>
      )}

      {showStopDialog && (
        <Dialog
          open={showStopDialog}
          onClose={() => setShowStopDialog(false)}
          sx={{
            '& .MuiPaper-root': {
              width: '400px',
              height: '200px',
              bottom: '15%',
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
            className="record-dialogBox"
          >
          <DialogTitle display={'flex'} justifyContent={'space-between'}>
            <Box sx={{ fontWeight: 600 }}>Recording</Box>
            <IconButton>
              <CloseIcon
                onClick={() => setShowStopDialog(false)}
                sx={{ color: '#fff' }}
              />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" sx={{ fontSize: '14px' }}>
              Are you sure you would like to stop the recording ?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ mt: 1 }}>
            <Button
              onClick={() => setShowStopDialog(false)}
              className="record-closebtn"
            >
              Cancel
            </Button>
            <Button
              autoFocus
              className="start-recordbtn"
              disableRipple
              onClick={stopRecording}
            >
              Confirm
            </Button>
          </DialogActions>
          </Box>
        </Dialog>
      )}
    </>
  )
}
