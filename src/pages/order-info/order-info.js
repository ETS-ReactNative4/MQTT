import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './order-info.css';
import dinggouxuzhi_1 from '../../assets/using-help/dinggouxuzhi01.png';
import dinggouxuzhi_2 from '../../assets/using-help/dinggouxuzhi03.png';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class OrderInfo extends React.Component<Props, State> {
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
            <div className='order-info'>
                <p>1、平台部分品类商品（如休闲食品等）价格为不含税价格，如需开票，请在选择参数加入购物车时勾选“选择开票”，价格自动更新为含16%增值税的含税价；</p>
                <img src={dinggouxuzhi_1} style={{width: '100%'}} />
                <p>2、下单成功后，可在订单详情页面下方点击“申请开票”填写您的开票信息。</p>
                <img src={dinggouxuzhi_2} style={{width: '100%'}} />
            </div>
        );
    }
}
export default withRouter(OrderInfo);