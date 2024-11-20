import React, { useState, useEffect } from 'react'
import { Box, TextField } from '@mui/material'
import OrangeButton from '../Web/Common/fillButton'
import VirtualMeetMeeting from './index'
import {
  getLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage
} from '../../utils/storage'

const keyName = 'eNowWebrtc'

const VirtualMeet = () => {
  const [name, setName] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const [isMeeting, setMeeting] = useState(false)

  const onBtnClick = () => {
    if (name && meetingId) {
      setMeeting(true)
    }
  }

  const callEnded = () => {
    removeFromLocalStorage(keyName)
    setMeeting(false)
  }

  const apiEventNotify = msgObj => {
    console.log(msgObj)
  }

  useEffect(() => {
    const obj = getLocalStorage(keyName)
    if (obj.name && obj.meetingId) {
      setName(obj.name)
      setMeetingId(obj.meetingId)
      setMeeting(true)
    }
  }, [])

  if (isMeeting) {
    setToLocalStorage({ name, meetingId }, keyName)
    return (
      <VirtualMeetMeeting
        myname={name}
        roomName={meetingId}
        callEnded={callEnded}
        visitNotesEnabled={false}
        startWithAudioMuted={false}
        startWithVideoMuted={false}
        apiEventNotify={apiEventNotify}
        buttonsWithNotifyClick={['invite']}
        recordingEnabled={false}
      />
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="center" width="100%" mt={3}>
        <TextField
          label={'Your name'}
          variant="outlined"
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
          // helperText={isValidEmail ? '' : t('invalidEmail')}
          // error={!isValidEmail}
        />
      </Box>
      <Box display="flex" justifyContent="center" width="100%" mt={3}>
        <TextField
          label={'Room Name'}
          variant="outlined"
          value={meetingId}
          onChange={e => {
            setMeetingId(e.target.value)
          }}
          // helperText={isValidEmail ? '' : t('invalidEmail')}
          // error={!isValidEmail}
        />
      </Box>
      <Box display="flex" justifyContent="center" width="100%" mt={3}>
        <OrangeButton onClick={onBtnClick} primary="#FF8626">
          Go To Meeting
        </OrangeButton>
      </Box>
    </Box>
  )
}

export default VirtualMeet
