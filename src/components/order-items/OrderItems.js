// @flow
import * as React from 'react';
import { Button, Modal,message,Popconfirm } from 'antd';
// import Big from 'big.js';
import './OrderItems.css';
import Http from '../../service/Http';
// import { isObject } from 'util';
import * as moment from 'moment';
import nopic from '../../assets/img/nopic.png';

type Props = {
  order: any,
  orderState:any,
  deleteChange():void,
}

type State = {visible:boolean,logisticsModal:boolean,shippingInfo:any}

// const unpaid = '0';
// const producing = '1';
// const inWare = '2';
// const sent = '3';

class OrderItems extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {visible:false,logisticsModal:false, shippingInfo:[]};
  }

  payClick =async (IsIncludeTax:any,ContractNo:any,MinPayAmount:any) => {
   // message.warn('暂未支持支付');
  //  this.setState({visible:true});
   if(IsIncludeTax==="0"){
        // 不含税订单，跳转付款页面，网银支付
        if(MinPayAmount===0) {
          message.info('付款金额不能等于0！');
          return;
        }
        const {
          ResultCode: code,
          ResultInfo: info,
          Data: data,
        } = await Http.get('app/haier/order?PayType=2&&Price='+MinPayAmount+'&&OrderNo='+ContractNo);
        if(code===0){
          window.open(data);
         }else{
           message.error(info);
         }
    }else{
      // 含税订单，弹出对公账号
      this.setState({visible:true});
    }
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
  logisticsDetail=async(contractNo:any)=>{
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
  closeLogisticsModal=()=>{
    this.setState({logisticsModal:false})
 }
  closeModal=async (ContractNo:any,MinPayAmount:any)=>{
        this.setState({visible:false});
    }
  renderGoods({IsStandard, GoodsTitle, GoodsExplain, GoodsNumber, GoodsSeriesPhotos, GoodsSeriesIcon, AddServiceInfo,MainProductPrice,TotalShippingFee }: any, key: any,) {
    const { GoodsAddValue, OrderState} =this.props.order;

    return (

      <div className="goods-item" key={key+"-key"}>
         <div className="row1" style={{width:"100%"}}>
            <div className="col2" style={{display:"inline-flex",alignItems:"center"}}>
              <div style={{padding:"10px 0",display:"flex",alignItems:"center"}}>
                <div className="pic">
                 
                     <img src={GoodsSeriesPhotos !=='' ? JSON.parse(GoodsSeriesPhotos)[0]: GoodsSeriesIcon} alt="" />
                 
                 
                </div>
                <div className="col-1">
                {/* <div className="name"><Button type="primary" className={IsStandard=='1'?'blue':'yellow'}><small>{IsStandard=='1'?'标准品':'设计品'}</small></Button>{GoodsTitle}</div> */}
                  <div className="name">{GoodsTitle}</div>
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
        </div>
      </div>
    );
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
      <div>
          <div style={{padding:"5px 20px"}}>
             <img  src={StorePhoto} style={{width:"20px",height:"20px"}} alt="" />&nbsp;&nbsp;{StoreName}
             <span style={{float:"right" ,color:"rgb(153, 153, 153)"}}>{InDate}</span>
            </div> 
          <div className="component-order-items">
            
            <div className="title">
              订单编号：{ContractNo}
              
              {IsIncludeTax==="1"?<small className="is-include-tax">含税</small>:null}
              {ContractNo && ContractNo.slice(0,1)==="P" ?(<span><small className="is-include-tax">团</small>
              <small className="is-include-tax">已付定金</small></span>):""}
              
              <div className='right-part'>
                { IsOut==="1" && (OrderState!=="-2")?<div>已付金额&nbsp;&nbsp;{HasPayFee+
                        "/"+ContractAmount}</div>:""}
                <span style={{color:'red'}}>{this.getOrderStateLabel(OrderState,IsOut)}</span>
              </div>
            </div>
            <div className="detail">
              <div className="goods">
                {ProductList && ProductList.map((item, index) => this.renderGoods(item, index))}
              </div>
              <div className="separator" />
              <div className="info">
                <div style={{color:"#999999"}}>共{this.getGoodsCount(ProductList)}件商品</div>
                <div style={{color:"#4BBDCC",fontSize:"1.3em"}}>{"￥"+ContractAmount}</div>
                <span style={{color:"#FFAA00"}}>{GoodsAddValue}</span>
                {/* <span>合计：{Big(ContractAmount).toFixed(2)}</span> */}
              </div>
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
              
              </div>
            </div>
            <Modal
              title="收款账号"
              className="order-items-modal"
              visible={this.state.visible}
              cancelText="我知道了"
              onCancel={this.closeModal.bind(this,ContractNo,MinPayAmount)}
            > 
              <div>付款完成后，请尽快与我们联系。<span style={{color:"rgb(255, 170, 0)"}}>客服电话  400-867-0211</span></div> 
              <p><label>收款方</label> {NameOfPartyA}</p>
              <p><label>银行账号</label> {AccountOfPartyA}</p>
              <p><label>开户行</label> {BankOfPartyA}</p>
            </Modal>
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

                   return <li key={shipIndex+"-shipIndex"}>
                   <div className="title">
                      <span className="time">{moment(shipItem.ShippingDate).format("YYYY[-]MM[-]DD")}</span>
                      <span>已发数量：{shipItem.ShippingNumber?shipItem.ShippingNumber:this.getShippingNumber(shipItem)}件</span>
                      <span style={{float:"right"}}>物流单号：{shipItem.LogisticsBillNo}</span>
                   </div>
                   <div className="second-title">
                      <span className="time">车牌号码：{shipItem.ShippingPlate}</span>
                      <span>联系电话：{shipItem.ShippingPhone}</span>
                      </div>
                     {shipItem && shipItem.Goods && shipItem.Goods.map((shippingGoodItem,shippingGoodItemIndex)=>{
                         return  <div key={shippingGoodItemIndex+"-shippingGoodItemIndex"} className="good-list">
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

export default OrderItems;