import React from 'react';
import style from "./SecondaryPrayerItem.module.css";

export default function SecondaryPrayerItem(props) {
  return (
    <div className={style.timePhrase}>{ props.timePhrase }</div>
  );
}
