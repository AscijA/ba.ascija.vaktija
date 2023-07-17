import React, { Fragment, useEffect, useState } from 'react';
import style from "./DateTime.module.css";
import Intl from 'intl';
import 'intl/locale-data/jsonp/bs-Latn-BA';
import 'intl/locale-data/jsonp/en';

const DateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());
  useEffect(() => {

    // update vaktija data every day
    setInterval(() => {
      const newDateTime = new Date();
      if (newDateTime.getDay() != dateTime.getDay()) {
        props.getVaktijaData();
      }
    }, 60000);

    // update clock every minute
    setInterval(() => setDateTime(oldDateTime => {
      const newDateTime = new Date();
      return newDateTime.getMinutes() != oldDateTime.getMinutes() ? newDateTime : oldDateTime;
    }), 1000);
  }, []);


  const dateFormat = new Intl.DateTimeFormat('bs', { weekday: "long", day: 'numeric', month: 'long', year: 'numeric' });

  let clock = dateTime.toLocaleString('de', { hour: "2-digit", minute: "2-digit" }).toLocaleUpperCase();
  let date = dateFormat.format(dateTime).toLocaleUpperCase();
  let islamic = dateTime.toLocaleString('bs-u-ca-islamic', { day: "2-digit", calendar: "islamic" }).toLocaleUpperCase() + " " + dateTime.toLocaleString('en', { month: 'long', calendar: "islamic" }).toLocaleUpperCase();

  return (
    <Fragment>
      <div className={ style.clock }>{ clock }</div>
      <div className={ style.date }>{ date }</div>
      <div className={ `${style.date} ${style.border}` }>{ islamic }</div>
    </Fragment>
  );
};

export default DateTime;