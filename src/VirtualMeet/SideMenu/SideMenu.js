import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, IconButton } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import UserBox from './UserBox'

const drawerWidth = 200

const openedMixin = (theme, showUser, open) => ({
  width: showUser ? '100%' : drawerWidth,
  transition: open && !showUser ? 'ease-in-out 0.7s' : 'none',
  overflowX: 'hidden',
  background: showUser ? '#3d3d3d' : 'transparent',
  border: 'none !important'
})

const closedMixin = (theme, showUser, open) => ({
  background: showUser ? '#3d3d3d' : 'rgba( 61, 61, 61, 0.55 )',
  transition: !open && !showUser ? '1s' : 'none',
  overflowX: 'hidden',
  width: showUser ? '100%' : '5px !important',
  border: 'none !important'
})

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open, showUser, _chat }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme, showUser, open),
    '& .MuiDrawer-paper': openedMixin(theme, showUser, open)
  }),
  ...(!open && {
    ...closedMixin(theme, showUser, open),
    '& .MuiDrawer-paper': closedMixin(theme, showUser, open)
  })
}))

export default function Sidebar({
  open,
  chat,
  setOpen,
  showUser,
  handleUserClick,
  userData,
  remoteStreams,
  generateColor,
  selectedUser,
  inviteUserClick,
  buttonsWithNotifyClick
}) {
  const handleDrawerOpen = () => {
    setOpen(!open)
  }

  const boxStyle = {
    '&:hover > .sidemenu-arrow': {
      display: showUser ? 'none' : open ? 'flex !important' : 'none'
    },
    '&:hover > .sidebar-divider': {
      display: showUser ? 'none' : open ? 'flex !important' : 'none'
    }
  }

  return (
    <>
      <Box className="sidebar-container" sx={open ? boxStyle : ''}>
        <Drawer
          variant="permanent"
          open={open}
          // chat={chat}
          // showUser={showUser}
          anchor="right"
          sx={{
            '& .MuiDrawer-paper': {
              width:
                showUser && chat
                  ? { lg: '78%', xl: '84%' }
                  : showUser
                  ? '100%'
                  : drawerWidth,
              scrollbarWidth: showUser ? 'thin' : 'none',
              scrollbarColor: showUser ? '#232323 transparent' : 'none',
              '& ::-webkit-scrollbar': {
                display: !showUser && 'none !important'
              }
            }
          }}
        >
          <Box
            sx={{
              width: showUser ? '100%' : 160,
              height: '100%',
              ml: showUser ? 0 : 5,
              '&:hover': {
                background: showUser ? '#3d3d3d' : 'rgba(51, 51, 51, .5)'
              }
            }}
          >
            <UserBox
              open={open}
              showUser={showUser}
              handleUserClick={handleUserClick}
              userData={userData}
              remoteStreams={remoteStreams}
              generateColor={generateColor}
              selectedUser={selectedUser}
              inviteUserClick={inviteUserClick}
              buttonsWithNotifyClick={buttonsWithNotifyClick}
            />
          </Box>
        </Drawer>
        <Box
          className={`sidemenu-arrow ${showUser ? 'hide-arrow' : ''}`}
          sx={{
            right: open ? '165px' : '12px',
            display: !open ? 'flex' : 'none',
            transition: open ? 'ease-in-out 0.7s' : '1s'
          }}
        >
          <IconButton
            onClick={handleDrawerOpen}
            sx={{ color: '#fff' }}
            disableRipple
          >
            {open === true ? (
              <ArrowForwardIos sx={{ fontSize: '18px' }} />
            ) : (
              <ArrowBackIosNew sx={{ fontSize: '18px' }} />
            )}
          </IconButton>
        </Box>
        <Box
          className={`sidebar-divider ${showUser ? 'hide-divider' : ''}`}
          sx={{
            right: open ? '155px' : '2px',
            display: !open ? 'flex' : 'none',
            transition: open ? 'ease-in-out 0.7s' : '1s'
          }}
        ></Box>
      </Box>
    </>
  )
}
