import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './vip-info.css'
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class VipInfo extends React.Component<Props, State> {
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
            <div className='vip-info'>
                <p style={{fontWeight:'bold'}}>一、会员购买：</p>
                <p>1、会员价格：3000元/年；</p>
                <p>2、会员身份即买即生效；</p>
                <p>3、会员分行业购买，如只购买输配电行业的会员，则在输配电行业享受会员权益，其他行业则不享受权益；</p>
                <p>4、会员购买后不可退。</p><br/>
                <p style={{fontWeight:'bold'}}>二、会员有效期：</p>
                <p>1、有效期为一年：当前购买日期之后的一年内有效；</p>
                <p>2、当前会员有效期结束之后，方可购买后续年份的会员。</p><br/>
                <p style={{fontWeight:'bold'}}>三、会员专享：</p>
                <p>1、会员专属标志；</p>
                <p>2、会员有效期内，根据不同的行业下单享一定的折扣，不限金额和数量；具体折扣请查看会员购买页面；</p>
                <p>3、会员下单折扣权益不与其他如优惠券、爆款活动等促销活动叠加使用；</p>
                <p>4、以上会员专享权益将随会员身份一起失效。</p>
                <div className='container'>
                    <p className='call'>如有疑问，请咨询易智造客服</p>
                    <p className='hotLine'>客服热线：400-867-0211</p>
                </div>
            </div>
        );
    }
}
export default withRouter(VipInfo);