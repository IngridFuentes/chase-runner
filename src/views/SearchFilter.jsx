import React from 'react';

const SearchFilter = ({value, onChange}) => {
    return(
        <form >
            <label>
                <input input="text" placeholder="Search By State" value={value} onChange={(e) => onChange(e.target.value)}/>
                <br/>
                <br/>
            </label>
           
        </form>
    );
};

export default SearchFilter;