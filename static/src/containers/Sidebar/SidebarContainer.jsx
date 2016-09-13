import React from 'react';
import { connect } from 'react-redux';
import { toggleSidebarVisibility, setSidebarTab } from './actions';
import SidebarContent from '../../components/Sidebar/SidebarContent';
import SidebarNavMenu from '../../components/Sidebar/SidebarNavMenu';
import { START_METRONOME_AT_MOUNT } from '../../constants';
import { startMetronome, setStartedMetronomeAtMount } from '../Metronome/actions';
import { setUpMIDIDevices } from '../Midi/actions';

const propTypes = {
  isVisible: React.PropTypes.bool,
  activeTab: React.PropTypes.string,
  bottomArrowPosition: React.PropTypes.number,
  toggleSidebarVisibility: React.PropTypes.func,
  setSidebarTab: React.PropTypes.func,
  startMetronome: React.PropTypes.func,
  setStartedMetronomeAtMount: React.PropTypes.func,
  setUpMIDIDevices: React.PropTypes.func,
};


class Sidebar extends React.Component {
  componentDidMount() {
    if (START_METRONOME_AT_MOUNT) {
      this.props.startMetronome();
    }
    this.props.setUpMIDIDevices(); // Prepare midi stuff
  }

  render() {
    const sidebarClassName = `sidebar${(this.props.isVisible) ? ' active' : ''}`;
    return (
      <aside>
        <div className={sidebarClassName}>
          <SidebarContent activeTab={this.props.activeTab} />
          <SidebarNavMenu
            activeTab={this.props.activeTab}
            setSidebarTab={this.props.setSidebarTab}
            toggleSidebarVisibility={this.props.toggleSidebarVisibility}
            isSidebarVisible={this.props.isVisible}
            bottomArrowPosition={this.props.bottomArrowPosition}
          />
        </div>
      </aside>
    );
  }
}

const mapStateToProps = state => state.sidebar;

Sidebar.propTypes = propTypes;
export default connect(mapStateToProps, {
  toggleSidebarVisibility,
  setSidebarTab,
  startMetronome,
  setStartedMetronomeAtMount,
  setUpMIDIDevices,
})(Sidebar);
