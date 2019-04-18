import React, { Component } from 'react';
import { Redirect, Switch, withRouter } from 'react-router-dom';
import { TransitionGroup } from 'react-transition-group';
import Loadable from 'react-loadable';
import { message } from 'antd';
import { Loading, CustomRoute } from '../components';
import { SecureRoute } from 'react-route-guard';
import User from '../service/User';
import { appStore } from './app.store';
import { open } from './db';

import './App.css';

type Props = {
  history: { push: (string) => void },
}
const commonParam = {
  loading: Loading,
  delay: 200,
};
const Home = Loadable({
  loader: () => import('./index'),
  ...commonParam,
});

//-------官网移入开始-----------//
const Login = Loadable({
  loader: () => import('./login'),
  ...commonParam,
});

const Register = Loadable({
  loader: () => import('./register'),
  ...commonParam,
});

const RegisterSuccess = Loadable({
  loader: () => import('./register-success'),
  ...commonParam,
});

const Reset = Loadable({
  loader: () => import('./reset'),
  ...commonParam,
});

const Center = Loadable({
  loader: () => import('./center'),
  ...commonParam,
});

const NotFound = Loadable({
  loader: () => import('./notfound'),
  ...commonParam,
});

const routeGuard = {
  shouldRoute: () => User.validate(),
};
//--------官网移入结束----------//

const GoodDetail = Loadable({
  loader: () => import('./goods-details'),
  ...commonParam,
});
const NgoodsDetails = Loadable({
  loader: () => import('./n-goods-details'),
  ...commonParam,
});
const Companies = Loadable({
  loader: () => import('./companies-use'),
  ...commonParam,
});
const Shuffling = Loadable({
  loader: () => import('./shuffling'),
  ...commonParam,
});
const Shopping = Loadable({
  loader: () => import('./open-shop'),
  ...commonParam,
});
const Download = Loadable({
  loader: () => import('./download'),
  ...commonParam,
});
const Commission = Loadable({
  loader: () => import('./commission'),
  ...commonParam,
});
const TodayPrice = Loadable({
  loader: () => import('./today-price'),
  ...commonParam,
});
const SeriesList = Loadable({
  loader: () => import('./today-price/series-list'),
  ...commonParam,
});
const PriceList = Loadable({
  loader: () => import('./today-price/price-list'),
  ...commonParam,
});
const ShopDetails = Loadable({
  loader: () => import('./shop-details'),
  ...commonParam,
});
const Withdrawal = Loadable({
  loader: () => import('./withdrawal'),
  ...commonParam,
});
const GetGift = Loadable({
  loader: () => import('./gifts/get'),
  ...commonParam,
});
const Rules = Loadable({
  loader: () => import('./gifts/rules'),
  ...commonParam,
});
const GiftsList = Loadable({
  loader: () => import('./gifts/list'),
  ...commonParam,
});
const Servicepact = Loadable({
  loader: () => import('./service-pact'),
  ...commonParam,
});
const OrderingInformation = Loadable({
  loader: () => import('./ordering-information'),
  ...commonParam,
});
const OrderingProcess = Loadable({
  loader: () => import('./ordering-process'),
  ...commonParam,
});
const UserManual = Loadable({
  loader: () => import('./user-manual'),
  ...commonParam,
});
const RedPacket = Loadable({
  loader: () => import('./red-packet'),
  ...commonParam,
});
const PriceLists = Loadable({
  loader: () => import('./pricelist'),
  ...commonParam,
});
const SeriesLists = Loadable({
  loader: () => import('./serieslist'),
  ...commonParam,
});
const Today = Loadable({
  loader: () => import('./today'),
  ...commonParam,
});
const MerchantUsingHelp = Loadable({
  loader: () => import('./merchant-using-help'),
  ...commonParam,
});
const Supergroup = Loadable({
  loader: () => import('./super-group'),
  ...commonParam,
});
const OrderProcedure = Loadable({
  loader: () => import('./order-procedure'),
  ...commonParam,
});
const OrderInfo = Loadable({
  loader: () => import('./order-info'),
  ...commonParam,
});
const CityAgentRule = Loadable({
  loader: () => import('./city-agent-rule'),
  ...commonParam
});
const VipInfo = Loadable({
  loader: () => import('./vip-info'),
  ...commonParam,
});
const WithrawRule = Loadable({
  loader: () => import('./withdraw-rule'),
  ...commonParam,
});
const CityAgent = Loadable({
  loader: () => import('./city-agent'),
  ...commonParam
});
const SuperGroupShare = Loadable({
  loader: () => import('./super-group-share'),
  ...commonParam,
});
const MyGroupShare = Loadable({
  loader: () => import('./my-group-share'),
  ...commonParam
});
const OnlinePaymentProcess = Loadable({
  loader: () => import('./online-bank-payment'),
  ...commonParam
});
const Statistical = Loadable({
  loader: () => import('./statistical'),
  ...commonParam
});
const CustomDev = Loadable({
  loader: () => import('./custom_dev'),
  ...commonParam
});
const MallIndex = Loadable({
  loader: () => import('./mall_index'),
  ...commonParam
});
const MallGoodsDetail = Loadable({
  loader: () => import('./mall_goodsdetail'),
  ...commonParam
});
const MallVip = Loadable({
  loader: () => import('./mall_vip'),
  ...commonParam
});
const MallCashier = Loadable({
  loader: () => import('./mall_cashier'),
  ...commonParam
});
const MallConfigAddress = Loadable({
  loader: () => import('./mall_configAddress'),
  ...commonParam
});
const MallConfirmOrder = Loadable({
  loader: () => import('./mall_confirmOrder'),
  ...commonParam
});
const MallLogin = Loadable({
  loader: () => import('./mall_login'),
  ...commonParam
});
const MallNewAddress = Loadable({
  loader: () => import('./mall_newAddress'),
  ...commonParam
});
const MallCenterOrder = Loadable({
  loader: () => import('./mall_centerOrder'),
  ...commonParam
});
const MallOrderDetail = Loadable({
  loader: () => import('./mall_orderDetail'),
  ...commonParam
});
const MallChatting = Loadable({
  loader: () => import('./mall_chatting'),
  ...commonParam
});
const MallContract = Loadable({
  loader: () => import('./mall_contract'),
  ...commonParam
});
const MallDownload = Loadable({
  loader: () => import('./mall_download'),
  ...commonParam
});
const CustomMade = Loadable({
  loader: () => import('./custom_made'),
  ...commonParam
});
const PresellRules = Loadable({
  loader: () => import('./presell-rules'),
  ...commonParam,
})

// 
const firstChild = props => {
  const childrenArray = React.Children.toArray(props.children);
  return childrenArray[0] || null;
};
const children = (C) => ({ match, ...rest }) => (
  <TransitionGroup component={firstChild}>
    {match && <C {...rest} />}
  </TransitionGroup>
);
class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    message.config({ duration: 1 });
    // open(() => {
    //   this.setState({});
    // });
    
  }
  render() {
    return (
      <Switch>
        {/*<CustomRoute exact path="/" children={children(Home)} title="易虎网" />*/}
        <CustomRoute exact path="/" children={children(Login)} {...this.props} title="易虎网"/>
        <CustomRoute exact path="/login" children={children(Login)} title="登录"/>
        <CustomRoute exact path="/register" children={children(Register)} title="注册"/>
        <CustomRoute exact path="/register-success" children={children(RegisterSuccess)} title="注册成功"/>
        <CustomRoute exact path="/reset" children={children(Reset)} title="重置"/>
        <SecureRoute path="/center" children={children(Center)} routeGuard={routeGuard} redirectToPathWhenFail='/login' title="我的中心"/>
        <CustomRoute exact path="/404" children={children(NotFound)} title="404"/>

        <CustomRoute exact path='/statistical' children={children(Statistical)} title='数据统计' />
        <CustomRoute exact path="/today/:code/:id/:secode/:cid/:title" children={children(Today)} title="当日售价" />
        <CustomRoute exact path="/serieslist/:code" children={children(SeriesLists)} title="当日售价" />
        <CustomRoute exact path="/pricelist" children={children(PriceLists)} title="当日售价" />
        <CustomRoute exact path="/redpacket/:code/:id" children={children(RedPacket)} title="红包" />
        <CustomRoute exact path="/usermanual" children={children(UserManual)} title="用户手册" />
        <CustomRoute exact path="/orderinginfo" children={children(OrderingProcess)} title="订单信息" />
        <CustomRoute exact path="/GoodDetails/:code" children={children(GoodDetail)} title="商品参数详情" />
        <CustomRoute exact path="/ngoodsdetails/:code/:isApp?" children={children(NgoodsDetails)} title="商品详情" />
        <CustomRoute exact path="/details/:id/" children={children(GoodDetail)} title="商品详情" />
        <CustomRoute exact path="/companies/:code" children={children(Companies)} />
        <CustomRoute exact path="/shuff/:id" children={children(Shuffling)} />
        <CustomRoute exact path="/shop" children={children(Shopping)} />
        <CustomRoute exact path="/download" children={children(Download)} title='APP下载' />
        <CustomRoute exact path="/commission" children={children(Commission)} />
        <CustomRoute exact path="/price" children={children(TodayPrice)} title="今日售价"/>
        <CustomRoute exact path="/series/:id" children={children(SeriesList)}  title="今日售价"/>
        <CustomRoute exact path="/pricetable/:code/:title/:type" children={children(PriceList)}  title="今日售价"/>
        <CustomRoute exact path="/shopdetail/:id" children={children(ShopDetails)} title="店铺详情"/>
        <CustomRoute exact path="/withdrawal/:code" children={children(Withdrawal)} title="提现"/>
        <CustomRoute exact path="/gifts" children={children(GetGift)} title="大礼包"/>
        <CustomRoute exact path="/rules" children={children(Rules)} />
        <CustomRoute exact path="/giftslist/:phone/:code" children={children(GiftsList)} />
        <CustomRoute exact path="/servicepact/:code" children={children(Servicepact)} />
        <CustomRoute exact path="/orderingpro" children={children(OrderingInformation)} />
        <CustomRoute exact path='/usinghelp/:code' children={children(MerchantUsingHelp)} title="使用说明" /> // app使用说明
        <CustomRoute exact path='/supergroup' children={children(Supergroup)} title="超级团说明" /> //超级团说明
        <CustomRoute exact path='/orderprocedure' children={children(OrderProcedure)} title="订购流程" /> // 订购流程
        <CustomRoute exact path='/orderinfo' children={children(OrderInfo)} title="订购须知" /> // 订购须知
        <CustomRoute exact path='/cityagentrule' children={children(CityAgentRule)} title="城市代理商" /> // 城市代理商规则
        <CustomRoute exact path='/vipinfo' children={children(VipInfo)} title="会员说明" /> // 会员说明
        <CustomRoute exact path='/withdrawrule' children={children(WithrawRule)} title="提现规则" /> // 提现规则
        <CustomRoute exact path='/cityagent/:userId/:code?' children={children(CityAgent)} title="会员招募" /> // 城市代理商领取优惠码
        <CustomRoute exact path='/supergroupshare/:supergroupId/:userId' children={children(SuperGroupShare)} title="超级团" /> // 超级团分享
        <CustomRoute exact path='/mygroupshare/:supergroupdetailId/:userId' children={children(MyGroupShare)} title="超级团" /> //我的超级团分享
        <CustomRoute exact path='/onlinepaymentprocess' children={children(OnlinePaymentProcess)} title='网银付款流程' />  // 网银付款流程(2018.10.16新增)
        <CustomRoute exact path='/statistical' children={children(Statistical)} title='数据统计' />
        <CustomRoute exact path='/customdev' children={children(CustomDev)} title='开发定制' />  // 开发定制(2018.12.05新增)
        <CustomRoute exact path="/mallIndex" children={children(MallIndex)} title="输配电商城"  {...this.props}/>
        <CustomRoute exact path="/mallGoodsDetail/:code" children={children(MallGoodsDetail)} title="商品详情"  {...this.props}/>
        <CustomRoute exact path="/mallVip" children={children(MallVip)} title="我的会员权益"  {...this.props}/>
        <CustomRoute exact path="/mallCashier/:info" children={children(MallCashier)} title="易智造收银台"  {...this.props}/>
        <CustomRoute exact path="/mallConfigAddress" children={children(MallConfigAddress)} title="选择收货地址"  {...this.props}/>
        <CustomRoute exact path="/mallNewAddress/:address?" children={children(MallNewAddress)} title="新增地址"  {...this.props}/>
        <CustomRoute exact path="/mallConfirmOrder/:code" children={children(MallConfirmOrder)} title="确认订单"  {...this.props}/>
        <CustomRoute exact path="/mallCenterOrder/:code?" children={children(MallCenterOrder)} title="全部订单"  {...this.props}/>
        <CustomRoute exact path="/mallOrderDetail/:orderNo" children={children(MallOrderDetail)} title="订单详情"  {...this.props}/>
        <CustomRoute exact path="/mallChatting/:code?/:type?" children={children(MallChatting)} title="易智造客服"  {...this.props} store={appStore}/>
        <CustomRoute exact path="/mallContract/:code/:type?" children={children(MallContract)} title="销售合同" {...this.props}/>
        <CustomRoute exact path="/mallDownload" children={children(MallDownload)} title="APP下载" {...this.props} />
        <CustomRoute exact path="/mallLogin" children={children(MallLogin)} title="登录" />
        <CustomRoute exact path="/custommade" children={children(CustomMade)} title="我要定制" {...this.props} />

        <CustomRoute exact path="/presell/rules" children={children(PresellRules)} title="预售规则" {...this.props} />
        <Redirect from="*" to="/" />
      </Switch>
    );
  }
}

export default withRouter(App);
