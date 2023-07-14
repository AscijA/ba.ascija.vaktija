import React, { useState, useEffect } from 'react';
import style from "./MainContainer.module.css";
import PrayerItem from './PrayerItem/PrayerItem.jsx';

// import Intl from 'intl';
// import 'intl/locale-data/jsonp/bs-Latn-BA';
// import 'intl/locale-data/jsonp/en';

import { labels, getVaktijaData, generateTimePhrase, findTimeIndex } from '../util.js';

const MainContainer = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [location, setLocation] = useState("Graz");
  const [data, setData] = useState([]);

  useEffect(() => {
    getVaktijaData(setData);
    // update clock every minute
    setInterval(() => setDateTime(oldDateTime => {
      const newDateTime = new Date();
      return newDateTime.getMinutes() != oldDateTime.getMinutes() ? newDateTime : oldDateTime;
    }), 1000);

    // update vaktija data every day
    setInterval(() => {
      const newDateTime = new Date();
      if (newDateTime.getDay() != dateTime.getDay()) {
        getVaktijaData(setData);
      }
    }, 60000);
  }, []);

  // const dateFormat = new Intl.DateTimeFormat('bs', { weekday: "long", day: 'numeric', month: 'long', year: 'numeric' });

  let clock = dateTime.toLocaleString('de', { hour: "2-digit", minute: "2-digit" }).toLocaleUpperCase();
  // let date = dateFormat.format(dateTime).toLocaleUpperCase();
  let date = dateTime.toLocaleString();
  let islamic = dateTime.toLocaleString('bs-u-ca-islamic', { day: "2-digit", calendar: "islamic" }).toLocaleUpperCase() + " " + dateTime.toLocaleString('en', { month: 'long', calendar: "islamic" }).toLocaleUpperCase();

  let list = [];
  const diffList = findTimeIndex(data);
  for (const key in data) {
    const timePhrase = generateTimePhrase(diffList.diff[key]);
    list.push(<PrayerItem key={ key } prayerName={ labels.prayers[key] } prayerTime={ data[key] } timePhrase={ timePhrase } isCurrent={ diffList.index == key } />);
  }
  return (
    <div className={ style.mainContainer }>
      <div className={ style.title }>Vaktija - { location }</div>
      <div className={ style.clock }>{ clock }</div>
      <div className={ style.date }>{ date }</div>
      <div className={ `${style.date} ${style.border}` }>{ islamic }</div>
      { list }

    </div>
  );
};

export default MainContainer;