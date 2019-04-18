// @flow
import * as React from 'react';
import { Icon } from 'antd';
import './Loading.css';

type Props = {
  style?: any,
  error?: boolean,
  pastDelay?: boolean,
  timedOut?: boolean,
}

type State = {}

export default class Loading extends React.Component<Props, State> {
  static defaultProps = {
    style: {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    const { pastDelay } = this.props;
    if (pastDelay === false) return null;
    return (
      <div className="component-loading" style={this.props.style}>
        <Icon type="loading" />
      </div>
    );
  }
}