import React from 'react';

export default (title, TabContent) => (props) => (
  <div>
    <header><h1>{title}</h1></header>
    <TabContent {...props} />
  </div>
);
