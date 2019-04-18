// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Tabs, Badge, message, Button, Select } from 'antd';
import {  OrderItems } from '../../components';
import Identifying from '../../assets/img/dairenzheng.png';
import Identified from '../../assets/img/yirenzheng.png';
import ToIdentify from '../../assets/img/tuzi02.png';
import DefaultAvatar from '../../assets/img/default_avatar.png';
import agent from '../../assets/img/agent.png';
import vip from '../../assets/img/vip.png';
import './CenterOrders.css';
import UserService from "../../service/User";
import Http from '../../service/Http';
// import Utils from '../../service/Utils';

type User = {
  trueName?: string,
  isAgent: boolean,
  isVip: boolean,
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
  orderState:any[],
  
}

const all = 'all';
const waitSign = '-2';
const waitPaid = '0';
const inWare = '12';
const sent = '3';
const finish = '4';
const pageSize = 5;

const renderBadgeTitle = ( title: string, badge: number ) => (
  <Badge count={badge} offset={[-4, 10]}>
    <span>{title}</span>
  </Badge>
);

class CenterOrders extends React.Component<Props, State> {
  orders: any[];
  totalCount:0;
  constructor(props: Props) {
    super(props);
    const user:UserInfo = UserService.get() || {};
    const showName = user.NickName || '用户'+UserService.getPhone().substring(7,11);
    this.state = {
      user: {
        trueName: showName,
        isAgent: UserService.isAgent(),
        isVip: UserService.isVip(),
        passedIdentify: UserService.identified(),
        avatar: user.HeadImageUrl,
        telephone: user.MobileNumber,
      },
      orders: [],
      orderState:[],
      loading: true,
      activeTab: all,
      activePage: 1,
      totalCount: 0,
      CategoryAId: '001',
    };
  }

  pageChanged =async (page: number) => {
    this.orders=[];
    const key=this.state.activeTab;
    this.getData(key,page, this.state.CategoryAId);
  };
  setPanelChanged=async (key: string,pageIndex:any) => {
    const commonState = {
      activeTab: key,
      activePage: pageIndex,
      loading: false,
    };
    this.setState({
        orders: this.orders,
        totalCount: this.totalCount,
        ...commonState
      });
  }
  refresh=async ()=>{
    const key=this.state.activeTab;
    const activePage=this.state.activePage;
      this.getData(key,activePage, this.state.CategoryAId);
  }
  panelChanged =async (key: string) => {
      this.getData(key,1, this.state.CategoryAId);
  };

  gotoIndex = () => this.props.history.push('/');

  gotoIdentify = () => this.props.history.push('/center/center-identify');

  async componentWillMount() {
    const {
      Data: data1,
    } = await Http.get('user/params?ParamName=OrderState');

    this.setState({orderState:data1});
    this.getData("all",1, this.state.CategoryAId);
  }
  getData=async (key:any,pageIndex:any,CategoryAId:any)=>{
          this.orders=[];
          const obj={
            PageIndex:pageIndex,
            PageSize: 5,
            CategoryAId: CategoryAId,
            RequestType: 1,
            OrderState:key,
        };
        if(key==="all"){
            delete obj.OrderState;
            // delete obj.RequestType;
            
        }else{
            obj.RequestType=3;
          if(key=='-2') {
              obj.RequestType = 1;
              obj.OrderState = -2;
            // delete obj.RequestType;
            // delete obj.OrderState;
          }
        }
        const {
          ResultCode: code,
          ResultInfo: info,
          Data: data,
        } = await Http.get('app/make/order',obj);

        if (code !== Http.ok) {
          return message.error(info);
        }
        this.orders =data.Orders;
        this.totalCount=data.TotalNumber;
        this.setPanelChanged(key,pageIndex);
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
  changeCategory = async(value) => {
    this.setState({
      CategoryAId: value
    });
    const key=this.state.activeTab;
    await this.getData(key, 1, value);
  }

  render() {
    const { user, activeTab,orders,activePage, totalCount,orderState} = this.state;
    const { avatar, trueName, isAgent, isVip, passedIdentify, telephone } = user;
    
    return (
      <div className="center-orders-page">
        
        <div className="personal-info">
          <img className="avatar" src={avatar || DefaultAvatar} alt="" />
          <div className="description">
            <span><span style={{marginRight:10}}>{trueName}</span>{isAgent?<div className='iconContainer'><img src={agent} style={{marginBottom:0}}/>城市代理商</div>:null}{isVip?<div className='iconContainer'><img src={vip}/>会员</div>:null}</span>
            <span><span>{telephone}</span> <Link to="/center/center-phone">更改</Link></span>
          </div>
        </div>

        <div className="order-list">
          {/* <Tabs activeKey={activeTab} onChange={this.panelChanged} animated={false} 
            tabBarExtraContent={<Select defaultValue="001" onChange={this.changeCategory} className="category_change">
              <Select.Option value="001">工业品订单</Select.Option>
              <Select.Option value="002">消费品订单</Select.Option>
            </Select>}
          >
            <Tabs.TabPane tab={renderBadgeTitle('全部订单', 0)} key={all}>
            </Tabs.TabPane>
            <Tabs.TabPane tab={renderBadgeTitle('待签订', 0)} key={waitSign} />
            <Tabs.TabPane tab={renderBadgeTitle('待付款', 0)} key={waitPaid} />
            <Tabs.TabPane tab={renderBadgeTitle('备货中', 0)} key={inWare} />
            <Tabs.TabPane tab={renderBadgeTitle('发货中', 0)} key={sent} />
            <Tabs.TabPane tab={renderBadgeTitle('已完成', 0)} key={finish} />
          </Tabs> */}
          <Tabs activeKey={activeTab} onChange={this.panelChanged} animated={false}>
            <Tabs.TabPane tab={renderBadgeTitle('全部订单', 0)} key={all}>
            </Tabs.TabPane>
            <Tabs.TabPane tab={renderBadgeTitle('待签订', 0)} key={waitSign} />
            <Tabs.TabPane tab={renderBadgeTitle('待付款', 0)} key={waitPaid} />
            <Tabs.TabPane tab={renderBadgeTitle('备货中', 0)} key={inWare} />
            <Tabs.TabPane tab={renderBadgeTitle('发货中', 0)} key={sent} />
            <Tabs.TabPane tab={renderBadgeTitle('已完成', 0)} key={finish} />
          </Tabs>
          {orders.length === 0 ? <div className="empty">暂无订单</div> : <div className="items">
            {orders.map((it, key) =>{
               return <div key={key}>{it.ContractNo? <OrderItems  order={it} orderState={orderState} deleteChange={this.refresh} />:""}</div>
            } )}
          </div>}
          <Pagination pageSize={pageSize} current={activePage} total={totalCount} onChange={this.pageChanged} />
        </div>
      </div>
    );
  }
}

export default CenterOrders;