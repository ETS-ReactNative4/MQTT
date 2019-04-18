import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_vip.css';
import { Carousel, Row, Col, Button, message} from 'antd';
import redb from '../../assets/mall/huiyuan01.png';
import greyb from '../../assets/mall/huiyuanka.png';
import Http from '../../service/Http';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    Category: {},
    IdentifyCategorys: []
}
class MallVip extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            Category: {},
            IdentifyCategorys: []
        };
    }
    async componentWillMount() {
        
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl +`/app/user/vip`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        const category = data.Categorys.filter(it =>it.CategoryId==='001-002')[0];
        this.setState({
            Category: category,
            IdentifyCategorys: data.IdentifyCategorys.filter(it => it.CategoryId==='001-002')
        });
        const access_token = sessionStorage.getItem('Access_token');
        console.log(access_token);
    }
    viewRule = () => {
        this.props.history.push('/vipinfo');
    }
    payVip = () => {
        // const ua = navigator.userAgent.toLowerCase();
        // if (ua.indexOf("micromessenger") !== -1) {
        //     alert('微信请在右上角浏览器打开！')
        //     return;
        // }
        // if (ua.indexOf('iPhone') !== -1) {
        //     window.location = 'emake://emake.user';
        //     setTimeout(() => {
        //         window.location = 'https://itunes.apple.com/cn/app/id1260429389';
        //     }, 500)
        // } else if (ua.indexOf('android') !== -1) {
        //     window.location = 'emake://emake.user';
        //     setTimeout(() => {
        //         window.location = 'http://www.emake.cn/download/';
        //     }, 500)
        // } else {
        //     window.location = 'http://www.emake.cn/download/';
        // }
        this.props.history.push('/mallDownload');
    }
    render() {
        return (
            <div className='mall_vip'>
                <div className="rule_container">
                    <p><img src={redb}/><span className='vip'>易智造会员</span></p>
                    <Button className="rule_button" onClick={this.viewRule}>会员说明</Button>
                </div>
                <div className='vip_card'>
                    <img src={greyb} className="bg"/>
                    <p style={{position: 'absolute', top: '145px', color: '#FFF',fontSize: '16px',width: '100%'}}>
                    {this.state.IdentifyCategorys.length == 0 ? '开通会员，订单额享'+this.state.Category.DisCount*10+'折优惠': '订单额'+this.state.IdentifyCategorys[0].DisCount*10+','+this.state.IdentifyCategorys[0].EndTime+'到期'}
                    </p>
                </div>
                {this.state.IdentifyCategorys.length == 0 ? <div className="btn">
                    <a id="href_true" style={{display:'block', width: '100%', height: '40px'}}><Button style={{fontSize: '13px'}} className="payButton" onClick={this.payVip}>需支付{this.state.Category.VipFee}元</Button></a>
                </div>: ''}
                
            </div>
        );
    }
}
export default withRouter(MallVip);