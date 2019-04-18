import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_cashier.css';
import { Carousel, Row, Col, Button, Checkbox, message } from 'antd';
import wechat from '../../assets/mall/weixinzhifu.png';
import alipay from '../../assets/mall/zhifubaozhifu.png';
import Http from '../../service/Http';
import Url from '../../service/Url';
// import * as AP from '../../pages/AlipayJSAPI';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    params: {},
    payWay: ''
}
class MallCashier extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            params: {},
            payWay: 'wechat'
        };
    }
    componentWillMount() {
        this.setState({
            params: JSON.parse(this.props.match.params.info)
        });
        // this.ready(() => {
        //     alert('bridge ready');
        //     console.log(window.AlipayJSBridge);
        // })
        // alert(this.props.match.params)
    }
    componentDidMount() {
        // this.ready(() => {
        //     alert('bridge ready');
        //     console.log(window.AlipayJSBridge);
        // })
        // const ap = window._AlipayJSBridge;
        // alert(ap);
    }
    selectPayWay = (value) => {
        console.log(value);
        this.setState({
            payWay: value
        });
    }
    ready(callback) {
        if (window.AlipayJSBridge) {
            callback && callback();
        } else {
            document.addEventListener('AlipayJSBridge', callback, false);
        }
    }
    aliPay = async () => {
        // console.log(this.state.params);
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.post(Url.baseUrl + '/app/alipay/order', {
            TotalAmount: this.state.params.VipFee,
            PayClass: '1', 
            RequestType: '1', // 0 app 1 web
            Params: {
                CategoryBIds: ['001-002'],
                CouponCode: ''
            }
        });
        if (code !== Http.ok) {
            return message.error(code + ':' + info);
        }
        console.log(data);
        // console.log(window.AlipayJSBridge);
        // const pairs = data.split('&').map(it => it.split('='))
        // pairs.forEach(it => {
        //     if (it[0] === 'method') {
        //         it[1] = 'alipay.trade.wap.pay'
        //     }
        // })
        // console.log(pairs)
        // window.open('https://m.alipay.com/GkSL?' + data);
        // window.open('http://openapi.alipay.com/gateway.do?'+ data);
        // window.location = 'http://m.alipay.com/Gk8NF23?'+ data;
        // AlipayJSBridge.call("tradePay", {
        //     orderStr: data,
        // }, function (result) {
        //     alert(JSON.stringify(result));
        // });
        // const msg = data.split('&');
        // const notify_urlList = msg.filter(it => {
        //     return it.indexOf('notify_url') !== -1
        // });
        // const notify_url = decodeURIComponent(notify_urlList[0].split('=')[1]);
        // console.log(notify_url);
        // window.open(notify_url);
        // const ap = window.AP;
        // console.log(ap);
        // ap.showToast('345')
        // AP.showToast({
        //     content: '请稍候···',
        //     duration: 3000
        //   }, function(){
        //     ap.alert('toast消失了');
        //   });
        // window.open('alipays://platformapi/startapp?appId=2018090661240573')
        // ap.tradePay({
        //     orderStr: data
        // }, (res) => {
        //     alert(res);
        // });
        // this.ready(() => {
        //     window.AlipayJSBridge.call('toast', {
        //         content: 'hello'
        //     });
        // });
        // const list=decodeURIComponent(data).split("&");
        // //创建一个表单
        // var form1 = document.createElement("form"); 
        // form1.id = "form1"; 
        // form1.name = "form1"; 
        // // 添加到 body 中 
        // document.body.appendChild(form1);
        // // 创建一个输入 
        // for(var i in list){
        //     var input = document.createElement("input"); 
        //     input.type = "text"; 
        //     const [name, value] = list[i].split('=')
        //     input.name = name; 
        //     input.value=value;
        //     form1.appendChild(input);
        // }
        // // 设置相应参数 
        // // 将该输入框插入到 form 中 
        // // form1.method = "POST"
        // form1.method = "POST";
        // form1.action = 'https://openapi.alipay.com/gateway.do'; 
        // // 对该 form 执行提交 
        // // form1.submit();
        // console.log(form1, list)
        window.location = 'https://openapi.alipay.com/gateway.do?' + data

    }
    wechatPay = async () => {
        // window.location.href= 'weixin://wap/pay';
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.post(Url.baseUrl + '/app/wechat/order', {
            TotalAmount: this.state.params.VipFee,
            PayClass: '1',
            Params: {
                CategoryBIds: ['001-002'],
                CouponCode: ''
            }
        });
        if (code !== Http.ok) {
            return message.error(code + ':' + info);
        }
        // this.wxpay(data);
        alert(JSON.stringify(data));
        window.location.href= 'weixin://wap/pay?appid=' + data.appid + '&noncestr='+ data.noncestr+ '&package='+ data.package+ '&prepayid='+ data.prepayid+ '&sign='+ data.sign+ '&timestamp='+ data.timestamp;
        this.onBridgeReady(data.appid, data.timestamp, data.noncestr, data.package, 'MD5', data.sign);

    }
    payForVip = async () => {
        if (this.state.payWay === 'wechat') {
            await this.wechatPay();
        } else {
            await this.aliPay();
        }
    }
    onBridgeReady = (appId, timeStamp, nonceStr, packageVal, signType, paySign) => {
        const WeixinJSBridge = window.WeixinJSBridge;
        if (typeof WeixinJSBridge == 'undefined') {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
            } else {
                this.onBridgeReady();
            }
            
        }
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                'appId': appId,
                'timeStamp': timeStamp, //时间戳，自1970年以来的秒数 
　　　　　　　　　'nonceStr': nonceStr, //随机串 
　　　　　　　　　'package': packageVal,   //订单详情扩展字符串
　　　　　　　　　'signType': signType, //微信签名方式： 
　　　　　　　　　'paySign': paySign //微信签名 
            }, res => {
                if(res.err_msg == "get_brand_wcpay_request:ok" ) {
    　　　　　　　　  // 表示已经支付,res.err_msg将在用户支付成功后返回 ok。 
    　　　　　　　　　window.location.href="回调成功的url,支付成功页面";
    　　　　　　　}
                // alert(res);
            }
        );
        // if (typeof WeixinJSBridge == 'undefined') {
        //     if (document.addEventListener) {
        //         document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        //     } else if (document.attachEvent) {
        //         document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
        //         document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        //     } else {
        //         this.onBridgeReady();
        //     }
            
        // }
    }
    wxpay = (res) => {
        // wx.config({
        //     debug: false, 
        //     appId: res['appid'],
        //     timestamp: res['timestamp'],
        //     nonceStr: res['noncestr'],
        //     signature: res['sign'],
        //     jsApiList: ['chooseWXPay']
        // });
        // wx.ready(() => {
        //     wx.chooseWXPay({
        //         timestamp: res['timestamp'],
        //         nonceStr: res['noncestr'],
        //         package: res['package'],
        //         signType: res['MD5'],
        //         paySign: res['sign'],
        //         success: function(res) {
        //             console.log(res);
        //         },
        //         fail: function(res){
        //             console.log(JSON.stringify(res));
        //         }
        //     });
        // });
        // wx.error((response) => {
        //     console.log(JSON.stringify(response));
        // });
    }
    
    render() {
        return (
            <div className='mall_cashier'>
                <p className="payWay">选择支付方式</p>
                <ul style={{ borderBottom: '1px solid #E4E4E4' }}>
                    <li className="payLi">
                        <img src={wechat} />微信支付<Checkbox className="payCheck" value="wechat" checked={this.state.payWay === 'wechat'} onChange={this.selectPayWay.bind(this, 'wechat')}></Checkbox>
                    </li>
                    <li className="payLi">
                        <img src={alipay} />支付宝支付<Checkbox className="payCheck" value="alipay" checked={this.state.payWay === 'alipay'} onChange={this.selectPayWay.bind(this, 'alipay')}></Checkbox>
                    </li>
                </ul>
                <div className="btnGroup">
                    <Button onClick={this.payForVip}>￥{this.state.params.VipFee} 确认支付</Button>
                </div>
            </div>
        );
    }
}
export default withRouter(MallCashier);