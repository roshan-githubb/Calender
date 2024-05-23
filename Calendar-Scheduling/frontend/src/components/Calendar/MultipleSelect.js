import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect( {activeUsers, handleChange, participants} ) {
  return (
    <div>
      <div style={{marginTop: '20px', marginBottom: '10px'}}>Select Participants:</div>
      <FormControl fullWidth>
        <InputLabel id="demo-multiple-name-label">Ids:</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          label="userId"
          value={participants}
          onChange={handleChange}
          MenuProps={MenuProps}
        >
          {activeUsers.map((name) => (
            <MenuItem
              key={name}
              value={name}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}