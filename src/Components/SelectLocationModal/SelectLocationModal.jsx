
import React, { useState, useEffect } from "react";
import style from "./SelectLocationModal.module.css";

const SelectLocationModal = (props) => {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(props.settings.selectedCountry);
  const [selectedCity, setSelectedCity] = useState(props.settings.location);


  useEffect(() => {
    /**
     * Loads the list of countries and cities from a json file
     */
    const loadCountryList = async () => {
      try {
        const response = await fetch("src/assets/countryList.json");
        const data = await response.json();
        setCountryList(data.countryList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    loadCountryList();
  }, []);

  /**
   * Update selectedCountry and set selectedCity to first city from the selected country
   * @param {event} e : event object from select tag
   */
  const handleCountryChange = (e) => {
    let listIndex = parseInt(e.target.value);
    setSelectedCountry(listIndex);
    setSelectedCity(countryList[listIndex - 1].locations[0].name);
  };

  /**
   * Update selected city
   * @param {event} e 
   */
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  /**
   * Close the modal and update location and settings in parent component
   */
  const handleSave = () => {
    props.setShowModal();
    props.setSettings(selectedCity, selectedCountry);
  };

  /**
   * Close the modal and revert local state
   */
  const handleCancle = () => {
    props.setShowModal();
    setSelectedCity(props.settings.location);
    setSelectedCountry(props.settings.selectedCountry);

  };
  return (
    <div className={ props.showModal ? style.backdrop : "" }>
      { props.showModal && (
        <div className={ style.modal }>
          <div className={ style.modalContent }>
            <div className={ style.item }>

              <h4 className={ style.country }>Država</h4>
              <select className={ style.dropdown } value={ selectedCountry } onChange={ handleCountryChange }>
                { countryList.map((country) => {
                  // console.log(selectedCountry);
                  return <option key={ country.id } value={ country.id }>
                    { country.name.toUpperCase() }
                  </option>;
                }
                ) }
              </select>
            </div>

            <div className={ style.item }>

              <h4>Grad</h4>
              <select className={ style.dropdown } value={ selectedCity } onChange={ handleCityChange }>
                { countryList[selectedCountry - 1].locations.map((location) => {
                  // console.log(selectedCity);
                  return <option key={ location.id } value={ location.name }>
                    { location.name.toUpperCase() }
                  </option>;
                }
                ) }
              </select>
            </div>
            <div className={ style.buttonContainer }>
              <div onClick={ handleSave } className={ `${style.save} ${style.modalButton}` }>Save</div>
              <div onClick={ handleCancle } className={ `${style.cancle} ${style.modalButton}` }>Cancle</div>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
};


export default SelectLocationModal;