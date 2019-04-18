// @flow
import * as React from 'react';
import { Button, Modal,message,Popconfirm, Row, Col, Drawer } from 'antd';
// import Big from 'big.js';
import './MallOrder.css';
import Http from '../../service/Http';
// import { isObject } from 'util';
import * as moment from 'moment';
import kefu from '../../assets/mall/kufu30.png';
import { appStore } from '../../pages/app.store';
import Url from '../../service/Url';
import * as uuidv1 from "uuid/v1";

type Props = {
  order: any,
  orderState:any,
  deleteChange():void,
  history: { push: (string) => void },
}

type State = {visible:boolean,logisticsModal:boolean,shippingInfo:any}

// const unpaid = '0';
// const producing = '1';
// const inWare = '2';
// const sent = '3';

class MallOrder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible:false,logisticsModal:false, shippingInfo:[]};
  }

  payClick =(e) => {
      e.stopPropagation();
   // message.warn('暂未支持支付');
   this.setState({visible:true});
//    if(IsIncludeTax==="0"){
//         // 不含税订单，跳转付款页面，网银支付
//         if(MinPayAmount===0) {
//           message.info('付款金额不能等于0！');
//           return;
//         }
//         const {
//           ResultCode: code,
//           ResultInfo: info,
//           Data: data,
//         } = await Http.get('app/haier/order?PayType=2&&Price='+MinPayAmount+'&&OrderNo='+ContractNo);
//         if(code===0){
//           window.open(data);
//          }else{
//            message.error(info);
//          }
//     }else{
//       // 含税订单，弹出对公账号
//       this.setState({visible:true});
//     }
  };

  cancelClick = () => {

  };
  openContractPDf = async(contractNo: any) => {
    const {
      ResultCode: code,
      ResultInfo: info,
      Data: data,
    }  = await Http.get('app/contractpdf', {
      ContractNo: contractNo
    });
    if (code !== Http.ok) {
      return message.error(info);
    }
    window.open(data,'_blank');
  }
  getChildTotalPrice=(MainProductPrice,AddServiceInfo,GoodsNumber)=>{
    let price=MainProductPrice;
      for(let i=0;i<AddServiceInfo.length;i++){
        price+=AddServiceInfo[i].GoodsPrice;

      };

      return parseFloat(price*GoodsNumber).toFixed(2);
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
  showBtn=(HasPayFee:any,ContractAmount:any)=>{
       if(HasPayFee<ContractAmount){
          return true;
       } else {
          return false;
       }
        
  }
  applyBill=()=>{
    message.warn("该功能暂时不做！");
  }
  deleteOrders=async (ContractNo:any)=>{
     const {
      ResultCode: code,
      ResultInfo: info,
     } = await Http.delete('app/user/order?ContractNo='+ContractNo);
      if(code===0){
        this.props.deleteChange();
       }else{
         message.error(info)
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
    console.log(data)
    this.setState({
      shippingInfo: data
    });

    this.setState({logisticsModal:true})
  }
  getShippingNumber =(shipItem:any) => {
    let ShippingNumber = 0;
    if(shipItem.Goods) {
      shipItem.Goods.map(item => {
        ShippingNumber+=item.ShippingNumber;
      });
      return ShippingNumber
    }
  }
  closeLogisticsModal=(e)=>{
    this.setState({logisticsModal:false});
    e.stopPropagation();
 }
  closeModal=async (ContractNo:any,MinPayAmount:any, e )=>{
      e.stopPropagation();
        this.setState({visible:false});
    }
  renderGoods({IsStandard, GoodsTitle, GoodsExplain, GoodsNumber, GoodsSeriesPhotos, GoodsSeriesIcon, AddServiceInfo,MainProductPrice,TotalShippingFee }: any, key: any,) {
    const { GoodsAddValue, OrderState} =this.props.order;

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
                        <p style={{float:'right', marginBottom: '0.3rem'}}>{'x'+GoodsNumber}</p>
                        {/* <p style={{textAlign: 'right', color: '#000', marginBottom: '0.3rem'}}>{'￥'+ this.state.order.GoodsPrice.toFixed(2)}</p> */}
                    </div>
                </Col>
            </Row>
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
    toOrderDetail = (OrderNo) => {
        this.props.history.push('/mallOrderDetail/'+OrderNo);
    }
    toChat = (e) => {
        e.stopPropagation();
        const {ContractNo} = this.props.order;
        this.props.history.push('/mallChatting/' + ContractNo + '/' + 'order');
    }
    sendOrderItem = (e) => {
        e.stopPropagation();
        const s = appStore;
        const obj = {
            ContractNo: this.props.order.ContractNo,
            GoodsTitle: this.props.order.ProductList[0].GoodsTitle,
            ContractAmount: this.props.order.ContractAmount,
            ContractQuantity: this.getGoodsCount(this.props.order.ProductList),
            GoodsSeriesIcon: this.props.order.ProductList[0].GoodsSeriesIcon,
            GoodsExplain:this.props.order.ProductList[0].GoodsExplain,
            IsStandard: this.props.order.ProductList[0].IsStandard,
            ContractState: this.props.order.OrderState,
            IsStore: '1'
        };
        this.props.history.push('/mallChatting');
        if (s.client == null || s.client ==undefined) {
            s.connet();
        }
        s.sendContract(obj);
        
    }
    // JPush 发送订单
    sendOrder = async(e) => {
        e.stopPropagation();
        const orderData = {
          MsgContent: this.props.order.ContractNo,
            MsgType: 'Order',
            MsgNo: uuidv1(),
            CategoryBId: '001-002'
        }
        // const {
        //     ResultCode: code,
        //     ResultInfo: info,
        //     Data: data
        // } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
        //     MsgContent: this.props.order.ContractNo,
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
    showShippingDate = (ShippingDate) => {
        const ua = navigator.userAgent.toLowerCase();
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
            return ShippingDate && ShippingDate.split('-').join('/');
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
      ShippingInfo,
    } = this.props.order;
    // const {orderState}=this.props;
    return (
        <div onClick={this.toOrderDetail.bind(this, ContractNo)}>
            <div style={{padding:"5px 0.6rem", backgroundColor: '#FAFAFA'}}>
                <span>订单编号：{ContractNo}</span>
                {/* <img  src={StorePhoto} style={{width:"20px",height:"20px"}} alt="" />&nbsp;&nbsp;{StoreName}{IsIncludeTax==="1"?<small className="is-include-tax">含税</small>:null} */}
                <span style={{color:'red', float:'right',fontSize: '12px'}}>{this.getOrderStateLabel(OrderState,IsOut)}</span>
            </div> 
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
                <div className="summary_container">
                    <p>共{this.getGoodsCount(ProductList)}件商品&nbsp;&nbsp;合计：<span style={{color: '#4DBECD'}}>{"￥"+ContractAmount}</span></p>
                    {/* <div style={{color:"#999999"}}>共{this.getGoodsCount(ProductList)}件商品</div>
                    <div style={{color:"#4BBDCC",fontSize:"1.3em"}}>{"￥"+ContractAmount}</div> */}
                    <p style={{color:"#FFAA00"}}>（{GoodsAddValue}）</p>
                    {/* <span>合计：{Big(ContractAmount).toFixed(2)}</span>  */}
                </div>
                { IsOut==="1" && (OrderState!=="-2")?<div className='progressBar_container'>
                    已付金额&nbsp;&nbsp;
                    <span className="progress-bar">
                        <span style={{width: Number(((HasPayFee/ContractAmount)*100).toFixed(0)) <100 ? ((HasPayFee/ContractAmount)*100).toFixed(0)+'%': '100%' }}></span>
                        <label>{HasPayFee+"/"+ContractAmount}</label>
                    </span>
                    </div>:""
                }
                <div className="btn_container">
                    {OrderState === '-2'? <Button type="default" onClick={this.sendOrder}>合同洽谈</Button>: null}
                    {OrderState === '0' ? <div>
                        <Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button><Button type="default" onClick={this.payClick}>付款</Button>
                    </div>: null}
                    {OrderState === '1' || OrderState === '2' ? <div>
                        <Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>{HasPayFee < ContractAmount ? <Button type="default" onClick={this.payClick}>付尾款</Button>: null}
                    </div>: null}
                    {OrderState === '3'? <div>
                        <Button type="default" className="logistic" onClick={this.logisticsDetail.bind(this, ContractNo)}>查看物流</Button><Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>{HasPayFee < ContractAmount ? <Button type="default" onClick={this.payClick}>付尾款</Button>:null}
                    </div>: null}
                    {OrderState === '4' ? <div>
                        <Button type="default" className="logistic" onClick={this.logisticsDetail.bind(this, ContractNo)}>查看物流</Button><Button type="default" onClick={this.sendOrder}><img style={{width: '26px'}} src={kefu}/>客服</Button>
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
                    this.state.shippingInfo.length===0?<div style={{height:"50px",textAlign:"center"}}>暂无物流信息！</div>:
                    <ul>
                {this.state.shippingInfo.map((shipItem,shipIndex)=>{

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
                            return  <div key={shippingGoodItemIndex+"-shippingGoodItemIndex"} style={{borderTop: '1px solid #ccc'}}>
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
    );
  }
}

export default MallOrder;