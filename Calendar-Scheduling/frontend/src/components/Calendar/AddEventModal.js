import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TimePickerComponent from './TimePickerComponent';
import { format } from 'date-fns';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function AddEventModal({ timeZone, open, handleClose, selectedDate, userId, activeUsers }) {
    
    const formattedDate = format(selectedDate, 'MMMM d');
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <h3>Add an event on {formattedDate}</h3>
                <TimePickerComponent timeZone={timeZone} value={selectedDate} userId={userId} activeUsers={activeUsers} handleClose={handleClose}/>
            </Box>
        </Modal>
    );
}
