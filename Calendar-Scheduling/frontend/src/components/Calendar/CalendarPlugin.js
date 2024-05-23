import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import ViewEventModal from './ViewEventsModal';
import { findListingsForDate } from '../../utils/FindListingsForDate';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';

const CalendarPlugin = ({ timeZone, socket, allEvents, activeUsers, holidayData }) => {

    const [viewEventModalState, setViewEventModalState] = useState(false);
    
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [viewAddEventModalState, setViewAddEventModalState] = useState(false);

    const [viewEditEventModalState, setViewEditEventModalState] = useState(false);

    const [selectedEventData, setSelectedEventData] = useState();

    const handleOpenViewEventModal = () => {
        setViewEventModalState(true);
    };

    const handleCloseViewEventModal = () => {
        setViewEventModalState(false);
    };

    const onDateSelection = (selectedDate) => {
        setSelectedDate(selectedDate);
        handleOpenViewEventModal();
    }

    const handleOpenAddEventModal = () => {
        handleCloseViewEventModal();
        setViewAddEventModalState(true)
    }

    const handleCloseAddEventModal = () => {
        setViewAddEventModalState(false)
    }

    const selectedEditModal = (eventId) => {
        const eventIds = Object.keys(allEvents);

        for (const id of eventIds) {
            const eventsArray = allEvents[id];

            for (const event of eventsArray) {
                if (event.id === eventId) {
                    setSelectedEventData(event)
                    setViewEventModalState(false);
                    setViewEditEventModalState(true);
                    return;
                }
            }
        }

        console.log('Event not found with ID:', eventId);
    };

    const handleCloseEditEventModal = () => {
        setViewEditEventModalState(false);
    }

    const tileContent = ({ date }) => {
        const eventsOnDate = findListingsForDate(date, allEvents);
        let holidayInfoToDisplay = [];
    
        if (eventsOnDate !== null && eventsOnDate.length > 0) {
            return eventsOnDate.map(event => (
                <div key={event.id} className="event-content">
                    {event.title}
                </div>
            ));
        }
    
        if (holidayData) {
            const holidayNames = getHolidayNames(date);
            if (holidayNames.length > 0) {
                holidayInfoToDisplay = holidayNames.map(name => (
                    <div key={name} className="holiday-content">
                        {name}
                    </div>
                ));
            }
        }
    
        return holidayInfoToDisplay.length > 0 ? holidayInfoToDisplay : null;
    }
    
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding leading zero if necessary
        const day = String(date.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`;
    }
    
    function getHolidayNames(date) {
        const formattedDate = formatDate(date);
        const holidays = holidayData.filter(holiday => holiday.date === formattedDate);
        return holidays.map(holiday => holiday.name);
    }
    

    return (
        <div className="Calendar__container">
            <main className="Calendar__container__content">
                <Calendar onChange={onDateSelection} tileContent={tileContent} calendarClassName="custom-calendar"
                />
            </main>
            <div className="modalWhenTileClicked">
                <ViewEventModal
                    userId={socket.id}
                    open={viewEventModalState}
                    selectedDate={selectedDate}
                    handleClose={handleCloseViewEventModal}
                    eventsOnDate={findListingsForDate(selectedDate, allEvents)}
                    openAddEventModal={handleOpenAddEventModal}
                    selectedEditModal={selectedEditModal}
                />
            </div>
            <div className="modalWhenAddEventClicked">
                <AddEventModal
                    timeZone={timeZone}
                    open={viewAddEventModalState}
                    handleClose={handleCloseAddEventModal}
                    selectedDate={selectedDate}
                    userId={socket.id}
                    activeUsers={activeUsers}
                />
            </div>
            <div className="modalWhenEditEventClicked">
                <EditEventModal
                    timeZone={timeZone}
                    open={viewEditEventModalState}
                    handleClose={handleCloseEditEventModal}
                    prevData={selectedEventData}
                    userId={socket.id}
                    activeUsers={activeUsers}
                />
            </div>
        </div>
    )
}

export default CalendarPlugin;
