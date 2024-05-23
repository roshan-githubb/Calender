import * as React from 'react';
import axios from 'axios';
import { useState } from 'react';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { Button } from '@mui/material';
import { Box } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import MultipleSelect from './MultipleSelect';
import dayjs from 'dayjs';

function Label({ componentFunction, valueType }) {
    const content = (
        <span>
            <strong>{componentFunction}</strong>
        </span>
    );

    return content;
}

export default function TimePickerComponent({ timeZone, value, userId, activeUsers, handleClose }) {

    const [selectedStartTime, setSelectedStartTime] = useState(value);
    const [selectedEndTime, setSelectedEndTime] = useState(value);

    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('')

    const [participants, setParticipants] = useState([userId]);

    const [error, setError] = useState(false); 

    const [errorMessage, setErrorMessage] = useState('');

    const [interactionCheck, setInteractionCheck] = useState(false)

    const handleEventTitleChange = (event) => {
        setEventTitle(event.target.value)
    }

    const handleEventDescriptionChange = (event) => {
        setEventDescription(event.target.value)
    }

    const handleStartTimeChange = (time) => {
        const year = value.getFullYear();
        const month = value.getMonth();
        const day = value.getDate();
        const hours = time.$d.getHours();
        const minutes = time.$d.getMinutes();
        const startTime = new Date(year, month, day, hours, minutes);
        if (startTime < selectedEndTime) {
            setError(false);
            setSelectedStartTime(startTime);
        } else if (startTime === selectedEndTime) {
            setError(true);
            setSelectedStartTime(startTime);
            setErrorMessage('Cannot start and end at the same time')
        } else {
            setError(true);
            setSelectedStartTime(startTime);
            setErrorMessage('End time cannot be before start time')
        }
    };

    const handleEndDateChange = (time) => {
        const selectedEndDate = time.$d;
        const selectedEndMonth = selectedEndDate.getMonth();
        const selectedEndDateOfMonth = selectedEndDate.getDate();
        const selectedStartMonth = selectedStartTime.getMonth();
        const selectedStartDateOfMonth = selectedStartTime.getDate();

        if (
            selectedEndMonth < selectedStartMonth ||
            (selectedEndMonth === selectedStartMonth && selectedEndDateOfMonth < selectedStartDateOfMonth)
        ) {
            setError(true);
            setErrorMessage('End date cannot be before start date')
        } else {
            setError(false);
        }

        updateEndDateChange(new Date(selectedEndDate.getFullYear(), selectedEndMonth, selectedEndDateOfMonth))
    };

    const updateEndDateChange = (timeStamp) => {
        if (timeStamp !== null) {
            setSelectedEndTime(prevSelectedEndTime => {
                const newEndTime = new Date(prevSelectedEndTime);

                newEndTime.setFullYear(timeStamp.getFullYear(), timeStamp.getMonth(), timeStamp.getDate())
                newEndTime.setMonth(timeStamp.getMonth())

                newEndTime.setDate(timeStamp.getDate())

                return newEndTime;
            });
        }
    }

    const handleEndTimeChange = (time) => {
        setInteractionCheck(true);
        if (time !== null) {
            setSelectedEndTime(prevSelectedEndTime => {
                const newEndTime = new Date(prevSelectedEndTime);
                const hours = time.$H;
                const minutes = time.$m;
                const seconds = time.$s;

                newEndTime.setHours(hours, minutes, seconds);

                if (newEndTime <= selectedStartTime) {
                    setError(true)
                    setErrorMessage('End time cannot be before start time')
                } else {
                    setError(false)

                }
                return newEndTime;
            });
        }
    };


    const handleMultiSelectChange = (event) => {
        const {
            target: { value },
        } = event;
        setParticipants(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const addEventToDatabase = async () => {
        let adjustedStartTime = selectedStartTime;
        let adjustedEndTime = selectedEndTime;
    
        if (timeZone === 'UTZ') {
            const { year, month, day, hours, minutes } = extractDateComponents(selectedStartTime);
    
            adjustedStartTime = new Date(Date.UTC(year, month - 1, day, hours, minutes));
    
            const { year: endYear, month: endMonth, day: endDay, hours: endHours, minutes: endMinutes } = extractDateComponents(selectedEndTime);
            adjustedEndTime = new Date(Date.UTC(endYear, endMonth - 1, endDay, endHours, endMinutes));
        }
    
        const eventData = {
            userId: userId,
            title: eventTitle,
            startTime: adjustedStartTime,
            endTime: adjustedEndTime,
            description: eventDescription,
            participants: participants
        };
    
        try {
            const response = await axios.post('http://localhost:8080/events/create-new-event', eventData);
            if (response.status === 201) {
                handleClose();
            }
        } catch (err) {
            console.log('error', err);
        }
    }
    
    function extractDateComponents(dateString) {
        const date = new Date(dateString);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours(),
            minutes: date.getMinutes()
        };
    }


    return (
        <div>
            <div style={{ paddingBottom: '30px' }}>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="eventTitle"
                        label="Event Title"
                        name="eventTitle"
                        autoFocus
                        onChange={handleEventTitleChange}
                    /></Box>

                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="eventDescription"
                        label="Event Description"
                        name="eventDescription"
                        autoFocus
                        onChange={handleEventDescriptionChange}
                    /></Box>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={[
                            'TimePicker'
                        ]}
                    >
                        <DemoItem label={<Label componentFunction="Set start time:" valueType="time" />}>
                            <TimePicker onChange={handleStartTimeChange} defaultValue={dayjs(selectedStartTime)}
                            />
                        </DemoItem>
                    </DemoContainer>

                    <DemoContainer
                        components={[
                            'DatePicker',
                            'TimePicker'
                        ]}
                    >
                        <DemoItem
                            label={<Label componentFunction="Set end month and day:" valueType="date" />}
                        >
                            <DatePicker
                                onChange={handleEndDateChange}
                                defaultValue={dayjs(selectedStartTime)}
                                className={error ? 'Mui-error-created' : ''}
                            />
                        </DemoItem>
                        <DemoItem label={<Label componentFunction="Set meeting end time" valueType="time" />}>
                            <TimePicker onChange={handleEndTimeChange} />
                        </DemoItem>
                    </DemoContainer>

                </LocalizationProvider>
                <MultipleSelect activeUsers={activeUsers} handleChange={handleMultiSelectChange} participants={participants} />

            </div>
            <div>

                <Tooltip open={!interactionCheck || eventTitle.length < 1 || eventDescription.length < 1}
                    title="Please fill out all details"
                    placement="bottom"
                >
                    <Button variant="contained"
                        onClick={addEventToDatabase}
                        disabled={error || !interactionCheck || eventTitle.length < 1 || eventDescription.length < 1}>Add event to calendar</Button>
                </Tooltip>

            </div>
            <div>
                <Snackbar
                    open={error}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                >
                    <SnackbarContent style={{ background: '#cc0000' }} message={errorMessage} />

                </Snackbar>
            </div>
        </div>
    );
}
