import { connect } from 'react-redux'
import React, { Component } from 'react'

type Props = {}

type State = {}

export class demo extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>demo</div>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(demo)