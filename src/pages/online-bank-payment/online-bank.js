import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './online-bank.css';
import fukuanliucheng_1 from '../../assets/using-help/fukuanliucheng1.png';
import fukuanliucheng_2 from '../../assets/using-help/fukuanliucheng2.png';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class OnlineBank extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    componentWillMount() {
        
    }
    render() {
        return (
            <div className='online-bank-payment'>
                <p>根据国家金融政策，大额付款需至银行柜台或使用网银支付，网银支付方法如下：</p>
                <p>1、请使用电脑（PC）打开易智造官网（http://www.emake.cn/），并使用易智造APP账号或使用APP扫码登录，进入个人中心找到需支付的订单；</p>
                <img src={fukuanliucheng_1} style={{width:'100%'}} />
                <p>2、点击付款，进入易智造收银台，点击选择一个支付银行；</p>
                <img src={fukuanliucheng_2} style={{width:'100%'}} />
                <p>3、页面会跳转到所选择的银行官网，插入密钥或U盾（不同银行名称不同），输入账号和密码支付即可；易智造平台会自动记录您的支付记录，您也可以将支付凭证截图发送给客服。</p>
                <div className='container'>
                    <p className='call'>给您带来不便，请谅解！</p>
                    <p className='hotLine'>客服热线：400-867-0211</p>
                </div>
            </div>
        );
    }
}
export default withRouter(OnlineBank);