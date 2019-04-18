import  React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './custom-route.css';
import backIndex from '../../assets/mall/huidaozhuye.png';
import {PageFooter} from '../../components';

type Props = {
  history: { push: (string) => void },
}
export default class CustomRoute extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      path: ''
    };
  }

  componentDidMount() {
    document.title = this.props.title;
    this.setState({
      path: window.location.pathname
    });
  }
  backToIndex = () => {
    this.props.history.push('/mallIndex');
  }

  render() {
    return (
      <div className="page-container" style={{height: '100%', backgroundColor: this.state.path == '/mallIndex'? '#f2f2f2': '#fff'}}>
        <Route {...this.props}/>
        {/* {this.state.path !== '/mallLogin' && this.state.path.indexOf('mall') !== -1 ? <div className="back_index" onClick={this.backToIndex}>
          <img src={backIndex} />
        </div>: null} */}
      </div>
      
    );
  }
}