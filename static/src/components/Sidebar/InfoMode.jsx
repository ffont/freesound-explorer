import React from 'react';
import '../../stylesheets/Sidebar.scss';

const propTypes = {
  isActiveMode: React.PropTypes.bool,
};

function InfoMode(props) {
  return (
    <div className={(props.isActiveMode) ? 'mode-active' : 'mode-inactive'}>
      <h1>About...</h1>
      <p>
        Freesound Explorer is a visual interface for exploring Freesound content in a 2-dimensional
        space and for creating music :)
      </p>
      <p>
        Freesound Explorer is developed by Frederic Font and Giuseppe Bandiera at the
        Music Technology Group, Universitat Pompeu Fabra.
      </p>
    </div>
  );
}

InfoMode.propTypes = propTypes;
export default InfoMode;
