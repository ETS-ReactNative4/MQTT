import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_confirmOrder.css';
import { Carousel, Row, Col, Button, message } from 'antd';
import address from '../../assets/mall/dizhi_iconw.png';
import edit from '../../assets/mall/dizhi_bianji.png';
import Http from '../../service/Http';
import Url from '../../service/Url';
import * as uuidv1 from 'uuid/v1';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    orderNo: '',
    order: {},
    address: {},
    UserName: '',
    MobileNumber: '',
    Province: '',
    City: '',
    County: '',
    District: '',
    Address: ''
}
class MallConfirmOrder extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            orderNo: '',
            order: {},
            address: {},
            UserName: '',
            MobileNumber: '',
            Province: '',
            City: '',
            County: '',
            District: '',
            Address: '',
            GoodsSeriesCode: ''
        };
    }
    componentWillMount() {
        const orderNo = this.props.match.params.code;
        const order = JSON.parse(sessionStorage.getItem('Order'));
        const address = sessionStorage.getItem('Address') ? JSON.parse(sessionStorage.getItem('Address')) : {};
        this.setState({
            orderNo: orderNo,
            order: order,
            address: address,
            UserName: address.UserName,
            MobileNumber: address.MobileNumber,
            Province: address.Province,
            City: address.City,
            County: address.County,
            District: address.District,
            Address: address.Address,
        });
    }
    getAddress = async () => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/user/address`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        console.log(data);
    }
    getVal = () => {
        if (this.state.order.CategoryId && this.state.order.CategoryId.length > 3) {
            return this.state.order.CategoryId.substring(0, 3) === "001" ? this.state.order.GoodsAddValue : this.state.order.GoodsAddValue2
        }
        return ""
    }
    configAddress = () => {
        const path = window.location.pathname;
        sessionStorage.setItem('LastPath', path);
        this.props.history.push('/mallConfigAddress');
    }
    getTotalPrice = () => {
        let price = this.state.order.GoodsPrice;
        this.state.order.AddServiceInfo.map(it => {
            price += it.GoodsType === '2' ? it.GoodsPrice : this.getBrandPrice(price, it.GoodsPrice);
        });
        return Math.floor(price * this.state.order.GoodsNumber * 100) / 100;
    }
    getBrandPrice = (GoodsPrice, BrandPrice) => {
        return Math.floor(GoodsPrice * BrandPrice * 100) / 100;
    }
    makeOrder = async () => {
        // if (this.state.address.UserName == undefined) {
        //     return message.info('请先配置地址');
        // }
        const MakeOrders = [
            {
                OrderNos: [this.state.orderNo], // # 购物车ID
                IsInvoice: '1',  // # 是否选择开票
                InsurdAmount: 0, //# 保额
                StoreId: 0,  //# 店铺ID
                Address: this.state.address.UserName !== undefined ? JSON.stringify(this.state.address) : '',  //# 收货地址
                CategoryBId: '001-002', //# 二级分类ID
                SuperGroupDetailId: '', //# 超级团ID
            }
        ];
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.post(Url.baseUrl + `/app/make/order`, {
            MakeOrders: MakeOrders
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        sessionStorage.setItem('OrderNoAfter', this.state.orderNo);
        // alert(MakeOrders[0].OrderNos[0]);
        // message.success('订单提交成功！');
        // this.props.history.push('/mallCenterOrder');
        // 跳转到聊天页面发订单消息
        const contractNo = data && data[0] ? data[0].OrderNo : '';
        if (contractNo !== '') {
            this.sendOrder(contractNo);
        }
    }
    // JPush 发送订单
    sendOrder = async (contractNo) => {
        const orderData = {
            MsgContent: contractNo,
            MsgType: 'Order',
            MsgNo: uuidv1(),
            CategoryBId: '001-002'
        }
        // const {
        //     ResultCode: code,
        //     ResultInfo: info,
        //     Data: data
        // } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
        //     MsgContent: contractNo,
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
    checkIsSubmit = async() => {
        const ShippingId = this.props.match.params.code;
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.get(Url.baseUrl + '/app/user/shopping', {
            CategoryAId: '001'
        });
        if (code !== 0) {
            return message.error(info);
        }
        const shippingList = data? data.filter(it => it.OrderNo == ShippingId): [];
        console.log(data, shippingList);
        // if (shippingList.length == 0) {
        //     // this.props.history.push('/mallGoodsDetail/'+ this.state.GoodsSeriesCode);
        //     // this.props.history.push('/mallIndex');
        //     return false;
        // }
        return true;
    }
    render() {
        return (

            <div className='mall_confirmOrder' style={{ backgroundColor: '#FFF', height: '100%' }}>
                {this.state.address.UserName !== undefined ? <div className="address" onClick={this.configAddress}>
                    <Row>
                        <Col span={2}>
                            <img style={{ width: '20px' }} src={address} />
                        </Col>
                        <Col span={22}>
                            <p className="phone"><span>{this.state.UserName}</span><span style={{ marginLeft: '1.5rem' }}>{this.state.MobileNumber}</span></p>
                            <p style={{ wordBreak: 'break-all' }}>{this.state.Province + this.state.City + this.state.County + this.state.District + this.state.Address + ''}</p>
                        </Col>

                    </Row>
                </div> : <p className="address" onClick={this.configAddress}>
                        <img style={{ width: '16px' }} src={address} />
                        <span style={{ float: 'right' }}>
                            <img style={{ width: '16px', marginRight: '5px' }} src={edit} />编辑地址
                    </span>
                    </p>}
                <div className="order_container">
                    <div className="title_container">
                        <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
                            <Col span={6}>
                                <div className="icon_box">
                                    <img style={{ maxWidth: '100%', maxHeight: '70px' }} src={this.state.order.GoodsSeriesIcon} />
                                </div>
                            </Col>
                            <Col span={18}>
                                <div className="main_box">
                                    {/* <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign:'bottom' }}><span className={this.state.order.IsStandard == '1' ? 'Standard' : 'notStandard'}>{this.state.order.IsStandard == '1' ? '标准品' : '设计品'}</span>{this.state.order.GoodsSeriesTitle}</p> */}
                                    <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign: 'bottom' }}>{this.state.order.GoodsSeriesTitle}</p>
                                    <p style={{ color: '#A1A1A1', marginBottom: '0.3rem' }}>{this.state.order.GoodsParams}</p>
                                    <p style={{ textAlign: 'right', color: '#000', marginBottom: '0.3rem' }}>{'￥' + this.state.order.GoodsPrice.toFixed(2)}</p>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
                            {this.state.order.AddServiceInfo.map((it, index) => (
                                <p key={index} className="appendix_brand">
                                    {it.GoodsType === '2' ? '附件：' : '品牌：'}{it.GoodsTitle}<span style={{ float: 'right' }}>￥{it.GoodsType === '2' ? it.GoodsPrice : this.getBrandPrice(this.state.order.GoodsPrice.toFixed(2), it.GoodsPrice)}</span>
                                </p>
                            ))}
                        </Row>
                        <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
                            <p style={{ fontSize: '12px', textAlign: 'right', color: '#A1A1A1', marginBottom: '0.3rem' }}>{'x' + this.state.order.GoodsNumber}</p>
                            <p style={{ textAlign: 'right', color: '#000', marginBottom: '0.3rem' }}>小计：{'￥' + this.getTotalPrice()}</p>
                        </Row>
                        <Row>
                            <p style={{ fontSize: '12px', textAlign: 'right', marginBottom: '0' }}>共{this.state.order.GoodsNumber}件商品 合计：<span style={{ color: '#4DBECD', fontSize: '14px' }}>{'￥' + this.getTotalPrice()}</span></p>
                            <p style={{ color: "#ffc358", fontSize: "12px", margin: "0", textAlign: 'right' }}>({this.getVal()})</p>
                        </Row>
                    </div>
                </div>
                <div className='confirm_container'>
                    <p style={{ textAlign: 'right' }}>合计：<span style={{ color: '#4DBECD', fontSize: '14px' }}>{'￥' + this.getTotalPrice()}</span><Button type="primary" onClick={this.makeOrder} style={{ fontSize: '16px', color: '#FFF' }}>提交订单</Button></p>
                </div>
            </div>
        )
        // console.log(11111111);
        // this.checkIsSubmit() ? ()
        // if (this.checkIsSubmit()) {
        //     return (
        //         <div className='mall_confirmOrder' style={{ backgroundColor: '#FFF', height: '100%' }}>
        //             {this.state.address.UserName !== undefined ? <div className="address" onClick={this.configAddress}>
        //                 <Row>
        //                     <Col span={2}>
        //                         <img style={{ width: '20px' }} src={address} />
        //                     </Col>
        //                     <Col span={22}>
        //                         <p className="phone"><span>{this.state.UserName}</span><span style={{ marginLeft: '1.5rem' }}>{this.state.MobileNumber}</span></p>
        //                         <p style={{ wordBreak: 'break-all' }}>{this.state.Province + this.state.City + this.state.County + this.state.District + this.state.Address + ''}</p>
        //                     </Col>
    
        //                 </Row>
        //             </div> : <p className="address" onClick={this.configAddress}>
        //                     <img style={{ width: '16px' }} src={address} />
        //                     <span style={{ float: 'right' }}>
        //                         <img style={{ width: '16px', marginRight: '5px' }} src={edit} />编辑地址
        //                 </span>
        //                 </p>}
        //             <div className="order_container">
        //                 <div className="title_container">
        //                     <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
        //                         <Col span={6}>
        //                             <div className="icon_box">
        //                                 <img style={{ maxWidth: '100%', maxHeight: '70px' }} src={this.state.order.GoodsSeriesIcon} />
        //                             </div>
        //                         </Col>
        //                         <Col span={18}>
        //                             <div className="main_box">
        //                                 {/* <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign:'bottom' }}><span className={this.state.order.IsStandard == '1' ? 'Standard' : 'notStandard'}>{this.state.order.IsStandard == '1' ? '标准品' : '设计品'}</span>{this.state.order.GoodsSeriesTitle}</p> */}
        //                                 <p className="title" style={{ color: "#000000", fontSize: "14px", verticalAlign: 'bottom' }}>{this.state.order.GoodsSeriesTitle}</p>
        //                                 <p style={{ color: '#A1A1A1', marginBottom: '0.3rem' }}>{this.state.order.GoodsParams}</p>
        //                                 <p style={{ textAlign: 'right', color: '#000', marginBottom: '0.3rem' }}>{'￥' + this.state.order.GoodsPrice.toFixed(2)}</p>
        //                             </div>
        //                         </Col>
        //                     </Row>
        //                     <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
        //                         {this.state.order.AddServiceInfo.map((it, index) => (
        //                             <p key={index} className="appendix_brand">
        //                                 {it.GoodsType === '2' ? '附件：' : '品牌：'}{it.GoodsTitle}<span style={{ float: 'right' }}>{'￥' + it.GoodsType === '2' ? it.GoodsPrice : this.getBrandPrice(this.state.order.GoodsPrice.toFixed(2), it.GoodsPrice)}</span>
        //                             </p>
        //                         ))}
        //                     </Row>
        //                     <Row style={{ borderBottom: '1px solid #F2F2F2' }}>
        //                         <p style={{ fontSize: '12px', textAlign: 'right', color: '#A1A1A1', marginBottom: '0.3rem' }}>{'x' + this.state.order.GoodsNumber}</p>
        //                         <p style={{ textAlign: 'right', color: '#000', marginBottom: '0.3rem' }}>小计：{'￥' + this.getTotalPrice()}</p>
        //                     </Row>
        //                     <Row>
        //                         <p style={{ fontSize: '12px', textAlign: 'right', marginBottom: '0' }}>共{this.state.order.GoodsNumber}件商品 合计：<span style={{ color: '#4DBECD', fontSize: '14px' }}>{'￥' + this.getTotalPrice()}</span></p>
        //                         <p style={{ color: "#ffc358", fontSize: "12px", margin: "0", textAlign: 'right' }}>({this.getVal()})</p>
        //                     </Row>
        //                 </div>
        //             </div>
        //             <div className='confirm_container'>
        //                 <p style={{ textAlign: 'right' }}>合计：<span style={{ color: '#4DBECD', fontSize: '14px' }}>{'￥' + this.getTotalPrice()}</span><Button type="primary" onClick={this.makeOrder} style={{ fontSize: '16px', color: '#FFF' }}>提交订单</Button></p>
        //             </div>
        //         </div>
        //     )
        // } else {
        //     return <span>22</span>
        // }
        
    }
}
export default withRouter(MallConfirmOrder);