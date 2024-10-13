import React from 'react';

const CharLabel = (props) => {
  return (
    <div>
      <label>
        {props.fieldname}
        <input name={props.fieldname} />
      </label>
    </div>
  );
};

export default CharLabel;
