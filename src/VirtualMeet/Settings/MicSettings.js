import React from 'react'
import { Box, Divider, List, ListItemButton, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import {
  DensitySmallOutlined,
  KeyboardVoiceOutlined
} from '@mui/icons-material'

function MicSettings(props) {
  const { micList, speakerList, handleMicList, handleSpeakerList } = props
  return (
    <Box>
      <List sx={{ color: '#fff' }}>
        <ListItemButton className="micSetting-list">
          <KeyboardVoiceOutlined sx={{ color: '#fff', fontSize: '20px' }} />
          <Box className="micText-box">
            <Typography className="mic-Text">Microphone</Typography>
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          onClick={() => handleMicList(1)}
          sx={{
            background: micList === 1 ? '#292929' : 'none',
            borderLeft: micList === 1 ? '3px solid #4687ED' : 'none'
          }}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: micList === 1 ? 'visible' : 'hidden'
            }}
          />

          <Box className="micText-box">
            <Typography className="mic-Text">
              Same as system (Microphone Array (Realtek Audio))
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <DensitySmallOutlined className="mic-frequncy1" />
            <DensitySmallOutlined className="mic-frequncy" />
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          sx={{
            background: micList === 2 ? '#292929' : 'none',
            borderLeft: micList === 2 ? '3px solid #4687ED' : 'none'
          }}
          onClick={() => handleMicList(2)}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: micList === 2 ? 'visible' : 'hidden'
            }}
          />
          <Box className="micText-box">
            <Typography className="mic-Text">
              Communications - Microphone Array (Realtek Audio)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <DensitySmallOutlined className="mic-frequncy1" />
            <DensitySmallOutlined className="mic-frequncy" />
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          sx={{
            background: micList === 3 ? '#292929' : 'none',
            borderLeft: micList === 3 ? '3px solid #4687ED' : 'none'
          }}
          onClick={() => handleMicList(3)}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: micList === 3 ? 'visible' : 'hidden'
            }}
          />
          <Box className="micText-box">
            <Typography className="mic-Text">
              Microphone Array (Realtek Audio)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <DensitySmallOutlined className="mic-frequncy1" />
            <DensitySmallOutlined className="mic-frequncy" />
          </Box>
        </ListItemButton>
      </List>
      <Divider
        sx={{
          background: '#292929'
        }}
      />
      <List sx={{ color: '#fff' }}>
        <ListItemButton className="micSetting-list">
          <VolumeUpIcon sx={{ color: '#fff', fontSize: '20px' }} />
          <Box className="micText-box">
            <Typography className="mic-Text">Speakers</Typography>
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          onClick={() => handleSpeakerList(1)}
          sx={{
            background: speakerList === 1 ? '#292929' : 'none',
            borderLeft: speakerList === 1 ? '3px solid #4687ED' : 'none'
          }}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: speakerList === 1 ? 'visible' : 'hidden'
            }}
          />
          <Box className="micText-box">
            <Typography className="mic-Text">
              Same as system (Speakers / Headphones (Realtek Audio))
            </Typography>
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          sx={{
            background: speakerList === 2 ? '#292929' : 'none',
            borderLeft: speakerList === 2 ? '3px solid #4687ED' : 'none'
          }}
          onClick={() => handleSpeakerList(2)}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: speakerList === 2 ? 'visible' : 'hidden'
            }}
          />
          <Box className="micText-box">
            <Typography className="mic-Text">
              Communications - Speakers / Headphones (Realtek Audio)
            </Typography>
          </Box>
        </ListItemButton>
        <ListItemButton
          className="micSetting-list"
          sx={{
            background: speakerList === 3 ? '#292929' : 'none',
            borderLeft: speakerList === 3 ? '3px solid #4687ED' : 'none'
          }}
          onClick={() => handleSpeakerList(3)}
        >
          <CheckIcon
            sx={{
              color: '#fff',
              visibility: speakerList === 3 ? 'visible' : 'hidden'
            }}
          />
          <Box className="micText-box">
            <Typography className="mic-Text">
              Speakers / Headphones (Realtek Audio)
            </Typography>
          </Box>
        </ListItemButton>
      </List>
    </Box>
  )
}

export default MicSettings
