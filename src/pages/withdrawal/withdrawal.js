import * as React from 'react';
import './withdrawal.css';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
}
type State = {
    isUser: boolean,
}
class Withdrawal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isUser: false,
        };
    }
    componentWillMount() {
        if (this.props.match.params.code === "user") {
            this.setState({ isUser: true });
        } else {
            this.setState({ isUser: false });
        }
    }
    render() {
        return (
            <div>
                {
                    this.state.isUser ? (
                        <div>
                            <h3 style={{ textAlign: "center" }}>提现规则</h3>
                            <p>1、提现办理规则：随时提现，不限时间，不限次数，不限金额；</p>
                            <p>2、提现金额：提现所需缴纳的20%个税由易智造平台补贴;</p>
                            <p>3、提现到账时间：提现成功后一般将在1-3个工作日到账，周末顺延。
                                如逾期未到账，请查询银行卡出入账明细和易智造平台我的账户中查看提现是否成功；</p>
                            <p>4、为保障您的财产安全请使用注册用户本人银行卡；</p>
                            <h3>友情提醒</h3>
                            <p>1、通过不正当手段获得奖励，易智造平台有权撤销奖励及相关订单。</p>
                            <p>2、同一登录帐号、同一手机号、同一终端设备号、同一支付帐户等合理
                                    显示为同一用户的情形，均视为同一用户。</p>
                            <p style={{ color: "red", textAlign: "center" }}>该活动解释权归易智造所有，如有修改，会在站内提前一周通知到每位用户。</p>
                            <p style={{ color: "red", textAlign: "center" }}>如在提现过程中有任何疑问，请致电易智造客服400-867-0211</p>
                        </div>
                    ) : (
                            <div>
                                <h3 style={{ textAlign: "center" }}>提现规则</h3>
                                <p>1、提现办理规则：随时提现，不限时间，不限次数，不限金额；</p>
                                <p>2、提现金额：提现所需缴纳的20%个税由易智造平台补贴;</p>
                                <p>3、提现到账时间：提现成功后一般将在1-3个工作日到账，周末顺延。
                                    如逾期未到账，请查询银行卡出入账明细和易智造平台我的账户中查看提现是否成功；</p>
                                <p>4、为保障您的财产安全请使用注册用户本人银行卡；</p>
                                <h3>友情提醒</h3>
                                <p>1、通过不正当手段获得奖励，易智造平台有权撤销奖励及相关订单。</p>
                                <p>2、同一登录帐号、同一手机号、同一终端设备号、同一支付帐户等合理
                                    显示为同一用户的情形，均视为同一用户。</p>
                                <p style={{ color: "red", textAlign: "center" }}>该活动解释权归易智造所有，如有修改，会在站内提前一周通知到每位用户。</p>
                                <p style={{ color: "red", textAlign: "center" }}>如在提现过程中有任何疑问，请致电易智造客服400-867-0211</p>
                            </div>
                        )
                }
            </div>
        );
    }
}
export default withRouter(Withdrawal);