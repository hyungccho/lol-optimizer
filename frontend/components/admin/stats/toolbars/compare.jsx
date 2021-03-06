import React from 'react'
import { connect } from 'react-redux'

// Grid
import { Grid, Row, Col } from 'react-styled-flexboxgrid'

// Material UI
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'

// Actions
import { fetchSlates, resetSlates } from 'actions/admin/slate_actions'
import { fetchStats, changeParams } from 'actions/admin/stat_actions'

// Plugins
import isEqual from 'lodash/isEqual'

const statTypeOptions = [
  { value: 'actual', label: 'Actual' },
  { value: 'predicted', label: 'Predicted' },
  { value: 'compare', label: 'Compare' }
]

class CompareToolbar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: ''
    }

    this.handleDateChange = this.handleDateChange.bind(this)
    this.changeSlateId = this.changeSlateId.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }
  
  componentWillReceiveProps (newProps) {
    newProps.date.setHours(0, 0, 0, 0)
    this.props.date.setHours(0, 0, 0, 0)

    if (!this.props.shouldFetch) {
      return
    }

    if (newProps.date != this.props.date) {
      return (
        this.props.fetchSlates({
          to: newProps.date.toString(),
          from: newProps.date.toString()
        })
      )
    }

    if (newProps.slateId != this.props.slateId) {
      return (
        this.props.fetchStats({
          stat_type: 'compare',
          slate_id: newProps.slateId
        })
      )
    }

    if (newProps.slates.length) {
      if (!isEqual(this.props.slates, newProps.slates)) {
        this.changeSlateId(null, null, newProps.slates[0].id)
      }
    } else {
      this.changeSlateId(null, null, 0)
    }
  }
  
  componentDidMount () {
    if (this.props.slates.length) {
      this.changeSlateId(null, null, this.props.slates[0].id)
    } else {
      if (this.props.shouldFetch) {
        let date = new Date()
        this.props.changeParams('date', new Date(date.setDate(date.getDate() - 1)))
      }
    }
  }
  
  componentWillUnmount () {
    this.props.resetSlates()
  }
  
  handleDateChange (e, date) {
    this.props.changeParams('date', date)
  }
  
  changeSlateId (e, key, slateId) {
    this.props.changeParams('slateId', slateId)
  }

  handleSearch (e, val) {
    e.preventDefault()
    this.setState({ searchText: val })
  }
  
  handleKeyDown (e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      this.props.triggerSearch(this.state.searchText)
    }
  }
  
  disableDatesInFuture (day) {
    return day.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)
  }
  
  parseDefaultDate () {
    let date = this.props.date

    if (date.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
      return new Date(date.setDate(date.getDate() - 1))
    } else {
      return this.props.date
    }
  }

  renderSlates () {
    if (this.props.slates.length) {
      return (
        this.props.slates.map((slate) => (
          <MenuItem
            value={ slate.id }
            primaryText={ slate.name }
            style={{ color: '#9EA3B4' }}
            key={ slate.id }
          />
        ))
      )
    } else {
      return <MenuItem value={ 0 } primaryText='No Slates Available' />
    }
  }

  render () {
    return (
      <Row start='xs'>
        <Col xs={ 12 }>
          <Row start='xs'>
            <DropDownMenu
              onChange={ this.props.changeStatType }
              value='compare'
              underlineStyle={{ display: 'none' }}
              labelStyle={{
                color: '#9EA3B4',
                border: '1px solid #9EA3B4',
                lineHeight: '40px',
                borderRadius: '200px',
                height: '40px'
              }}
              iconStyle={{ fill: '#9EA3B4', right: '5px', top: '1px', padding: 0, width: '40px', height: '40px' }}
              style={{ margin: '25px 0 0 25px' }}>
              {
                statTypeOptions.map((option, index) => (
                  <MenuItem
                    value={ option.value }
                    primaryText={ option.label }
                    style={{ color: '#9EA3B4' }}
                    key={ index }
                  />
                ))
              }
            </DropDownMenu>

            <DatePicker
              onChange={ this.handleDateChange }
              autoOk={ true }
              floatingLabelText="Date"
              defaultDate={ this.parseDefaultDate() }
              container="inline"
              style={{ height: '65px', margin: '5px 0 0 25px' }}
              shouldDisableDate={ this.disableDatesInFuture }
            />
          
            <DropDownMenu
              onChange={ this.changeSlateId }
              value={ this.props.slateId }
              underlineStyle={{ display: 'none' }}
              labelStyle={{
                color: '#9EA3B4',
                border: '1px solid #9EA3B4',
                lineHeight: '40px',
                borderRadius: '200px',
                height: '40px'
              }}
              iconStyle={{ fill: '#9EA3B4', right: '5px', top: '1px', padding: 0, width: '40px', height: '40px' }}
              style={{ margin: '25px 0 0 25px' }}
              disabled={ this.props.slates.length ? false : true }>
              { this.renderSlates() }
            </DropDownMenu>

            <TextField
              hintText='Search'
              underlineStyle={{ display: 'none' }}
              inputStyle={{
                color: '#9EA3B4',
                border: '1px solid #9EA3B4',
                lineHeight: '40px',
                borderRadius: '200px',
                padding: '0 20px',
                color: '#EEEEEE',
                fontSize: '15px'
              }}
              hintStyle={{
                lineHeight: '14px',
                paddingLeft: '20px',
                verticalAlign: 'middle',
                color: '#9EA3B4',
                fontSize: '15px'
              }}
              style={{ margin: '25px 0 0 25px', height: '40px', width: '200px' }}
              onChange={ this.handleSearch }
              onKeyDown={ this.handleKeyDown }
              value={ this.state.searchText }
            />
          
            <FlatButton
              icon={ <FontIcon className='material-icons'>search</FontIcon> }
              backgroundColor='#2F3243'
              style={{ margin: '27px 0 0 50px', minWidth: '35px' }}
              onTouchTap={ () => this.props.triggerSearch(this.state.searchText) }
            />
          </Row>

          <Row end='xs'>
            <div className='labels'>
              <span className='indicator orange'></span>
              <span>Predicted</span>
            </div>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state) => ({
  slates: state.admin.slates.slatesList,
  slateId: state.admin.stats.slateId,
  date: state.admin.stats.date
})

const mapDispatchToProps = (dispatch) => ({
  fetchSlates: (dateParams) => dispatch(fetchSlates(dateParams)),
  fetchStats: (params) => dispatch(fetchStats(params)),
  resetSlates: () => dispatch(resetSlates()),
  changeParams: (key, value) => dispatch(changeParams(key, value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompareToolbar)