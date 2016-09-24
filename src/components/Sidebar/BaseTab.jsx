import React from 'react';

export default (title, TabContent) => (props) => (
  <div>
    <header><h1>{title}</h1></header>
    <div className="sidebar-vertical-scroll">
      <TabContent {...props} />
    </div>
  </div>
);
