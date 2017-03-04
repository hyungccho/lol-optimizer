import React from 'react'
import AppBar from 'material-ui/AppBar'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { connect } from 'react-redux'

class AdminTopNav extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
     <MuiThemeProvider>
      <AppBar style={{ backgroundColor:"#F4F3EF", color: "grey" }}>
        <h3 className="current-section">{ this.props.currentSection }</h3>
        <img className="setting-cog" src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/WMF-Agora-Settings_808080.svg/2000px-WMF-Agora-Settings_808080.svg.png"/>
      </AppBar>
    </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return(
    { currentSection: state.section.currentSection }
  )}





export default connect (mapStateToProps)(AdminTopNav);
