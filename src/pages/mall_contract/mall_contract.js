import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_contract.css';
import { Carousel, Row, Col, Button, message, Checkbox} from 'antd';
import redb from '../../assets/mall/huiyuan01.png';
import greyb from '../../assets/mall/huiyuanka.png';
import Http from '../../service/Http';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
}
class MallContract extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        const contractNo = this.props.match.params.code;
        console.log(contractNo);
        const contractState = this.props.match.params.type;
        this.setState({
            contractNo: contractNo,
            contractUrl: Url.lookUrl+'/indcont/'+ contractNo +'/' + contractState,
            postContract: false,
            contractState: contractState
        });
        // this.getOrderDetail(contractNo);
        // console.log(Url.lookUrl+'/indcont/'+ contractNo +'/' + contractState);
    }


    signContract = async() => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/web/contract/sign/`+ this.state.contractNo, {
            IsPost: this.state.postContract? '1': '0'
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        message.success('合同签订成功！');
        this.props.history.push('/mallChatting');
    }
    checkChange = (e) => {
        this.setState({
            postContract: !this.state.postContract
        });
    }
    componentWillUnmount = () => {
        window.removeEventListener('message', this.ListenMessage);
    }
    componentDidMount = () => {
        this.checkNavigator();
        const myIframe = document.getElementById('myIframe');
        myIframe.onload = () => {
            window.onmessage = this.ListenMessage;
            window.alert = () => {
                return false;
            }
        }
    }
    ListenMessage = (e) => {
        const data = e.target;
        if (data !== undefined && data !== null) {
            message.success('合同签订成功！');
            this.props.history.push('/mallChatting');
        }
    }
    checkNavigator = () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
            this.setState({
                scrolling: true
            });
        } else if (/android|adr/gi.test(ua)) {
           this.setState({
               scrolling: undefined
           })
        } else {
            this.setState({
                scrolling: undefined
            })
        }
    }
    render() {
        return (
            <div className='mall_contract' style={{height: '100%', overflowY: 'scroll',}}>
                <iframe name='myIframe' id="myIframe" src={this.state.contractUrl} frameBorder="0" width="100%" height="100%" scrolling={this.state.scrolling} sandbox='allow-scripts allow-same-origin'></iframe>
                {/* {this.state.contractState == undefined ? <div className='sign_contract' style={{position: 'absolute', bottom: '0px'}}>
                    <p className="checkPost"><Checkbox onChange={this.checkChange}/>邮寄线下纸质合同</p>
                    <p className="sign" onClick={this.signContract}>签订合同</p>
                </div>: null} */}
            </div>
        );
    }
}
export default withRouter(MallContract);