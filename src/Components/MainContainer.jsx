import React, { useState, useEffect, Fragment } from 'react';
import style from "./MainContainer.module.css";
import PrayerItem from './PrayerItem/PrayerItem.jsx';
import DateTime from './DateTime/DateTime.jsx';

import { labels, getVaktijaData, generateTimePhrase, findTimeIndex, getSettings, saveSettings } from '../util.js';
import { event } from '@tauri-apps/api';
import SelectLocationModal from './SelectLocationModal/SelectLocationModal';

const MainContainer = () => {
  const [settings, setSettings] = useState(getSettings());
  const [location, setLocation] = useState(settings.location);
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);


  /*------------------------*/
  /*---- Hooks -------------*/
  /*------------------------*/

  /**
   * Load prayer times on first render
   */
  useEffect(() => {
    getVaktijaData(setData, location);
  }, []);

  /**
   * Update prayer times on location change
   */
  useEffect(() => {
    getVaktijaData(setData, location);
  }, [location]);

  /**
   * Save settings to local storage
   */
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  /*------------------------*/
  /*------------------------*/

  /*------------------------*/
  /*---- Handlers ----------*/
  /*------------------------*/

  /**
   * Toggle modal visibility
   */
  const handleToggleModal = () => {
    setShowModal(!showModal);
  };

  /**
   * Update states on save from modal
   * @param {string} selectedCity : name of the city
   * @param {number} selectedCountry : index in the CountryList.json array  
   */
  const handleSave = (selectedCity, selectedCountry) => {
    setSettings((prevSettings) => ({ ...prevSettings, location: selectedCity, selectedCountry: selectedCountry }));
    setLocation(selectedCity);
  };
  /*------------------------*/
  /*------------------------*/

  let list = [];
  const diffList = findTimeIndex(data);
  for (const key in data) {
    let timePhrase = generateTimePhrase(diffList.diff[key]);
    list.push(<PrayerItem key={ key } prayerName={ labels.prayers[key] } prayerTime={ data[key] } timePhrase={ timePhrase } isCurrent={ diffList.index == key } />);
  }
  return (
    <Fragment>
      <div className={ style.mainContainer }>

        <div className={ style.title } onClick={ handleToggleModal }> { location }  </div>

        <DateTime getVaktijaData={ () => { getVaktijaData(setData, location); } } />
        { list }
      </div>
      <SelectLocationModal showModal={ showModal } setShowModal={ handleToggleModal } setSettings={ handleSave } settings={ settings } />
    </Fragment>
  );
};

export default MainContainer;