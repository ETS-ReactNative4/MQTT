// @flow
import * as React from 'react';

type Props = {}

type State = {}

class NotFound extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>Not Found</div>;
  }
}

export default NotFound;