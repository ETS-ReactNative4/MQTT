import *  as React from 'react';
import { withRouter } from 'react-router-dom';
import chat_1 from '../../assets/using-help/聊天@2x.png'
import chat_2 from '../../assets/using-help/聊天界面@2x.png';
import user from '../../assets/using-help/用户@2x.png'
import waitSigned from '../../assets/using-help/待签订@2x.png';
import waitPay from '../../assets/using-help/待付款@2x.png'
import inPro from '../../assets/using-help/生产中@2x.png';
import finishPro from '../../assets/using-help/生产完成@2x.png'
import shipped from '../../assets/using-help/已发货@2x.png';
// 用户app
import category_1 from '../../assets/using-help/类别切换01.png';
import category_2 from '../../assets/using-help/类别切换02.png';

import design_1 from '../../assets/using-help/开发定制01.png';
import design_2 from '../../assets/using-help/开发定制02.png';

import today_1 from '../../assets/using-help/当日售价01.png';
import today_2 from '../../assets/using-help/当日售价02.png';

import order1_1 from '../../assets/using-help/order/101.png';
import order1_2 from '../../assets/using-help/order/102.png';

import order2_1 from '../../assets/using-help/order/201.png';
import order2_2 from '../../assets/using-help/order/202.png';

import order3_1 from '../../assets/using-help/order/301.png';
import order3_2 from '../../assets/using-help/order/302.png';

import order4_1 from '../../assets/using-help/order/401.png';
import order4_2 from '../../assets/using-help/order/402.png';

import order5_1 from '../../assets/using-help/order/501.png';
import order5_2 from '../../assets/using-help/order/502.png';

import order6_1 from '../../assets/using-help/order/601.png';
import order6_2 from '../../assets/using-help/order/602.png';

import order7_1 from '../../assets/using-help/order/701.png';
import order7_2 from '../../assets/using-help/order/702.png';

import order8_1 from '../../assets/using-help/order/801.png';
import order8_2 from '../../assets/using-help/order/802.png';

type Props = {
    match: { params: any },
}
type State = {
    isUser: boolean,
}

class MerchantUsingHelp extends React.Component<Props, State> {
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
                        <div style={{padding:'0 5px'}}>
                            <h3>类别切换</h3>
                            <p> 易智造平台向用户提供消费品和工业品切换，用户可根据自己的喜好选择切换。</p>
                            <img src={category_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={category_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <h3>开发定制</h3>
                            <p> 易智造平台提供3种开发定制方式：外观定制、轻定制和新品开发等，用户可以根据自身实际情况选择。</p>
                            <img src={design_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={design_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <h3>当日售价</h3>
                            <p> 查看工业品和消费品等产品的当日最新报价（仅限标准品）。</p>
                            <img src={today_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={today_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <h3>商品订购</h3>
                            <p> 1、目前平台提供工业品和消费品等类别商品，不仅提供满足本行业的国家标准类型的标准品，还有具有独特创意的设计品。用户均可以根据实际分类查看（下图展示的是休闲食品行业的分类和产品信息）。</p>
                            <img src={order1_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order1_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 2、用户选择一个商品查看商品详情，选择相应产品参数，加入订货单。</p>
                            <img src={order2_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order2_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 3、确认商品信息无误（参数、数量、金额），确定订单，点击“合同洽谈”由客服帮助您完成下单。</p>
                            <img src={order3_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order3_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 4、客服将相关合同和技术协议发送至用户，用户确认无误后，点击“签订”，合同签订完毕。</p>
                            <img src={order4_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order4_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 5、进入订单待付款页面，根据界面提示按照合同约定支付预付款，平台确认款项到账，订单流转进入备货中，即为易智造云工厂安排生产。</p>
                            <img src={order5_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order5_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 6、易智造云工厂生产完成后，用户需要根据合同约定支付合同尾款，尾款支付后，易智造云工厂安排发货，订单状态变更为发货中，平台将订单相关的物流信息推送给用户。</p>
                            <img src={order6_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order6_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 7、当货物全部发货完毕后，订单流转到已完成，表示本次交易结束。</p>
                            <img src={order7_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order7_2}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 8、在确认订单时如勾选了“含税价格”，则可点击”申请开票”，填写开票信息；点击”开票记录”，查看开票记录。</p>
                            <img src={order8_1}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={order8_2}
                                style={{ width: "50%" }}
                                alt="" />
                        </div>
                    ) : (
                            <div style={{padding:'0 5px'}}>
                                <h3>聊天</h3>
                                <p> 1、由易智造平台发送有关订单信息，系统通知等。</p>
                                <img src={chat_1}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <p>2、用户聊天：用户咨询云工厂客服小二有关商品和合同沟通的相关聊天记录。</p>
                                <img src={chat_2}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <h3>用户</h3>
                                <p>展示已经购买当前品类云工厂的会员用户和已成交过的用户，云工厂客服小二可以主动和用户沟通，提升订单量。</p>
                                <img src={user}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <h3>订单</h3>
                                <p> 1、待签订：用户下单后订单进入待签订，云工厂客服小二需要和用户沟通有关合同及相关技术协议的确定。</p>
                                <img src={waitSigned}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/sty2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>2、待付款：用户确认合同+结束协议后，订单合同进入待付款，用户需要支付合同额的30%作为预付款，云工厂客服小二需将收款信息维护到易智造商家管理系统（PC）中。</p>
                                <img src={waitPay}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>3、生产中：用户支付预付款后，订单合同流转至生产中，由云工厂发展的分布式车间（生产工厂）竞标生产。</p>
                                <img src={inPro}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>4、生产完成：分布式车间（生产工厂）生产完成后，订单合同流转到生产完成状态，用户需支付剩余的70%尾款，云工厂需将收款信息维护到易智造商家管理系统（PC）中。</p>
                                <img src={finishPro}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>5、已发货：用户支付尾款后，云工厂安排发货，将发货信息维护到易智造商家管理系统（PC），由系统推送发货信息给用户。</p>
                                <img src={shipped}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                            </div>
                        )
                }
            </div>
        )
    }
}
export default withRouter(MerchantUsingHelp);