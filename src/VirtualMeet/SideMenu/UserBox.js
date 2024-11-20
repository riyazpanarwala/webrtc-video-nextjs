import React, { useState } from 'react'
import InvitePopup from '../Modals/InvitePopup'
import ToggleUsers from './ToggleUsers'
import {
  KeyboardVoiceOutlined,
  MicOffOutlined,
  PersonOutlineOutlined,
  PersonAddOutlined,
  PushPinOutlined
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  Tooltip,
  Typography,
  styled,
  tooltipClasses
} from '@mui/material'
import RenderVideo from '../renderVideo'

function UserBox({
  open,
  showUser,
  handleUserClick,
  userData,
  remoteStreams,
  generateColor,
  selectedUser,
  inviteUserClick,
  buttonsWithNotifyClick
}) {
  const [show, setShow] = useState(false)
  const [pinUser, setPinUser] = useState(false)

  const handleClickOpen = () => {
    setShow(true)
  }

  const handleClose = () => {
    setShow(false)
  }

  const ToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
      fontSize: '12px',
      padding: '10px'
    },
    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]: {
      marginRight: '0px'
    }
  }))

  return (
    <Box
      className="user-container"
      sx={{
        height: showUser ? '100%' : 'auto',
        marginLeft: open ? '0px' : showUser ? '0px' : '100px',
        transition: open ? 'ease-in-out 0.7s' : '1s',
        flexDirection: showUser ? 'row' : 'column',
        alignItems: showUser ? 'space-between' : 'center',
        flexWrap: 'wrap'
      }}
    >
      {showUser ? (
        <ToggleUsers
          setPinUser={setPinUser}
          pinUser={pinUser}
          handleUserClick={handleUserClick}
          userData={[...userData, ...remoteStreams]}
          selectedUser={selectedUser}
          generateColor={generateColor}
          ToolTip={ToolTip}
        />
      ) : (
        <>
          <Box
            className="user-Box"
            sx={{
              width: '120px',
              height: '120px',
              bgcolor:
                userData[0] && selectedUser.name === userData[0].name && pinUser
                  ? '#000000'
                  : '#292929',
              mr: { xs: 1, lg: 1.5, xl: 1.5 }
            }}
          >
            <Box
              className="user-content"
              onClick={() => {
                handleUserClick(userData[0])
                setPinUser(true)
              }}
              /*
              sx={{
                filter:
                  userData[0] &&
                  selectedUser.name === userData[0].name &&
                  pinUser
                    ? 'brightness(20%)'
                    : 'none'
              }}
              */
            >
              {userData[0].isVideoMuted ? (
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: userData[0]?.name
                      ? generateColor(userData[0].name)
                      : 'none'
                  }}
                >
                  {userData[0]?.name ? (
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: '26px',
                        color: '#fff',
                        fontWeight: 600
                      }}
                    >
                      {userData[0].name.charAt(0).toUpperCase()}
                    </Typography>
                  ) : (
                    <PersonOutlineOutlined sx={{ fontSize: '32px' }} />
                  )}
                </Avatar>
              ) : (
                <RenderVideo stream={userData[0].stream} />
              )}
            </Box>
            {userData[0]?.name === selectedUser.name && pinUser ? (
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
                bottom: '5px',
                left: '5px'
              }}
            >
              {userData[0].isMuted ? (
                <MicOffOutlined sx={{ fontSize: '14px' }} />
              ) : (
                <KeyboardVoiceOutlined sx={{ fontSize: '14px' }} />
              )}
              <Typography variant="h6" sx={{ fontSize: '12px' }}>
                {userData[0]?.name
                  ? userData[0].name.length > 10
                    ? `${userData[0].name.slice(0, 10)}...`
                    : userData[0].name
                  : 'Name (N/A)'}
              </Typography>
            </Box>
          </Box>
          <Box
            className="user-scrollBox"
            sx={{
              maxHeight: {
                xs: '350px',
                sm: '350px',
                md: '350px',
                lg: '350px',
                xl: '400px'
              },
              overflowY: 'auto',
              mt: -1.5
            }}
          >
            {remoteStreams.map(user => {
              return (
                <Box
                  className="user-Box"
                  key={user.id}
                  sx={{
                    width: '120px',
                    height: '120px',
                    bgcolor:
                      selectedUser.name === user.name && pinUser
                        ? '#000000'
                        : '#292929',
                    mb: 1
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
                          width: 56,
                          height: 56,
                          bgcolor: user.name ? generateColor(user.name) : 'none'
                        }}
                      >
                        {user.name ? (
                          <Typography
                            variant="h1"
                            sx={{
                              fontSize: '26px',
                              color: '#fff',
                              fontWeight: 600
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </Typography>
                        ) : (
                          <PersonOutlineOutlined sx={{ fontSize: '32px' }} />
                        )}
                      </Avatar>
                    ) : (
                      <RenderVideo stream={user.stream} />
                    )}
                  </Box>
                  {selectedUser.name === user.name && pinUser ? (
                    <ToolTip title="The participant is pinned" placement="left">
                      <Box
                        className="pinIcon-box"
                        onClick={() => setPinUser(false)}
                      >
                        <PushPinOutlined className="pinIcon" />
                      </Box>
                    </ToolTip>
                  ) : (
                    <></>
                  )}
                  <Box
                    className="user-name"
                    sx={{
                      bottom: '5px',
                      left: '5px'
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
              )
            })}
          </Box>
        </>
      )}
      <Button
        className="addUser-btn"
        disableRipple
        onClick={() => {
          const arr = buttonsWithNotifyClick.filter(v => v === 'invite')
          if (arr.length) {
            inviteUserClick()
          } else {
            handleClickOpen()
          }
        }}
        sx={{
          position: showUser
            ? { xs: 'static', sm: 'static', md: 'absolute', lg: 'absolute' }
            : 'static',
          top: 25,
          right: '3%',
          mt: showUser ? { xs: 0, sm: 10, md: 0, lg: 0 } : 0
        }}
      >
        <PersonAddOutlined sx={{ fontSize: '16px' }} />
        <Typography variant="h6" sx={{ fontSize: '12px' }}>
          Add Participant
        </Typography>
      </Button>
      <Box sx={{ width: '100%', height: '100px' }}></Box>
      {show && <InvitePopup open={open} handleClose={handleClose} />}
    </Box>
  )
}

export default UserBox
