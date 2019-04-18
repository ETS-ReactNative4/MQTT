import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './super-group.css';
import {Divider} from 'antd';
import pintuanliucheng from '../../assets/using-help/pintuanliucheng.png';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class SuperGroup extends React.Component<Props, State> {
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
            <div className='super-group'>
                <p>1、拼团失败</p>
                <p>拼团失败后，小二会为您取消订单且退款；</p>
                <p>在拼团时间内，团未达到要求人数，则拼团失败；</p>
                <p>高峰期间，同时支付人数较多，则以具体支付时间信息先后为参考；</p>
                <p>2、退款</p>
                <p>如已成团，团员在活动未结束时间内，不可申请退款；</p>
                <p>3、订单</p>
                <p>用户参加的拼团成功后，须在72小时内和小二签订订购合同并支付预付款；</p>
                <p>4、其他说明</p>
                <p>超级团活动不与平台其他营销活动叠加（平台注册会员也不能享受折扣权益）</p>
                <Divider style={{marginTop:'4rem'}}>拼团流程</Divider>
                <img src={pintuanliucheng} style={{width: '100%'}}/>
                <div className='container'>
                    <p className='call'>本次活动解释权归易智造平台，如有任何疑问，请咨询客服</p>
                    <p className='hotLine'>客服电话：400-867-0211</p>
                </div>
            </div>
        );
    }
}
export default withRouter(SuperGroup);
