import React from 'react';
import '../../stylesheets/Bottombar.scss';

const propTypes = {
  isVisible: React.PropTypes.bool,
  isSidebarVisible: React.PropTypes.bool,
};

function Bottombar(props) {
  let bottombarClassName = `bottombar${(props.isSidebarVisible) ? ' active ' : ' '}`;
  bottombarClassName += `${(props.isSidebarVisible) ? ' small-width' : 'full-width'}`;
  bottombarClassName += `${(props.isVisible) ? ' ' : ' hidden'}`;
  return (
    <div className={bottombarClassName}>
      <div className="bottombar-content-wrapper">
        <div className="bottombar-horizontal-scroll">
        </div>
      </div>
      <div className="bottombar-menu-wrapper" />
    </div>
  );
}

Bottombar.propTypes = propTypes;
export default Bottombar;
