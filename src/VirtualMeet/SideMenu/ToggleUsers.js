import React from 'react'
import {
  KeyboardVoiceOutlined,
  MicOffOutlined,
  PersonOutlineOutlined,
  PushPinOutlined
} from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import RenderVideo from '../renderVideo'

function ToggleUsers({
  userData,
  selectedUser,
  handleUserClick,
  pinUser,
  setPinUser,
  generateColor,
  ToolTip
}) {
  const calculateWidth = length => {
    if (length <= 5) {
      const baseWidth = 90
      return `${baseWidth / length}%`
    } else {
      return '18%'
    }
  }

  return (
    <>
      {userData.map(user => (
        <Box
          className="user-Box"
          key={user.id}
          sx={{
            width:
              userData.length === 1
                ? '90%'
                : {
                    xs: '90%',
                    sm: '30%',
                    md: '22%',
                    lg: calculateWidth(userData.length)
                  },
            height:
              userData.length === 1
                ? { xs: '60%', sm: '70%', md: '70%', lg: '75%', xl: '90%' }
                : { xs: '40%', sm: '40%', md: '40%', lg: '50%' },
            bgcolor:
              selectedUser.name === user.name && pinUser ? '#000000' : '#292929'
          }}
        >
          <Box
            className="user-content"
            onClick={() => {
              handleUserClick(user)
              setPinUser(true)
            }}
            /*
            sx={{
              filter:
                selectedUser.name === user.name && pinUser
                  ? 'brightness(20%)'
                  : 'none'
            }}
            */
          >
            {user.isVideoMuted ? (
              <Avatar
                sx={{
                  width: { xs: 120, sm: 140, md: 150, lg: 160 },
                  height: { xs: 120, sm: 140, md: 150, lg: 160 },
                  bgcolor: user.name ? generateColor(user.name) : 'none'
                }}
              >
                {user.name ? (
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: '80px',
                      color: '#fff',
                      fontWeight: 600
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Typography>
                ) : (
                  <PersonOutlineOutlined sx={{ fontSize: '90px' }} />
                )}
              </Avatar>
            ) : (
              <RenderVideo stream={user.stream} />
            )}
          </Box>
          {selectedUser.name === user.name && pinUser ? (
            <ToolTip title="The participant is pinned" placement="left">
              <Box className="pinIcon-box" onClick={() => setPinUser(false)}>
                <PushPinOutlined className="pinIcon" />
              </Box>
            </ToolTip>
          ) : (
            <></>
          )}
          <Box
            className="user-name"
            sx={{
              bottom: '10px',
              left: '10px'
            }}
          >
            {user.isMuted ? (
              <MicOffOutlined sx={{ fontSize: '14px' }} />
            ) : (
              <KeyboardVoiceOutlined sx={{ fontSize: '14px' }} />
            )}
            <Typography variant="h6" sx={{ fontSize: '12px' }}>
              {user.name
                ? user.name.length > 10
                  ? `${user.name.slice(0, 10)}...`
                  : user.name
                : 'Name (N/A)'}
            </Typography>
          </Box>
        </Box>
      ))}
    </>
  )
}

export default ToggleUsers
