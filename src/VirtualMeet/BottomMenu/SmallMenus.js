import * as React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from '@mui/material'
import { GridViewOutlined, RadioButtonChecked } from '@mui/icons-material'
import ScreenShareOutlinedIcon from '@mui/icons-material/ScreenShareOutlined'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'

export default function SmallMenus({
  smallMenus,
  handleSmallMenus,
  showUser,
  handleShowUser,
  sharingOpen,
  handleScreenShare,
  handleStopSharing,
  recording,
  recordClick,
  isVisitNotesEnabled,
  visitNotesClick,
  recordingEnabled
}) {
  const [state, setState] = React.useState({
    bottom: false
  })

  const stopSharing = () => {
    handleStopSharing()
    handleSmallMenus()
  }
  const startSharing = () => {
    handleScreenShare()
    handleSmallMenus()
  }

  const toggleDrawer = (anchor, open) => event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState({ ...state, [anchor]: open })
  }

  const list = anchor => (
    <Box
      sx={{
        width: 'auto',
        bgcolor: '#141414',
        height: '260px',
        borderRadius: '25px 25px 0 0',
        color: '#fff'
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItemButton
          sx={{ display: { sm: 'none', xs: 'flex' } }}
          onClick={sharingOpen ? stopSharing : startSharing}
        >
          <ListItemIcon>
            <ScreenShareOutlinedIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText
            primary={
              sharingOpen ? 'Stop screen sharing' : 'Start screen sharing'
            }
          ></ListItemText>
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            handleShowUser()
            handleSmallMenus()
          }}
        >
          <ListItemIcon>
            <GridViewOutlined sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText
            primary={showUser ? 'Exit tile view' : 'Enter tile view'}
          ></ListItemText>
        </ListItemButton>
        {recordingEnabled ? (
          <ListItemButton
            onClick={() => {
              recordClick()
              handleSmallMenus()
            }}
          >
            <ListItemIcon>
              <RadioButtonChecked sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText
              primary={recording ? 'Stop recording' : 'Start recording'}
            ></ListItemText>
          </ListItemButton>
        ) : (
          ''
        )}
        {isVisitNotesEnabled ? (
          <ListItemButton
            onClick={() => {
              visitNotesClick()
              handleSmallMenus()
            }}
          >
            <ListItemIcon>
              <TextSnippetIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary={'Visit Notes'}></ListItemText>
          </ListItemButton>
        ) : (
          ''
        )}
      </List>
    </Box>
  )

  return (
    <div>
      <React.Fragment key="bottom">
        <Drawer
          anchor="bottom"
          open={smallMenus}
          onClose={handleSmallMenus}
          sx={{
            display: {
              lg: 'none !important',
              xl: 'none !important',
              md: 'none !important',
              sm: 'flex !important',
              xs: 'flex !important'
            },
            '& .MuiPaper-root': {
              bgcolor: 'transparent !important'
            }
          }}
        >
          {list('bottom')}
        </Drawer>
      </React.Fragment>
    </div>
  )
}
