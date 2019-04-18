import * as React from 'react';
import './open-shop.css';
import { withRouter } from 'react-router-dom';
import { Card } from 'antd';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class Shuffling extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    downLoad = () => {
        this.props.history.push('/download');
    }
    // componentWillMount() {
    //     this.setState({ type: this.props.match.params.id });
    // }
    render() {
        return (
            <div>
                <img src={"./image/shop.jpg"}
                    style={{ width: "100%" }}
                    alt="" />
                <Card title={
                    <span>
                        <h4 style={{ textAlign: "center" }}>
                            只需三步完成开店</h4>
                        <span>1、下载商家版APP（点击下方按钮）</span>
                        <br />
                        <span>2、提交开店申请，易智造审核</span>
                        <br />
                        <span>3、店铺上线，管理和维护您的店铺吧！</span>
                    </span>
                }
                    bordered={false}
                    style={{ width: "100%" }}>
                    <h4>常见问题</h4>
                    <p style={{ color: "#51bfce" }}>1、易智造平台对入驻商家的条件有什么要求？</p>
                    <p>答：只要年满18周岁的自然人即可，没有限制和要求。</p>
                    <p style={{ color: "#51bfce" }}>2、入驻时填写信息和以后账户提现的信息需要一致吗？</p>
                    <p>答：是，请确保信息完全一致。</p>
                    <p style={{ color: "#51bfce" }}>3、已退出平台的商家可否使用原来入驻的帐号重新入驻？</p>
                    <p>答：不可以，需要和易智造平台客服沟通。</p>
                    <p style={{ color: "#51bfce" }}>4、奖励和提成有什么规则？</p>
                    <p>答：请在入驻申请通过后登录商家版APP（下方按钮下载）
                        后，在我的—邀请好友开店中查看具体规则详情说明。</p>
                    <p style={{ color: "#51bfce" }}>5、奖励和提成如何结算？</p>
                    <p>答：所有收益在订单完成后的T+1个工作日自动进入您的资产账户，
                        您可以随时提现。</p>
                    <div>
                        <button className="btn" onClick={this.downLoad}>下载商家版APP  立即开店</button>
                    </div>
                </Card>

            </div>
        );
    }
}
export default withRouter(Shuffling);