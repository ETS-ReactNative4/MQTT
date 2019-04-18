import * as React from 'react';
import './red-packet.css';
import { withRouter } from 'react-router-dom';
// import { Row, Col } from 'antd';
type Props = {
    match: { params: any },
}
type State = {
    isShow: boolean,
    isShows: boolean,
}
class RedPacket extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isShow: true,
            isShows: true,
        };
    }
    componentWillMount() {
        const id = this.props.match.params.id;
        const code = this.props.match.params.code;
        if (code == 2) {
            this.setState({ isShow: true });
            if (id == 2) {
                this.setState({ isShows: false });
            } else {
                this.setState({ isShows: true });
            }
        } else {
            this.setState({ isShow: false });
        }
    }
    render() {
        return (
            <div>
                {
                    this.state.isShow ? (
                        <div>
                            <p>
                                1、“分销商”可发展“B端用户”，人数不限，“分销商”或其“B端用户”完成的订单“分销商”可获得订单金额的1.5%作为提成奖励；
                            </p>
                            {
                                this.state.isShows ? (
                                    <div>
                                        <p>
                                            2、“分销商”累计完成200万订单额，平台额外奖励1万；累计完成300万平台追加奖励1.5万；累计完成500万订单额平台再追加奖励2.5万；累计完成500万订单额以上每增加100万订单额平台再追加奖励1万元；
                                        </p>
                                        <p>
                                            3、提成均可随时提现，请在易智造APP【我的—我的账户】中操作；
                                        </p>
                                        <p>
                                            4、本次活动解释权归易智造平台所有。
                                        </p>
                                    </div>
                                ) : (
                                        <div>
                                            <p>
                                                2、提成均可随时提现，请在易智造APP【我的—我的账户】中操作；
                                            </p>
                                            <p>
                                                3、本次活动解释权归易智造平台所有。
                                            </p>
                                        </div>
                                    )
                            }
                            <p className={"footer-red"}
                                style={{ display: "block" }}>
                                备注：“分销商”、“B端用户”的层级关系不可改变
                            </p>
                        </div>
                    ) : (
                            <div>
                                <div>
                                    <p>
                                        1、注册成为平台用户并签署合伙人协议成为合伙人（无需任何费用）。“合伙人”可发展“分销商”；“分销商”可发展“B端用户”，人数不限。“合伙人”或其“分销商”或其“B端用户”完成的订单，“合伙人”均可从订单总额中提成0.5%；
                                    </p>
                                    <p>
                                        2、“合伙人”自行下单即可获得订单的2%提成；
                                    </p>
                                    <p>
                                        3、“合伙人”发展的“B端用户”下单也可获得2%的提成；
                                    </p>
                                    <p>
                                        4、提成均可随时提现，请在易智造APP【我的—我的账户】中操作；
                                    </p>
                                    <p>
                                        5、本次活动解释权归易智造平台所有。
                                    </p>
                                </div>
                                <p className={"footer-red"} style={{ display: "block" }}>
                                    备注：“合伙人”、“分销商”、“B端用户”的层级关系不可改变
                                </p>
                            </div>
                        )
                }
            </div>
        );
    }
}
export default withRouter(RedPacket);