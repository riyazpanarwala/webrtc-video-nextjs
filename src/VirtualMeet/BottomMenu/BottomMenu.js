import React from 'react';
import Menus from './Menus.js';
import { Box } from '@mui/material';

function BottomMenu(props) {
  return (
    <>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#878787'
        }}
      >
        <Menus {...props} />
      </Box>
    </>
  )
}

export default BottomMenu
