import React from 'react';
import './Sidebar.scss';
import baseTab from './BaseTab';

function InfoTab() {
  return (
    <div>
      <section>
        <p className="info-paragraph">
          Freesound Explorer is a visual interface for exploring Freesound content
          in a 2-dimensional space and create music at the same time :)
        </p>
      </section>
      <section>
        <p className="info-paragraph">
          Please, <a href="https://github.com/ffont/freesound-explorer#tutorialhow-to-use" target="_blank">
          check this tutorial</a> to learn how Freesound Explorer works.
        </p>
      </section>
      <section>
        <p className="info-paragraph">
          Freesound Explorer has been developed (so far) by Frederic Font and Giuseppe Bandiera at the
          Music Technology Group, Universitat Pompeu Fabra. You can find the <a href="https://github.com/ffont/freesound-explorer" target="_blank">
            source code here</a>.
        </p>
      </section>
    </div>
  );
}

export default baseTab('About...', InfoTab);
