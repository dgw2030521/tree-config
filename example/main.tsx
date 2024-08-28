import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import SliderDatePicker from '../src/index';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <div style={{ width: 1200 }}>
    <SliderDatePicker
      // dateValue={dayjs().format('YYYY-MM-DD')}
      dateValue="2024-07-02"
      onChangeCallback={mdate => {
        console.log(mdate.format('YYYY-MM-DD'));
        alert(mdate.format('YYYY-MM-DD'));
      }}
    >
      <span>这里是标题</span>
    </SliderDatePicker>
  </div>,
);
