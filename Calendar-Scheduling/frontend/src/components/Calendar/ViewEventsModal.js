import * as React from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { Button } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function ViewEventModal({ userId, open, selectedDate, handleClose, eventsOnDate, openAddEventModal, selectedEditModal }) {

    const editButtonClicked = (eventId) => {
        selectedEditModal(eventId)
    }

    const deleteButtonClicked = async (eventId) => {
        try {
            await axios.delete(`http://localhost:8080/events/delete-event?id=${eventId}`);

        } catch (err) {
            console.log('error', err);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {(selectedDate.toDateString())}
                </Typography>
                <Typography id="modal-modal-description" component={"span"}>
                    {eventsOnDate !== null ? (
                        <List sx={{ maxWidth: 1200, bgcolor: 'background.paper' }} dense>
                            {eventsOnDate.map(event => (
                                <ListItem key={event.id} className="custom-list-item">
                                    <ListItemText primary="Title" secondary={event.title} />
                                    <ListItemText primary="Start Time" secondary={event.startTime} />
                                    <ListItemText primary="End Time" secondary={event.endTime} />

                                    <ListItemText primary="Description" secondary={event.description} />
                                    {userId === event.userId ?
                                        <>
                                            <ListItemButton onClick={() => editButtonClicked(event.id)}>
                                                <Button variant='contained'>EDIT</Button>
                                            </ListItemButton>
                                            <ListItemButton onClick={() => deleteButtonClicked(event.id)}>
                                                <Button variant='contained' color="error">DELETE</Button>
                                            </ListItemButton>
                                        </>

                                        : ''}
                                </ListItem>
                            ))}
                        </List>


                    ) : (
                        <Typography component="span" variant="body1">No events on this date</Typography>
                    )}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', '& > :not(style)': { m: 1 } }}>
                    <Fab size="medium" color="secondary" aria-label="add" onClick={openAddEventModal}>
                        <AddIcon />
                    </Fab>
                </Box>
            </Box>
        </Modal>
    );
}
