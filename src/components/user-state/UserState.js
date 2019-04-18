// @flow
import * as React from 'react';
import { Icon, Button, Menu, Dropdown } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import './UserState.css';
import LogoPhone from '../../assets/img/dianhua.png';
import Identifying from '../../assets/img/dairenzheng.png';
import Identified from '../../assets/img/yirenzheng.png';
import User from '../../service/User';

type Props = {
  history: { push: (string) => void },
}

type State = {}

const menu = menuItemClick => (
  <Menu onClick={menuItemClick}>
    <Menu.Item key="profile" className="user-state-menu-item">
      个人资料
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="exit" className="user-state-menu-item">
      退出
    </Menu.Item>
  </Menu>
);

const routerView = menuItemClick => withRouter(({ location }: { location: { pathname: string }}) => {
  const {
    NickName,
    MobileNumber,
  } = User.get() || {};
  const showName = NickName || MobileNumber;
  return (
    <section className="relative">
      <img src={LogoPhone} alt="" /><span className="phone">400-867-0211</span>
      &nbsp;
      {
        User.validate() ? [
          location.pathname !== '/'
            ? <Dropdown key={0} overlay={menu(menuItemClick)} trigger={['hover']}><div className="user-name">{showName} <Icon type="down" /></div></Dropdown>
            : <Link to="/center" key={0} style={{ fontSize: '0.8rem' }}>个人中心</Link>,
          <span key={1}>&nbsp;</span>,
          User.identified() ? <img key={2} src={Identified} alt="" /> : <img key={2} src={Identifying} alt="" />,
          User.identified()
            ? <span key={3} className="identify">已认证</span>
            : <Link key={3} className="identify linkable" to="/center/center-identify">待认证</Link>,
        ] : [
          <Link key={0} to="/login"><Button style={{lineHeight:"32px"}}>请登录</Button></Link>,
          <span key={1}>&nbsp;</span>,
          <Link key={2} to="/register"><Button style={{lineHeight:"32px"}} type="primary">注册</Button></Link>
        ]
      }
    </section>
  );
});

export default class UserState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  menuItemClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'profile':
        this.props.history.push('/center/center-profile');
        break;
      case 'exit':
        User.drop();
        this.props.history.push('/');
        break;
      default: break;
    }
  };

  render() {
    const RouterView = routerView(this.menuItemClick);
    return (
      <div className="component-user-state">
        <RouterView />
      </div>
    );
  }
}