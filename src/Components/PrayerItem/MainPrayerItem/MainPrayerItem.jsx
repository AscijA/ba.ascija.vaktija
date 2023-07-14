import React from 'react';
import style from "./MainPrayerItem.module.css";

export default function MainPrayerItem(props) {
  return (
    <div className={ style.mainPrayerItem }>
      <div className={ style.prayerName }>{ props.prayerName }:</div>
      <div className={ style.prayerTime }>{ props.prayerTime.slice(0, -3) }</div>
    </div>
  );
}
