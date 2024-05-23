import './App.css';
import 'react-calendar/dist/Calendar.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import BottomMessageBar from './components/BottomMessageBar';
import CalendarPlugin from './components/Calendar/CalendarPlugin';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const socket = io('/');

const App = () => {

  const [bottomMessageBar, setBottomMessageBar] = useState({ open: false, message: '', messageType: '' });
  const [allEvents, setAllEvents] = useState();
  const [activeUsers, setActiveUsers] = useState([]);
  const [timeZone, setTimeZone] = useState('LTZ');

  const [allEventsLocal, setAllEventsLocal] = useState();
  const [allEventsUtc, setAllEventsUtc] = useState();

  const [holidayData, setHolidayData] = useState();


  useEffect(() => {

    socket.on('new-user-connected', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'positiveMessage' });
    });

    socket.on('current-active-users', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'positiveMessage' });
    });

    socket.on('events-by-date-local', (data) => {
      setAllEventsLocal(data)
    })

    socket.on('events-by-date-utc', (data) => {
      setAllEventsUtc(data)
    })

    socket.on('set-active-users', (data) => {
      setActiveUsers(data);
    });

    socket.on('holiday-data', (data) => {
      setHolidayData(data);
    })

    socket.on('new-event-created', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'positiveMessage' });
    })

    socket.on('event-conflict', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'negativeMessage' });
    })

    socket.on('event-deleted', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'negativeMessage' });
    })

    socket.on('event-edited', (data) => {
      setBottomMessageBar({ open: true, message: data, messageType: 'positiveMessage' });
    })

    return () => {
      if (socket.readyState === 1) {
        socket.disconnect();
      }
    }
  }, []);


  useEffect(() => {
    if (timeZone === 'UTZ') {
      setAllEvents(allEventsUtc)
    } else {
      setAllEvents(allEventsLocal)
    }
  }, [timeZone, allEventsLocal])

  const handleCloseMessageBar = () => {
    setBottomMessageBar({ ...bottomMessageBar, open: false });
  };

  const handleTimeZoneChange = (event) => {
    setTimeZone(event.target.value)
  }

  return (
    <div className='App'>
      <div className="SelectTimeZone">
        <FormControl>
          <FormLabel id="select-time-zone">Time Zone:</FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            value={timeZone}
            name="radio-buttons-group"
            onChange={handleTimeZoneChange}
          >
            <FormControlLabel value="LTZ" control={<Radio />} label="Local Time Zone" />
            <FormControlLabel value="UTZ" control={<Radio />} label="UTC Time Zone" />
          </RadioGroup>
        </FormControl>
      </div>
      <div className='Calendar'>
        <CalendarPlugin timeZone={timeZone}
          socket={socket}
          allEvents={allEvents}
          activeUsers={activeUsers}
          holidayData={holidayData} />
      </div>
      <div className='bottom-message-bar'>
        <BottomMessageBar open={bottomMessageBar.open}
          message={bottomMessageBar.message}
          messageType={bottomMessageBar.messageType}
          handleClose={handleCloseMessageBar}
        />
      </div>
    </div>
  );
}

export default App;
