import React from 'react';
import style from "./PrayerItem.module.css";
import MainPrayerItem from './MainPrayerItem/MainPrayerItem.jsx';
import SecondaryPrayerItem from './SecondaryPrayerItem/SecondaryPrayerItem.jsx';

export default function PrayerItem(props) {
  const styleClass = props.isCurrent ? `${style.prayerItem} ${style.currentPrayer}` : style.prayerItem;
  return (
    <div className={ styleClass }>
      <MainPrayerItem prayerName={ props.prayerName } prayerTime={ props.prayerTime } />
      <SecondaryPrayerItem timePhrase={ props.timePhrase } />
    </div>
  );
}
