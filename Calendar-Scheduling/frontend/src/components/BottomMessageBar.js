import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const BottomMessageBar = ({ open, message, messageType, handleClose }) => {
    let snackBarBackgroudColor;
    switch (messageType) {
        case 'positiveMessage':
            snackBarBackgroudColor = '#3cb043'
            break;
        case 'negativeMessage':
            snackBarBackgroudColor = '#cc0000'
            break;
        default:
            snackBarBackgroudColor = '#cc0000'
            
    }
    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <SnackbarContent sx={{ background: `${snackBarBackgroudColor}`, fontSize: '13px'}} message={message} />

        </Snackbar>
    )
}

export default BottomMessageBar
