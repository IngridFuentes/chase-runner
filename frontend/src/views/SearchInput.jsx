import React from "react";
import Select from "react-select";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import styles from "../styles/Map.module.css";

const SearchInput = ({
  cityName,
  setCityName,
  data,
  filteredData,
  setFilteredData,
  isDropdownVisible,
  setIsDropdownVisible,
  inputRef,
  selectedMarathonType,
  handleMarathonType,
  marathonTypeOptions,
}) => {
  const handleChange = (e) => {
    const searchWord = e.target.value;
    setCityName(e.target.value);
    if (searchWord.trim() === "") {
      setFilteredData([]);
      setIsDropdownVisible(false);
      return;
    }

    if (data && data.features && data.features.length > 0) {
      const newFilter = data.features.filter((value) => {
        return (
          value.properties.city
            ?.toLowerCase()
            .includes(searchWord.toLowerCase()) &&
          value.properties.state
            ?.toLowerCase()
            .includes(searchWord.toLowerCase()) &&
          value.properties.country
            ?.toLowerCase()
            .includes(searchWord.toLowerCase())
        );
      });
      setFilteredData(newFilter);
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchInput}>
        <input
          ref={inputRef}
          type="text"
          className={styles.inputField}
          placeholder="Search by City"
          value={cityName}
          onChange={handleChange}
        />
        <div className={styles.searchIcon}>
          {cityName === "" ? (
            <SearchIcon className={styles.searchIcon} />
          ) : (
            <CloseIcon
              onClick={() => setCityName("")}
              className={styles.closeIcon}
            />
          )}
        </div>
      </div>

      {data.features !== undefined && isDropdownVisible && (
        <div className={styles.dropdown}>
          {data.features.map((d, index) => (
            <div key={index} className={styles.dropdownRow}>
              <div
                onClick={() => setIsDropdownVisible(false)}
                className={styles.list}
              >
                {d.properties.city}, {d.properties.state},{" "}
                {d.properties.country}, {d.properties.formatted}
              </div>
              <div className={styles.marathonTypeDropdown}>
                <Select
                  options={marathonTypeOptions}
                  isSearchable={false}
                  value={selectedMarathonType[index]}
                  onChange={(value) => handleMarathonType(index, value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
