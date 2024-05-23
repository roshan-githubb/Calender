import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TimePickerComponentEdit from './TimePickerComponentEdit';


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

export default function EditEventModal({ timeZone, open, handleClose, prevData, userId, activeUsers }) {

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <h3>Edit event with title </h3>
                <TimePickerComponentEdit timeZone={timeZone} prevData={prevData} userId={userId} activeUsers={activeUsers} handleClose={handleClose}/>

            </Box>
        </Modal>
    );
}
