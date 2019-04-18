import * as React from 'react';
import { withRouter } from 'react-router-dom';
import {Row,Col,message} from 'antd';
import http from '../../service/Http';
import * as ClipboardJS from 'clipboard';
import './city-agent.css';
import vip from '../../assets/using-help/huiyuanA.png';
import adv from '../../assets/gift-img/adv.png';
import guajiang from '../../assets/using-help/guajiang.png';
import download from '../../assets/using-help/download.png';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
}
type State = {
    data:any,
    discount: any,
    CouponCode: any,
    Industry: any,
    isApp:any
}
class CityAgentRule extends React.Component<Props, State> {
    userId=''; 
    industry='';
    constructor(props: Props) {
        super(props);
        this.state = {
            data:[],
            discount:0,
            CouponCode: '',
            Industry:'',
            isApp:''
        };
    }
    async componentWillMount() {
        this.userId = this.props.match.params.userId;
        console.log(this.props.match.params.code)
        this.setState({
            isApp: this.props.match.params.code
        });
        await this.scratch();
    }
    download() {
        window.open('http://www.emake.cn/download/');
    }
    scratch = async() =>{
        
        const res = await http.get(Url.baseUrl+"/app/user/agent", {
            UserId: this.userId,
        });
        if (res.ResultCode === 0 && res.Data) {
            this.get = true;
            console.log(res.Data)
            this.setState({
                data: res.Data
            });
            this.promotionCode = res.Data[0]?res.Data[0].CouponCode:'';
            res.Data.map((item,index)=> {
                this.industry+=item.CategoryBName+(index!==res.Data.length-1?'/':'');
            })
            const arr = res.Data.map(item => {
                return Number(item.DisCount)*10;
            });
            this.discount = this.getMin(arr);
            this.setState({
                discount: this.discount,
                CouponCode: this.promotionCode,
                Industry: this.industry
            })
            this.board = new ClipboardJS("#giftCodeBtn");
            this.setState({});
            return;
        }
        if (res.ResultCode === -1 || res.ResultCode === -2) {
            message.warn(res.ResultInfo);
            return;
        }
        message.warn('网络错误！');
    }
    copy(){
        message.success("复制成功！");
    }
    getMin(arr) {
        return Math.min.apply(Math,arr);
    }
    render() {
        return (
            <div className='city-agent'>
                <img src={vip} style={{width: '100%'}}/>
                {this.state.isApp===undefined?<img src={download} style={{ position: 'fixed', right: '0',height: '115px',top: '110px'}}  onClick={this.download}/>:null}
                
                <div className='msg'>
                    <p>成为易智造会员</p>
                    <p>下单最高享<span className='max'>{this.state.discount}折</span>优惠</p>
                </div>
                <div className='scratch-area'>
                <p style={{fontSize:'0.8rem', color:'#F8695D', marginBottom:0,textAlign:'left'}}>输入优惠码</p>
                    {this.state.data.map((item,index) => (
                        <div className='cupon-img' key={index} style={{marginBottom:15}}>
                            <img src={guajiang} style={{width: '100%',height:'2.5rem'}}/>
                            <span className='tipMsg'>购买{item.CategoryBName}会员直减</span>
                            <span className='guajiang'>{item.CouponPrice}元</span>
                        </div>
                    ))}
                    <span className='get'>
                        优惠码：<span id='code'><input defaultValue={this.state.CouponCode} style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        width:'6rem',
                    }} /></span>
                        <button className='copy' id="giftCodeBtn" onClick={this.copy} data-clipboard-text={this.promotionCode}>复制</button>
                    </span>
                    <p className='grey'>仅限：{this.state.Industry}行业</p>
                </div>
                {/* <img src={adv} style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '44px' }}
                    onClick={this.download}/> */}
            </div>
        );
    }
}
export default withRouter(CityAgentRule);