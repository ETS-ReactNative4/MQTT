import * as React from 'react';
import './companies-use.css';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
}
type State = {
    isUser: boolean,
}
class Companie extends React.Component<Props, State> {
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
                            <h3>品牌授权</h3>
                            <p> 易智造向平台用户提供输配电、休闲食品等产品品牌（陆续添加更新中），
                                用户根据自身需求选择品牌OEM，品牌商授权商收取2.0%左右的品牌授权费
                                （按“商品订单”售价计算）。</p>
                            <img src={"./image/user/WechatIMG1051.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1050.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <h3>当日售价</h3>
                            <p> 查看输配电、休闲食品等产品的当日最新报价（陆续添加更新中）。</p>
                            <img src={"./image/user/WechatIMG1044.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1041.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <h3>云工厂</h3>
                            <p> 1、查看产品信息，目前平台提供“输配电”、“休闲食品”等行业，
                                每个行业下属分类了满足本行业的国家标准类型的产品信息。
                                可以根据实际分类查看。（下图展示的是休闲食品行业的分类和产品信息）</p>
                            <img src={"./image/user/WechatIMG1028.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1029.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 1、查看产品信息，目前平台提供“输配电”、“休闲食品”等行业，
                            每个行业下属分类了满足本行业的国家标准类型的产品信息。
                                可以根据实际分类查看。（下图展示的是休闲食品行业的分类和产品信息）</p>
                            <img src={"./image/user/WechatIMG1028.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1029.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 2、用户选择店铺，选择一个商品查看商品详情，选择相应产品参数，加入购物车。</p>
                            <img src={"./image/user/WechatIMG1028.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1029.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 3、确认商品信息无误（参数、数量、品牌、金额），确定订单，由用户选择的店铺专业技术客服帮助您完成下单。</p>
                            <img src={"./image/user/WechatIMG1035.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1060.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 4、平台客服协助店铺客服将相关合同和技术协议发送至用户，用户确认无误后，点击“签订合同”，合同签订完毕。</p>
                            <img src={"./image/user/WechatIMG1036.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG2273.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 5、点击底部导航“订单”，进入待付款页面，根据界面提示按照合同约定支付预付款，
                                平台确认款项到账，订单流转进入生产中，即为易智造云工厂安排生产。</p>
                            <img src={"./image/user/WechatIMG1061.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1062.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 6、易智造云工厂生产完成后，用户订单进入生产完成，
                                用户需要根据合同约定支付合同尾款，尾款支付后，易智造云工厂安排发货，
                                订单状态变更为已发货，平台将订单相关的物流信息推送给用户。</p>
                            <img src={"./image/user/WechatIMG1055.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1057.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <p> 7、如在下单前如勾选了“含税”，则可点击”申请开票”，填写开票信息；
                                点击”开票记录”，查看开票记录。</p>
                            <img src={"./image/user/WechatIMG1031.jpg"}
                                style={{ width: "50%" }}
                                alt="" />
                            <img src={"./image/user/WechatIMG1030.jpeg"}
                                style={{ width: "50%" }}
                                alt="" />
                        </div>
                    ) : (
                            <div>
                                <h3>聊天</h3>
                                <p> 1、系统消息：是商家版APP系统发送的有关订单的进展情况及物流信息等。</p>
                                <img src={"./image/store/sty1@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <img src={"./image/store/sty2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <p>2、用户聊天：用户咨询店铺有关产品的相关聊天记录，在咨询过程中如遇到疑问时，可呼叫平台客服进入组成三方聊天室。</p>
                                <img src={"./image/store/user1@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <h3>用户</h3>
                                <p> 1、普通用户：展示已咨询过的用户和商家版平台系统推送的一部分普通用户（未主动咨询）和，
                                    可主动发送消息给用户（请勿发送骚扰信息），请认真仔细维护！</p>
                                <img src={"./image/store/puser@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <p>2、好友的店铺：您邀请好友开设的店铺，可以查看好友店铺的订单情况。</p>
                                <img src={"./image/store/fen1@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <img src={"./image/store/fen2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <h3>订单</h3>
                                <p> 1、待签订：用户下单后订单进入待签订，
                                    店铺可以点击合同洽谈呼叫平台客服共同完成和用户的合同及相关技术协议的确定。</p>
                                <img src={"./image/store/spay@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/sty2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>2、待付款：用户确认合同+结束协议后，订单合同进入待付款，
                                    用户需要支付合同额的30%作为预付款。</p>
                                <img src={"./image/store/strue@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>3、生产中：用户支付预付款后，订单合同流转至生产中，由易智造云工厂生产。</p>
                                <img src={"./image/store/pro@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>4、生产完成：易智造云工厂生产完成后，订单合同流转到生产完成，用户需支付剩余的70%尾款。</p>
                                <img src={"./image/store/com@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <p>5、已发货：用户支付尾款后，易智造云工厂安排发货，并推送发货信息给掌柜和用户。</p>
                                <img src={"./image/store/send@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                {/* <img src={"./image/store/user2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" /> */}
                                <h3>我的</h3>
                                <p> 1、邀请好友开店：店铺掌柜可以邀请好友来平台开店，平台审核通过后，
                                    可享受好友店铺订单的一定比例的提成收益（具体提成收益请在“我的—邀请好友开店”中查看提成规则）。</p>
                                <img src={"./image/store/sfen1@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <img src={"./image/store/sfen2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <p>2、我的资产：掌柜在平台所获取的所有提成奖励明细，用户可随时提现。</p>
                                <img src={"./image/store/our1@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                                <img src={"./image/store/our2@2x.png"}
                                    style={{ width: "50%" }}
                                    alt="" />
                            </div>
                        )
                }
            </div>
        );
    }
}
export default withRouter(Companie);