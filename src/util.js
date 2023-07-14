import { invoke } from '@tauri-apps/api/tauri';
// const invoke = window.__TAURI__.invoke

// Default Labels 
let labels = {
  prayers: [
    "Zora",
    "Iz. Sunca",
    "Podne",
    "Ikindija",
    "Aksam",
    "Jacija"],
  prayerNext: "za",
  prayerPrev: "prije",
  hour1: "sat",
  hour2: "sati",
  hour3: "sata",
  connectionError: "No Iternet Connection",
  timeLabelFirstPrev: true,
  timeLabelFirstNext: true
};

/***
*  Due to the lack of exposed endpoint of vaktija.eu for prayer times, complete HTML file is loaded
* 
* @param {callback} setterFunction : function that will update some data
*/
const getVaktijaData = async (setterFunction) => {
  invoke('make_http_request', { url: 'https://vaktija.eu/graz' }).then((message) => { setterFunction(extractDailyPrayers(message.body)); });
};

/**
*  Generates what the time phrase of a subitem should contain
* @return {string} timePhrase - Time Phrase to be rendered
*
*/
const generateTimePhrase = (diff) => {
  let timeDifference = diff;

  // determines which label for prev or next prayer should be shown
  let beforeAfter = timeDifference > 0 ? labels.prayerNext : labels.prayerPrev;

  // if less than 1 hour, time diff will be displayed in minutes
  let minOrHour = Math.abs(Math.abs(timeDifference) < 1 ? Math.round(timeDifference * 60) : Math.round(timeDifference));

  // determines if the time unit is minutes or hours, mainly written for bosnian translation
  timeDifference = Math.abs(timeDifference);
  let timeUnit = timeDifference < 1
    ? "min"

    /* START: This part is to be modified if the singular/plural is not shown correctly for your language */
    : Math.round(timeDifference) >= 5 && Math.round(timeDifference) <= 20
      ? labels.hour2
      : (Math.round(timeDifference) == 1 || (Math.round(timeDifference) == 21 && labels.hour2 != labels.hour3))
        ? labels.hour1
        : labels.hour3;
  /* END*/
  // determines if the time difference should be printed first
  let format = beforeAfter == labels.prayerNext ? labels.timeLabelFirstNext : labels.timeLabelFirstPrev;
  let timePhrase = format ? `${beforeAfter} ${minOrHour} ${timeUnit}` : `${minOrHour} ${timeUnit} ${beforeAfter}`;
  return timePhrase;
};

/***
 * Extracts Prayer times from an HTML String
 * 
 * @param {string} html: HTML String form which Prayer Times will be Extracted
 * @returns {array}: list of prayer times
*/
const extractDailyPrayers = (html) => {
  try {
    const startIndex = html.indexOf('"dailyPrayersRes":{') + 19;
    const endIndex = html.indexOf('},"cookiesRes"');
    const dailyPrayersData = html.slice(startIndex, endIndex);
    const dailyPrayersObject = JSON.parse('{' + dailyPrayersData + '}');

    const dailyPrayersArray = Object.values(dailyPrayersObject);

    return dailyPrayersArray;
  } catch (error) {
    return ["XX:XX", "XX:XX", "XX:XX", "XX:XX", "XX:XX", "XX:XX"];
  }
};

/**
 * Finds the index of the current prayer and returns remaining time until individual prayers
 *
 * @return {object} index: index of the current prayer, diff: remaining time
 */
const findTimeIndex = (data) => {
  let index = 0;
  let retVal = {
    index: 0,
    diff: [],
  };
  for (const salah in data) {
    const today = new Date();
    const date = new Date(`${today.toDateString()} ${data[salah]}`);
    let diff = (date - today) / (1000 * 60 * 60);
    retVal.diff.push(diff);
    if (today > date) {
      retVal.index = index;
    }
    index++;
  }
  return retVal;
};

// module.exports = { getVaktijaData, generateTimePhrase, extractDailyPrayers, findTimeIndex };
export { labels, getVaktijaData, generateTimePhrase, extractDailyPrayers, findTimeIndex };