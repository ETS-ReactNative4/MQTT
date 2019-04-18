import * as React from 'react';
import './commission';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
}
type State = {
    isUser: boolean,
}
class Commission extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <h3>提成规则</h3>
                <p>1、注册成为易智造平台用户且完成店铺申请审核成为店铺掌柜（无需任何费用）。
                    用户在店铺中下单，店铺掌柜享有订单总额的2%提成；</p>
                <p>2、店铺掌柜（A）可邀请好友（B）来易智造平台开店成为店铺掌柜，店铺掌柜（A）
                    可享有好友店铺（B）订单总额的0.5%的提成奖励；店铺掌柜（B）可邀请好友（C）来易智造平台开店成为店铺掌柜，
                    店铺掌柜（B）可享有好友店铺（C）订单总额的0.5%的提成奖励；依次类推，邀请越多，奖励越多！</p>
                <p>3、邀请好友成为易智造平台店铺掌柜提成奖励期限为一年
                    （2018年12月31日之前邀请的好友店铺成功上线后一年内有效）；</p>
                <p>4、提成奖励均可随时提现，请在易智造商家版APP中【我的—我的资产】中操作；</p>
                <p>5、本次活动解释权归易智造平台所有，如有任何疑问，请拨打400-867-0211咨询客服。</p>
            </div>
        );
    }
}
export default withRouter(Commission);