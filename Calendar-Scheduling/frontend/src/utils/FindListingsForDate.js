import React from 'react';

const findListingsForDate = (date, allListings) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate(); 

    // Construct the hash key combining year, month, and day
    const hashKey = `${year}-${month}-${day}`;

    if (allListings && allListings[hashKey]) {
        return allListings[hashKey];
    }

    // No events for the date
    return null;
}

export { findListingsForDate }; 
