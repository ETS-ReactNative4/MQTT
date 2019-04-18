import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_orderDetail.css';
import { Carousel, Row, Col, Button, message, Drawer, Modal, Icon} from 'antd';
import address from '../../assets/mall/dizhi_iconw.png';
import edit from '../../assets/mall/dizhi_bianji.png';
import Http from '../../service/Http';
import Url from '../../service/Url';
import * as moment from 'moment';
import kefu from '../../assets/mall/kufu30.png';
import { appStore } from '../app.store';
import * as uuidv1 from "uuid/v1";
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    order: any,
    shippingInfo:any
}
class MallOrderDetail extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            order: {},
            shippingInfo: {},
            OrderNo: '',
            OrderState: '',
            logistics: [],
            logisticsModal: false,
            visible: false
        };
    }
    componentWillMount() {
        const orderNo = this.props.match.params.orderNo;
        this.getOrderDetail(orderNo);
    }
    getOrderDetail = async(contractNo) => {
        const requestObj = {
            PageIndex: 1,
            PageSize: 10000,
            CategoryBId: '001-002',
            RequestType: 1,
            OrderNo: contractNo,
        };
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/app/make/order`, requestObj);
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.Orders && data.Orders.length > 0) {
            const order = data.Orders.filter(it => it.ContractNo == contractNo) [0];
            if (order.OrderState === '4') {
                this.shippingDetail(contractNo);
            } else {
                this.setState({
                    shippingInfo: order.Address !== '' && order.Address !== null? JSON.parse(order.Address): {}
                });
            }
            console.log(order);
            this.setState({
                order: order
            });
        } else {
            return message.error('未获取到数据！');
        }
    }
    shippingDetail=async(contractNo)=>{
        
        const {
          ResultCode: code,
          ResultInfo: info,
          Data: data,
        }  = await Http.get(Url.baseUrl + '/web/make/contract/shipping', {
          SearchContent: contractNo,
          CategoryBId: '001-002',
          PageIndex: 1,
          PageSize: 1000000
        });
        if (code !== Http.ok) {
          return message.error(info);
        }
        if (data['List'] && data['List'].length > 0) {
            const arr = data['List'].filter(it => {
                return it.ContractNo === contractNo;
            });
            this.setState({
                shippingInfo: arr && arr.length > 0 ? arr[0]:{}
            });
        }
    }
    logisticsDetail=async(contractNo:any, e)=>{
        e.stopPropagation();
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data,
        }  = await Http.get('app/make/shipping/detail', {
            ContractNo: contractNo
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        this.setState({
            logistics: data
        });
    
        this.setState({logisticsModal:true});
    }
    getShippingNumber =(shipItem: any) => {
        let ShippingNumber = 0;
        if(shipItem.Goods) {
            shipItem.Goods.map(item => {
                ShippingNumber+=item.ShippingNumber;
            });
            return ShippingNumber;
        }
    }
    closeLogisticsModal=()=>{
        this.setState({logisticsModal:false})
    }
    getVal = () => {
        if (this.state.order.CategoryId && this.state.order.CategoryId.length > 3) {
            return this.state.order.CategoryId.substring(0, 3) === "001" ? this.state.order.GoodsAddValue : this.state.order.GoodsAddValue2
        }
        return ""
    }
    getOrderStateLabel=(orderState,IsOut)=>{
        if(IsOut==="0"){
            return "失效";
        }
        if(orderState==="-2"){
            return "待签订";
        }
        if(orderState==="0"){
            return "待付款";
        }
        if(orderState==="1" || orderState==="2"){
            return "备货中";
        }
        if(orderState==="3"){
            return "发货中";
        }
        if(orderState==="4"){
            return "已完成";
        }
            return "未知";
   }
    getGoodsCount=(ProductList)=>{
        let count=0;
        if(ProductList){
        for(let i=0;i<ProductList.length;i++){
            count+=ProductList[i].GoodsNumber;
    
        };
    
        }
    
        return count;
    }
    changeData=(AddServiceInfo)=>{
        let arr=[];
        for(let i=0;i<AddServiceInfo.length;i++){
          const GoodsTypeName=AddServiceInfo[i].GoodsTypeName;
           const temp= arr.filter(item=>{
               return item.GoodsTypeName===GoodsTypeName;
            });
            if(temp.length===0){
                const obj={
                  GoodsTypeName:GoodsTypeName,
                  list:[AddServiceInfo[i]]
                };
                arr.push(obj);
            }else{
                for(let j=0;j<arr.length;j++){
                  if(arr[j].GoodsTypeName===GoodsTypeName){
                     arr[j].list.push(AddServiceInfo[i])
                  }
                }
            }
    
        };
        return arr;
    }
    getGoodsPrice = (GoodsPrice, AddServiceInfo, GoodsNumber) => {
        console.log(GoodsPrice, AddServiceInfo, GoodsNumber);
        let price = GoodsPrice;
        AddServiceInfo.map(it => {
            price +=it.GoodsPrice;
        });
        return Math.floor(price * GoodsNumber *100) /100;
    }
    getTotalPrice=(ProductList)=>{
        let price=0;
        if(ProductList){
          for(let i=0;i<ProductList.length;i++){
            const  MainProductPrice=ProductList[i].MainProductPrice;
            const  GoodsNumber=ProductList[i].GoodsNumber;
            const AddServiceInfo=ProductList[i].AddServiceInfo;
            let childPrice=0;
            for (let j=0;j<AddServiceInfo.length;j++){
              childPrice+=AddServiceInfo[j].GoodsPrice;
             };
             
             price+=(MainProductPrice+childPrice)*GoodsNumber;
          };
        }
          return  parseFloat(price).toFixed(2) ;
    }
    getTotalShippingFee = (ProductList) => {
        let price = 0;
        if(ProductList){
            for(let i=0;i<ProductList.length;i++){
                price += ProductList[i].TotalShippingFee;
            };
        }
        return  parseFloat(price).toFixed(2);
    }
    closeModal=async (ContractNo:any,MinPayAmount:any)=>{
        this.setState({visible:false});
    }
    renderGoods({IsStandard, GoodsTitle, GoodsExplain, MainProductPrice, GoodsNumber, GoodsSeriesPhotos, GoodsSeriesIcon, AddServiceInfo,TotalShippingFee }: any, key: any,) {
        const { GoodsAddValue, OrderState, IsOut} =this.state.order;
    
        return (
            <div className="order_goods_item" key={key+"-key"}>
                <Row>
                    <Col span={6}>
                        <div className="icon_box">
                            <img style={{maxWidth: '100%'}} src={GoodsSeriesPhotos ? JSON.parse(GoodsSeriesPhotos)[0]: (GoodsSeriesIcon ? GoodsSeriesIcon: 'http://placehold.it/70x70')}/>
                        </div>
                    </Col>
                    <Col span={18}>
                        <div className="main_box">
                        {/* <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign:'bottom' }}><span className={IsStandard == '1' ? 'Standard' : 'notStandard'}>{IsStandard == '1' ? '标准品' : '设计品'}</span>{GoodsTitle}</p> */}
                            <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign:'bottom' }}>{GoodsTitle}</p>
                            <p style={{color: '#A1A1A1', marginBottom: '0.3rem'}}>{GoodsExplain}</p>
                            <p style={{float:'right', marginBottom: '0.3rem'}}>{'￥'+MainProductPrice}</p>
                            {/* <p style={{textAlign: 'right', color: '#000', marginBottom: '0.3rem'}}>{'￥'+ this.state.order.GoodsPrice.toFixed(2)}</p> */}
                        </div>
                    </Col>
                </Row>
                <Row style={{padding: AddServiceInfo.length > 0 ? '0.3rem 0': '0'}}>
                    {this.changeData(AddServiceInfo).map((item, index) => (
                        <div key={index}>
                            {item.list.map((childItem,childIndex)=>(
                                <div key={childIndex+"-childKey"} style={{textAlign:"right"}}>
                                    <div style={{float:"left"}} className={childIndex === 0 ? 'addService': 'addSrevice indent'}>{childIndex === 0 ? (item.GoodsTypeName + '：' + childItem.GoodsTitle): childItem.GoodsTitle}</div>{"￥"+childItem.GoodsPrice}
                                </div>
                            ))}
                        
                        </div>
                    ))}
                </Row>
                <div className="summary_container">
                    <p>{'x'+ GoodsNumber}</p>
                    <p><span style={{color: '#4DBECD'}}>小计：{"￥"+this.getGoodsPrice(MainProductPrice, AddServiceInfo, GoodsNumber, TotalShippingFee)}</span></p>
                    {IsOut === '1'? <p>运费： {'￥'+TotalShippingFee}</p>: null}
                    {/* <div style={{color:"#999999"}}>共{this.getGoodsCount(ProductList)}件商品</div>
                    <div style={{color:"#4BBDCC",fontSize:"1.3em"}}>{"￥"+ContractAmount}</div> */}
                    {/* <p style={{color:"#FFAA00"}}>（{GoodsAddValue}）</p> */}
                    {/* <span>合计：{Big(ContractAmount).toFixed(2)}</span>  */}
                </div>
                {/* <div className="row1" style={{width:"100%"}}>
                    <div className="col2" style={{display:"inline-flex",alignItems:"center"}}>
                    <div style={{padding:"10px 0",display:"flex",alignItems:"center"}}>
                        <div className="pic">
                        
                            <img src={JSON.parse(GoodsSeriesPhotos)[0]} alt="" />
                        
                        
                        </div>
                        <div className="col-1">
                        <div className="name"><Button type="primary" className={IsStandard=='1'?'blue':'yellow'}><small>{IsStandard=='1'?'标准品':'设计品'}</small></Button>{GoodsTitle}</div>
                        <div className="desc">{GoodsExplain}</div>
                        <div>{"￥"+MainProductPrice}</div>
                        </div>
                    </div>   
                    </div>
                    <div className="col1 center-border" >
                    <div style={{width:"100%",padding:"0 5px"}}>
                        {this.changeData(AddServiceInfo).map((item, index) => (
                            <div key={index+"parent"} className="desc">
                            <div style={index !==0?{textAlign:"center",marginTop:"5px"}:{textAlign:"center"}}>{item.GoodsTypeName}</div>
                            {item.list.map((childItem,childIndex)=>(
                                    <div key={childIndex+"-childKey"} style={{textAlign:"right"}}>
                                    <div style={{float:"left"}}>{childItem.GoodsTitle}</div>{"￥"+childItem.GoodsPrice}
                                    </div>
                            ))}
                            
                            </div>
                        ))}
                        </div>  
                    </div>
                    <div className="col3 col1-right">
                        <div style={{textAlign:"right",width:"100%",padding:"0 12px"}}>
                        <span style={{color:"#999999"}}>x{GoodsNumber}</span>
                        <div>
                        <div style={{float:"left"}}>小计：</div><span>￥{this.getChildTotalPrice(MainProductPrice,AddServiceInfo,GoodsNumber)}</span>
                        </div>
                        <div>
                        {OrderState!=='-2' && GoodsAddValue.indexOf("含运费")!==-1?<div><div style={{float:"left"}}>运费：</div><span>￥{TotalShippingFee}</span></div>:""}
                        </div>
                        </div>
                        
                    </div>
                </div> */}
            </div>
        );
      }
    sendOrderItem = () => {
        const s = appStore;
        const obj = {
            ContractNo: this.state.order.ContractNo,
            GoodsTitle: this.state.order.ProductList[0].GoodsTitle,
            ContractAmount: this.state.order.ContractAmount,
            ContractQuantity: this.getGoodsCount(this.state.order.ProductList),
            GoodsSeriesIcon: this.state.order.ProductList[0].GoodsSeriesIcon,
            GoodsExplain:this.state.order.ProductList[0].GoodsExplain,
            IsStandard: this.state.order.ProductList[0].IsStandard,
            IsStore: this.state.order.ProductList[0].IsStore || '1'
        };
        this.props.history.push('/mallChatting');
        if (s.client == null || s.client == undefined) {
            s.connet();
        }
        s.sendContract(obj);
    }
    // JPush 发送订单
    sendOrder = async() => {
        const orderData = {
            MsgContent: this.state.order.ContractNo,
            MsgType: 'Order',
            MsgNo: uuidv1(),
            CategoryBId: '001-002'
        };
        // const {
        //     ResultCode: code,
        //     ResultInfo: info,
        //     Data: data
        // } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
        //     MsgContent: this.state.order.ContractNo,
        //     MsgType: 'Order',
        //     MsgNo: uuidv1(),
        //     CategoryBId: '001-002'
        // });
        // if (code !== 0) {
        //     return message.error(info);
        // }
        this.props.history.push('/mallChatting');
        sessionStorage.setItem('OrderData', JSON.stringify(orderData));
    }
    payClick =(e) => {
        e.stopPropagation();
        this.setState({visible:true});
    }
    CheckContractPDf = (OrderNo, OrderState) => {
        // return Url.lookUrl+'/contract/'+OrderNo;
        this.props.history.push('/mallContract/'+ OrderNo + '/look');
    }
    getInvoice = () => {
        this.sendOrder();
    }
    showShippingDate = (ShippingDate) => {
        const ua = navigator.userAgent.toLowerCase();
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
            return ShippingDate && ShippingDate.replace(/-/g, '/');
        } else if (/android|adr/gi.test(ua)) {
            return moment(ShippingDate).format("YYYY[-]MM[-]DD");
        } else {
            return moment(ShippingDate).format("YYYY[-]MM[-]DD");
        }

    }
    render() {
        const {
            InDate,
            ContractNo,
            StorePhoto,
            StoreName,
            ProductList,
            IsIncludeTax,
            ContractAmount,
            GoodsAddValue,
            OrderState,
            HasPayFee,
            IsOut,
            MinPayAmount,
            AccountOfPartyA,
            BankOfPartyA,
            NameOfPartyA,
            TotalShippingFee,
            RemainInvoiceAmount
        } = this.state.order;
        const {UserName, MobileNumber, Province, City, County, District, Address} = this.state.shippingInfo;
        return (
            <div className='mall_OrderDetail' style={{backgroundColor: '#FFF', height: '100%'}}>
                {Number(OrderState) >= 0 && JSON.stringify(this.state.shippingInfo)!=='{}'? <div className="address">
                    <Row>
                        <Col span={2}>
                            <img style={{width: '20px'}} src={address} />
                        </Col>
                        <Col span={22}>
                            <p className="phone"><span>{UserName}</span><span style={{marginLeft: '1.5rem'}}>{MobileNumber}</span></p>
                            <p style={{wordBreak: 'break-all'}}>{Province+City+County+District+Address+''}</p>
                        </Col>
                        
                    </Row>
                </div>: null}
                
                <div className="order_container" style={{padding: '0'}}>
                    <p className="orderState">{this.getOrderStateLabel(OrderState, IsOut)}</p>
                    <div className="mall_order_item">
                
                    {/* <div className="title">
                    订单编号：{ContractNo}
                    
                    {IsIncludeTax==="1"?<small className="is-include-tax">含税</small>:null}
                    {ContractNo && ContractNo.slice(0,1)==="P" ?(<span><small className="is-include-tax">团</small>
                    <small className="is-include-tax">已付定金</small></span>):""}
                    
                    <div className='right-part'>
                        { IsOut==="1" && (OrderState!=="-2")?<div>已付金额&nbsp;&nbsp;{HasPayFee+
                                "/"+ContractAmount}</div>:""}
                        <span style={{color:'red'}}>{this.getOrderStateLabel(OrderState,IsOut)}</span>
                    </div>
                    </div> */}
                    <div>
                    <div>
                        {ProductList && ProductList.map((item, index) => this.renderGoods(item, index))}
                    </div>
                    {/* <div className="summary_container">
                        <p>{'x'+ this.getGoodsCount(ProductList)}</p>
                        <p><span style={{color: '#4DBECD'}}>小计：{"￥"+this.getTotalPrice(ProductList)}</span></p>
                        {IsOut === '1'? <p>运费： {'￥'+this.getTotalShippingFee(ProductList)}</p>: null}
                        <div style={{color:"#999999"}}>共{this.getGoodsCount(ProductList)}件商品</div>
                        <div style={{color:"#4BBDCC",fontSize:"1.3em"}}>{"￥"+ContractAmount}</div>
                        <p style={{color:"#FFAA00"}}>（{GoodsAddValue}）</p>
                        <span>合计：{Big(ContractAmount).toFixed(2)}</span>
                    </div> */}
                    <div className="summary_container">
                        <p>共{this.getGoodsCount(ProductList)}件商品  合计：<span style={{color: '#4DBECD'}}>{"￥"+ContractAmount}</span></p>
                        <p style={{color:"#FFAA00"}}>（{GoodsAddValue}）</p>
                    </div>

                    { IsOut==="1" && (OrderState!=="-2")?<div className='progressBar_container'>
                        已付金额&nbsp;&nbsp;
                        <span className="progress-bar">
                            <span style={{width: Number(((HasPayFee/ContractAmount)*100).toFixed(0)) <100 ? ((HasPayFee/ContractAmount)*100).toFixed(0)+'%': '100%' }}></span>
                            <label>{HasPayFee+"/"+ContractAmount}</label>
                        </span>
                        </div>:""
                    }
                    <div className="order_info_container">
                        <p className="line"></p>
                        <div className="order_info">
                        {Number(OrderState) >= 0 ? <Row onClick={this.CheckContractPDf.bind(this, ContractNo, OrderState)}>
                                <Col span={18}>
                                    <p>订单号： {ContractNo}</p>
                                    <p>创建时间：{InDate}</p>
                                </Col>
                                <Col span={6} style={{height: '4rem', lineHeight: '4rem', textAlign: 'right'}}>
                                    <Icon type="right"/>
                                </Col>
                            </Row>:<Row>
                                <Col span={24}>
                                    <p>订单号： {ContractNo}</p>
                                    <p>创建时间：{InDate}</p>
                                </Col>
                            </Row>
                        }
                        </div>
                    </div>
                    {OrderState === '4' && RemainInvoiceAmount !== 0? <div className="order_info_container">
                        <p className="line"></p>
                        <div className="order_info">
                            <Row onClick={this.getInvoice}>
                                <Col span={18}>
                                    <p>申请开票</p>
                                </Col>
                                <Col span={6} style={{marginTop: '6px' ,textAlign: 'right'}}>
                                    <Icon type="right"/>
                                </Col>
                            </Row>
                        </div>
                    </div>: null}
                    <div className="btn_container">
                        {OrderState === '-2'? <Button type="default" onClick={this.sendOrder}>合同洽谈</Button>: null}
                        {OrderState === '0' ? <div>
                            <Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button><Button type="default" onClick={this.payClick}>付款</Button>
                        </div>: null}
                        {OrderState === '1' || OrderState === '2' ? <div>
                            <Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>{HasPayFee < ContractAmount ? <Button type="default" onClick={this.payClick}>付尾款</Button>: null}
                        </div>: null}
                        {OrderState === '3' ? <div>
                            <Button type="default" className="logistic" onClick={this.logisticsDetail.bind(this, ContractNo)}>查看物流</Button><Button type="default"  onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>{HasPayFee < ContractAmount ? <Button type="default" onClick={this.payClick}>付尾款</Button>: null}
                        </div>: null}
                        {OrderState === '4' ? <div>
                            <Button type="default" className="logistic" onClick={this.logisticsDetail.bind(this, ContractNo)}>查看物流</Button><Button type="default"  onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>
                        </div>: null}
                    </div>
                    {/*
                    <div className="separator" />
                    <div className="operation">
                    {IsOut==="1"?(
                        <span>
                        {OrderState === "-2"?
                                <span key={1} className="btn-cancel">请到app端进行合同洽谈</span>: ''
                        }
                        {OrderState === "0"?
                                (
                                    [
                                    <Button key={2} type="primary" size="small" onClick={this.payClick.bind(this,IsIncludeTax,ContractNo,MinPayAmount)}>付预付款</Button>,
                                    <div key={3} style={{textAlign: 'center'}}><a  className="btn-cancel" onClick={this.openContractPDf.bind(this, ContractNo)} target="_blank">查看合同</a></div>
                                    ]
                                )
                            : ''
                        }
                        {OrderState === "1" ||OrderState === "2"?
                            (
                            [ <span key={4}>{
                                this.showBtn(HasPayFee,ContractAmount)?<Button  type="primary" size="small" onClick={this.payClick.bind(this,IsIncludeTax,ContractNo,MinPayAmount)}>付尾款</Button>:""
                            }</span>,
                                <div key={5} style={{textAlign: 'center'}}><a className="btn-cancel" onClick={this.openContractPDf.bind(this, ContractNo)} target="_blank">查看合同</a></div>,
                            ]
                            )
                            : ''
                        }
                        {OrderState === "3"?
                            (
                            [ <span key={7}>{
                                this.showBtn(HasPayFee,ContractAmount)?<Button  type="primary" size="small"    onClick={this.payClick.bind(this,IsIncludeTax,ContractNo,MinPayAmount)}>付尾款</Button>:""
                                }</span>,
                                <div key={8} style={{textAlign: 'center'}}><a className="btn-cancel" onClick={this.openContractPDf.bind(this, ContractNo)} target="_blank">查看合同</a></div>,
                                <Button key={10} type="primary" size="small" onClick={this.logisticsDetail.bind(this, ContractNo)}>物流详情</Button>
                            ]
                            )
                            : ''
                        }
                        {OrderState === "4"?
                            (
                            [
                                <div key={11}><a className="btn-cancel" onClick={this.openContractPDf.bind(this, ContractNo)} target="_blank">查看合同</a></div>,
                                <Button key={13} type="primary" size="small" onClick={this.logisticsDetail.bind(this, ContractNo)}>物流详情</Button>
                            ]
                            )
                            : ''
                        }
                    </span> ):
                    <Popconfirm key={453} title="确定删除此条数据?" onConfirm={this.deleteOrders.bind(this,ContractNo)}>
                        <Button key={45} type="primary" size="small">删除订单</Button>
                        </Popconfirm>   
                        }
                    
                    </div> */}
                    </div>
                    <Drawer
                        title="收款账号"
                        visible={this.state.visible}
                        maskClosable={true}
                        onClose={this.closeModal.bind(this,ContractNo,MinPayAmount)}
                        placement='bottom'
                        className="CompanyA_Account"
                        style={{
                            height: this.state.visible?'100%':'auto',
                            overflow: 'auto',
                        }}
                    >
                        <p>收款方:{NameOfPartyA}</p>
                        <p>开户行:{BankOfPartyA}</p>
                        <p>银行卡账号:{AccountOfPartyA}</p>
                        <Button type="primary" className="close" onClick={this.closeModal.bind(this,ContractNo,MinPayAmount)}>关闭</Button>
                    </Drawer>
                    {/* <Modal
                    title={null}
                    footer={null}
                    className="pay_modal"
                    visible={this.state.visible}
                    onCancel={this.closeModal.bind(this,ContractNo,MinPayAmount)}
                    > 
                    <p>收款方:{NameOfPartyA}</p>
                    <p>开户行:{BankOfPartyA}</p>
                    <p>开户账号:{AccountOfPartyA}</p>
                    </Modal> */}
                    <Modal
                    title="物流详情"
                    className="order-items-logistics-modal"
                    visible={this.state.logisticsModal}
                    cancelText="我知道了"
                    width={650}
                    onCancel={this.closeLogisticsModal}
                    > 
                    {
                        this.state.logistics.length===0?<div style={{height:"50px",textAlign:"center"}}>暂无物流信息！</div>:
                        <ul>
                            {this.state.logistics.map((shipItem,shipIndex)=>{

                                return <li key={shipIndex+"-shipIndex"} style={{textAlign: 'left'}}>
                                <div className="logistic_title">
                                    <p>{this.showShippingDate(shipItem.ShippingDate)}</p>
                                    <p>已发数量：{shipItem.ShippingNumber?shipItem.ShippingNumber:this.getShippingNumber(shipItem)}件</p>
                                    <p>物流单号：{shipItem.LogisticsBillNo}</p>
                                </div>
                                <div className="logistic_second-title">
                                    <p>车牌号码：{shipItem.ShippingPlate}</p>
                                    <p>联系电话：{shipItem.ShippingPhone}</p>
                                    </div>
                                    {shipItem && shipItem.Goods && shipItem.Goods.map((shippingGoodItem,shippingGoodItemIndex)=>{
                                        return  <div key={shippingGoodItemIndex+"-shippingGoodItemIndex"} className="" style={{borderTop: '1px solid #ccc'}}>
                                                    <span>{shippingGoodItem.GoodsReName}</span>
                                                    <span style={{float:"right"}}>{shippingGoodItem.ShippingNumber}件</span>
                                                </div>
                                    })} 
                                
                                </li>
                            })} 
                        </ul>
                    }
                    
                    </Modal>
                </div>
            </div>
                    
            </div>
        );
    }
}
export default withRouter(MallOrderDetail);