// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Tabs, Badge, message, Button } from 'antd';
import { Loading, OrderItem } from '../../components';
import Identifying from '../../assets/img/dairenzheng.png';
import Identified from '../../assets/img/yirenzheng.png';
import ToIdentify from '../../assets/img/tuzi02.png';
import DefaultAvatar from '../../assets/img/default_avatar.png';
import './CenterOrder.css';
import UserService from "../../service/User";
import Http from '../../service/Http';
import Utils from '../../service/Utils';

type User = {
  trueName?: string,
  passedIdentify: boolean,
  avatar?: string,
  telephone: string,
}

type Props = {
  history: { push: (string) => void },
}

type State = {
  user: User,
  orders: any[],
  loading: boolean,
  activeTab: string,
  activePage: number,
  totalCount: number,
}

const all = 'all';
const unpaid = '0';
const producing = '1';
const inWare = '2';
const sent = '3';
const pageSize = 5;

const renderBadgeTitle = ( title: string, badge: number ) => (
  <Badge count={badge} offset={[-4, 10]}>
    <span>{title}</span>
  </Badge>
);

class CenterOrder extends React.Component<Props, State> {
  orders: any[];
  constructor(props: Props) {
    super(props);
    const user = UserService.get() || {};
    const showName = user.NickName || user.MobileNumber;
    this.state = {
      user: {
        trueName: showName,
        passedIdentify: UserService.identified(),
        avatar: user.HeadImageUrl,
        telephone: user.MobileNumber,
      },
      orders: [],
      loading: true,
      activeTab: all,
      activePage: 1,
      totalCount: 0,
    };
  }

  pageChanged = (page: number) => {
    const commonState = {
      activePage: page,
    };
    const { activeTab } = this.state;
    const pageStart = (page - 1) * pageSize;
    const pageEnd = page * pageSize;
    if (activeTab === all) {
      this.setState({ orders: this.orders.slice(pageStart, pageEnd), ...commonState });
    } else {
      this.setState({
        orders: this.orders.filter(it => it.OrderState === activeTab).slice(pageStart, pageEnd),
        ...commonState,
      })
    }
  };

  panelChanged = (key: string) => {
    const commonState = {
      activeTab: key,
      activePage: 1,
      loading: false,
    };
    if (key === all) {
      this.setState({
        orders: this.orders.slice(0, pageSize),
        totalCount: this.orders.length,
        ...commonState
      });
    } else {
      const thisPartOrder = this.orders.filter(it => it.OrderState === key);
      this.setState({
        orders: thisPartOrder.slice(0, pageSize),
        totalCount: thisPartOrder.length,
        ...commonState,
      })
    }
  };

  gotoIndex = () => this.props.history.push('/');

  gotoIdentify = () => this.props.history.push('/center/center-identify');

  async componentWillMount() {
    const {
      ResultCode: code,
      ResultInfo: info,
      Data: data,
    } = await Http.get('app/make/order');

    if (code !== Http.ok) {
      return message.error(info);
    }

    const orders = Object.getOwnPropertyNames(data)
      .filter(it => it !== 'index')
      .map(it => data[it]);
    this.orders = orders.sort((a, b) => (new Date(b.InDate).getTime() - new Date(a.InDate).getTime()));
    this.panelChanged(all);
    if (Utils.dev) {
      console.log(JSON.stringify(orders));
    }
  }

  renderNoIdentified() {
    return (
      <div className="identify-notice">
        <img src={ToIdentify} alt="" />
        <div className="hint">亲，为实现价格保护，请上传实名认证资料！</div>
        <div className="btns">
          <Button onClick={this.gotoIndex}>逛逛首页</Button>
          <Button type="primary" onClick={this.gotoIdentify}>立即认证</Button>
        </div>
      </div>
    );
  }

  render() {
    const { user, orders, loading, activeTab, activePage, totalCount } = this.state;
    const { avatar, trueName, passedIdentify, telephone } = user;
    return (
      <div className="center-order-page">
        <div className="personal-info">
          <img className="avatar" src={avatar || DefaultAvatar} alt="" />
          <div className="description">
            <span><span>{trueName}</span> {passedIdentify ? <img src={Identified} alt="" /> : <img src={Identifying} alt="" />}<span>{passedIdentify ? '已认证' : '待认证'}</span></span>
            <span><span>{telephone}</span> <Link to="/center/center-phone">更改</Link></span>
          </div>
        </div>

        {passedIdentify ? (loading ? <Loading style={{ backgroundColor: 'white', marginTop: '20px' }} /> : <div className="order-list">
          <Tabs activeKey={activeTab} onChange={this.panelChanged} animated={false}>
            <Tabs.TabPane tab={renderBadgeTitle('全部订单', 0)} key={all}>
            </Tabs.TabPane>
            <Tabs.TabPane tab={renderBadgeTitle('待付款', 0)} key={unpaid} />
            <Tabs.TabPane tab={renderBadgeTitle('生产中', 0)} key={producing} />
            <Tabs.TabPane tab={renderBadgeTitle('已入库', 0)} key={inWare} />
            <Tabs.TabPane tab={renderBadgeTitle('已发货', 0)} key={sent} />
          </Tabs>
          {orders.length === 0 ? <div className="empty">暂无订单</div> : <div className="items">
            {orders.map((it, key) => <OrderItem key={key} order={it} />)}
          </div>}
          <Pagination pageSize={pageSize} current={activePage} total={totalCount} onChange={this.pageChanged} />
        </div>) : this.renderNoIdentified()}
      </div>
    );
  }
}

export default CenterOrder;