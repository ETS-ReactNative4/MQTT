// @flow
import * as React from 'react';
import { Menu } from 'antd';
import { Switch, Route, Redirect, Link , withRouter} from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Loadable from 'react-loadable';
import { NavBar, Loading } from "../../components";
import './Center.css';
import {PageFooter, UserState} from '../../components';
import webLogo from '../../assets/img/logo_blue.png';

// 组件懒加载
const CenterOrder = Loadable({
  loader: () => import('../center-order'),
  loading: Loading,
});
const CenterOrders = Loadable({
  loader: () => import('../center-orders'),
  loading: Loading,
});
const CenterProfile = Loadable({
  loader: () => import('../center-profile'),
  loading: Loading,
});

const CenterPhone = Loadable({
  loader: () => import('../center-phone'),
  loading: Loading,
});

const CenterReset = Loadable({
  loader: () => import('../center-reset'),
  loading: Loading,
});

const CenterIdentify = Loadable({
  loader: () => import('../center-identify'),
  loading: Loading,
});

// 页面切换动画 待完成
const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};

const children = (C: React.ComponentType<any>) => ({ match, ...rest }) => (
  <TransitionGroup component={firstChild}>
    { match && <C {...rest} /> }
  </TransitionGroup>
);

const navs = [
  { title: '个人中心', selected: true }
];

const routes = {
  order: '/center/center-order',
  orders: '/center/center-orders',
  profile: '/center/center-profile',
  phone: '/center/center-phone',
  reset: '/center/center-reset',
  identify: '/center/center-identify',
};

type Props = {
  location: { pathname: string },
}

type State = {}

function rerouted(location: { pathname: string }) {
  const { pathname } = location;
  for (let key in routes) {
    if (pathname === routes[key]) {
      return key;
    }
  }
  return 'order';
}

const RouterObserver = withRouter(({ location }) => {
  return (
    <Menu
      defaultOpenKeys={['sub1']}
      mode="inline"
      selectedKeys={[rerouted(location)]}
    >
      <Menu.SubMenu key="sub1" title={<span>个人中心</span>} disabled={true}>
         {/* <Menu.ItemGroup key="g1">
          <Menu.Item key="order"><Link to={routes.order}>全部订单</Link></Menu.Item>
        </Menu.ItemGroup>  */}
        <Menu.ItemGroup key="g1-1">
          <Menu.Item key="orders"><Link to={routes.orders}>全部订单</Link></Menu.Item>
        </Menu.ItemGroup>
        <Menu.ItemGroup key="g2">
          <Menu.Item key="profile"><Link to={routes.profile}>我的资料</Link></Menu.Item>
          <Menu.Item key="phone"><Link to={routes.phone}>更改手机号</Link></Menu.Item>
          <Menu.Item key="reset"><Link to={routes.reset}>重置密码</Link></Menu.Item>
        </Menu.ItemGroup>
        {/* <Menu.ItemGroup key="g3">
          <Menu.Item key="identify"><Link to={routes.identify}>我的认证</Link></Menu.Item>
        </Menu.ItemGroup> */}
      </Menu.SubMenu>
    </Menu>
  );
});

class Center extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="center-page">
        <header className="header clearfix">
          <Link to="/"><img className="logo" src={webLogo} alt="emake.cn" /></Link>
          <UserState history={this.props.history} />
        </header>
        <NavBar navs={navs}/>
        <div className="center-content">
          <RouterObserver />

          <Switch>
            <Redirect exact from="/center" to={routes.orders}/>
            <Route exact path={routes.order} children={children(CenterOrder)} />
            <Route exact path={routes.orders} children={children(CenterOrders)} />
            <Route exact path={routes.profile} children={children(CenterProfile)} />
            <Route exact path={routes.phone} children={children(CenterPhone)} />
            <Route exact path={routes.reset} children={children(CenterReset)} />
            <Route exact path={routes.identify} children={children(CenterIdentify)} />
            <Redirect from="/center/*" to={routes.orders}/>
          </Switch>
        </div>
        <PageFooter reverse={this.props.location.pathname === '/login'} />
      </div>
      
    );
  }
}

export default Center;
