import React from 'react'
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import PeopleIcon from '@mui/icons-material/People'
import { Button } from '@mui/material'
import Avatar from '@mui/material/Avatar'

export default function CallEndDialog({
  callEnd,
  setCallEnd,
  // leaveMeeting,
  // handleMeetingClose,
  handleMeetingClick,
  endCallForAll,
  endCall
}) {
  const handleCallClose = () => {
    setCallEnd(false)
    handleMeetingClick()
  }

  return (
    <>
      <Dialog open={callEnd} onClose={handleCallClose}>
        <div className="callEnd-dialog">
          <Button
            className="leaveCall-btn"
            disableRipple
            onClick={endCall}
            endIcon={
              <Avatar sx={{ bgcolor: '#f44336' }}>
                <PersonIcon />
              </Avatar>
            }
          >
            Leave call
          </Button>
          <Button
            className="endMeeting-btn"
            disableRipple
            onClick={endCallForAll}
            endIcon={
              <Avatar sx={{ bgcolor: '#f44336' }}>
                <PeopleIcon />
              </Avatar>
            }
          >
            End Meeting for All
          </Button>
          <Button
            className="callCancel-btn"
            disableRipple
            onClick={handleCallClose}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  )
}
