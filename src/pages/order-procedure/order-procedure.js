import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './order-procedure.css';
import dinggouliucheng from '../../assets/using-help/dinggouliucheng.png';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class OrderProcedure extends React.Component<Props, State> {
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
            <div className='order-procedure'>
                <p>用户选择商品参数->添加到购物车->和云工厂小二订单洽谈->订单确认->支付预付款->云工厂生产->验货完成->支付订单尾款->平台发货->确认收货->评价->交易结束</p>
                <img src={dinggouliucheng} style={{width: '100%'}}/>
            </div>
        );
    }
}
export default withRouter(OrderProcedure);