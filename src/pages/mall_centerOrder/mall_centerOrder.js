import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_centerOrder.css';
import { Carousel, Row, Col, Button, message, Icon, Tabs, Badge} from 'antd';
import Http from '../../service/Http';
import Url from '../../service/Url';
import none from '../../assets/mall/wudizhi.png';
import OrderNone from '../../assets/mall/wudingdan.png';
import {  MallOrder } from '../../components';
const TabPane = Tabs.TabPane;
type Props = {
    match: { params: any },
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
  
class MallCenterOrder extends React.Component<Props, State> {
    orders: any[];
    totalCount:0;
    constructor(props: Props) {
        super(props);
        this.state = {
        orders: [],
        orderState:[],
        loading: true,
        activeTab: all,
        activePage: 1,
        totalCount: 0,
        pageIndex: 1,
        CategoryAId: '001',
        loading: false
        };
    }
    setPanelChanged=async (key: string,pageIndex:any) => {
        const commonState = {
          activeTab: key,
          activePage: pageIndex,
          loading: false,
        };
        this.setState({
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
        this.setState({
            pageIndex: 1
        });
        this.getData(key,1, this.state.CategoryAId);
    };
    //作为一个对象的w和h属性返回视口的尺寸
    getViewportSize(w){
        //使用指定的窗口， 如果不带参数则使用当前窗口
        w = w || window;

        //除了IE8及更早的版本以外，其他浏览器都能用
        if(w.innerWidth != null)
            return {w: w.innerWidth, h: w.innerHeight};

        //对标准模式下的IE（或任意浏览器）
        var d = w.document;
        if(document.compatMode == "CSS1Compat")
            return {w: d.documentElement.clientWidth, h: d.documentElement.clientHeight};

        //对怪异模式下的浏览器
        return {w: d.body.clientWidth, h: d.body.clientHeight};
    }
    //检测滚动条是否滚动到页面底部
    isScrollToPageBottom(){
        //文档高度
        var documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        var viewPortHeight = this.getViewportSize().h;
        var scrollHeight = window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop || 0;
        return documentHeight - viewPortHeight - scrollHeight < 20;
    }
    scrollListener = () => {
        if(!this.isScrollToPageBottom()){
            return;            
        }
        if (this.state.pageIndex < Math.ceil(this.totalCount /5)) {
            this.loadDataDynamic();
        }
    }
    loadDataDynamic() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        const pageIndex = this.state.pageIndex + 1;
        this.getData(this.state.activeTab, pageIndex, this.state.CategoryAId);
        this.setState({
            loading: true,
            pageIndex: pageIndex
        });
        
    }
    async componentWillMount() {
        const {
          Data: data1,
        } = await Http.get(Url.baseUrl + '/user/params?ParamName=OrderState');
    
        this.setState({orderState:data1});
        this.getData("all",1, this.state.CategoryAId);
        window.onscroll = this.scrollListener;
    }
      getData=async (key:any,pageIndex:any,CategoryAId:any)=>{
              let orders=[];
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
            } = await Http.get(Url.baseUrl + '/app/make/order',obj);
    
            this.setState({
                loading: false
            });
            this.loading = false;
            if (code !== Http.ok) {
              return message.error(info);
            }
            if (pageIndex === 1) {
                orders =data.Orders;
            } else {
                orders = [...this.state.orders, ...data.Orders];
            }
            this.setState({
                orders,
            });
            // this.orders =data.Orders;
            this.totalCount=data.TotalNumber;
            this.setPanelChanged(key,pageIndex);
      }
    render() {
        const { activeTab,orders,orderState} = this.state;
        return (
            <div className='mall_centerOrder' style={{backgroundColor: '#FFF'}}>
                <div>
                    <Tabs activeKey={activeTab} onChange={this.panelChanged}>
                        <TabPane tab='全部' key={all}/>
                        <TabPane tab='待签订' key={waitSign} />
                        <TabPane tab='待付款' key={waitPaid} />
                        <TabPane tab='备货中' key={inWare} />
                        <TabPane tab='发货中' key={sent} />
                        <TabPane tab='已完成' key={finish} />
                    </Tabs>
                    {orders.length === 0 ? <div className="empty">
                        <img src={OrderNone} />
                        <p>亲，暂无相关订单哦~</p>
                    </div> : <div className="">
                        {orders.map((it, key) =>{
                        return <div key={it.ContractNo}>{it.ContractNo? <MallOrder {...this.props} order={it} orderState={orderState} deleteChange={this.refresh} />:""}</div>
                        } )}
                        {this.state.loading ? <p style={{textAlign: 'center'}}>正在加载...</p>:null}
                    </div>}
                </div>
            </div>
        );
    }
}
export default withRouter(MallCenterOrder);