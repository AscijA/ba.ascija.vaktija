import React, { useState, useEffect } from 'react';
import style from "./MainContainer.module.css";
import PrayerItem from './PrayerItem/PrayerItem.jsx';
import DateTime from './DateTime/DateTime.jsx';

import { labels, getVaktijaData, generateTimePhrase, findTimeIndex, getSettings, saveSettings } from '../util.js';
import { event } from '@tauri-apps/api';

const MainContainer = () => {
  const [settings, setSettings] = useState(getSettings());
  const [location, setLocation] = useState(settings.location);
  const [data, setData] = useState([]);

  /**
   * Update settings state 
   * @param {event} event 
   */
  const handleLocationChange = (event) => {
    const { name, value } = event.target;
    setSettings((prevSettings) => ({ ...prevSettings, [name]: value }));
    setLocation(value);
  };

  /**
   * Save settings to local storage
   */
  const handleSave = () => {
    saveSettings(settings);
    getVaktijaData(setData, location);
  };

  useEffect(() => {
    getVaktijaData(setData, location);
  }, []);

  let list = [];
  const diffList = findTimeIndex(data);
  for (const key in data) {
    let timePhrase = generateTimePhrase(diffList.diff[key]);
    list.push(<PrayerItem key={ key } prayerName={ labels.prayers[key] } prayerTime={ data[key] } timePhrase={ timePhrase } isCurrent={ diffList.index == key } />);
  }
  return (
    <div className={ style.mainContainer }>

      <div className={ style.title }><input className={ style.titleLocation } type="text" name="location" id="loc" value={location} onChange={ handleLocationChange } onBlur={ handleSave } /></div>
      <DateTime getVaktijaData={ () => { getVaktijaData(setData, location); } } />
      { list }
    </div>
  );
};

export default MainContainer;