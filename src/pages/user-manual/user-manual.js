import * as React from 'react';
import './user-manual.css';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class UserManual extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    render() {
        return (
            <div>
                <p>
                    <strong>使用说明</strong>
                </p>
                <p>
                    <strong>品牌授权</strong>
                </p>
                <p>
                    <span>易智造向平台用户提供输配电、电机、灯具、家具、休闲食品等产品品牌， 用户根据自身需求选择品牌OEM，品牌商授权商收取2.0%左右的品牌授权费（按“商品订单”售价计算）。
                    </span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/one.png" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/two.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <strong>保险服务</strong>
                </p>
                <p>
                    <span>易智造通过中国人民财产保险股份有限公司的产品质量风险评估，同中国人民财产保险股份有限公司签订了产品质量保险保单， 由中国人保承保平台产品的质量保险。为平台用户，提供强有力的质量保障。
                    </span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/three.jpeg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/four.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <strong>当日售价</strong>
                </p>
                <p>
                    <span>查看输配电、电机、家具、灯具、休闲食品等产品最新报价。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/six.jpeg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/five.jpg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <strong>云工厂</strong>
                </p>
                <p>
                    <span>1、查看产品信息，目前平台提供“输配电”、“电机”、“家具”“灯具”“休闲食品”等行业，每个行业下属分类了满足本行业的国家标准类型的产品信息。可以根据实际分类查看。（下图展示的是输配电行业的分类和产品信息）。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/one.png" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/seven.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <span>2、看商品详情，选择相应产品参数，加入购物车。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/nine.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/ten.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>3、确认商品信息无误（参数、数量、品牌、金额、投保额），进入合同洽谈页面，由易智造平台相关行业专业客服人员为您服务，协助您完成下单。</p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/eleven.png" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num1.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <span>4、由易智造客服将订单相关合同和技术协议发送至用户，用户确认无误后，用户点击“签订合同”，合同签订完毕。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/num1.jpeg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num3.jpeg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num4.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num5.jpeg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <span>5、点击底部导航“订单”，进入全部订单页面，按照界面提示线下付款，客服人员确认款项到账，随即安排生产。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/num6.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num7.jpg" style={{ width: "100%" }} />
                    </Col>
                </Row>
                <p>
                    <span>6、点击”申请开票”，填写开票信息。点击”订单详情”，查看开票记录。</span>
                </p>
                <Row>
                    <Col span={12}>
                        <img src="./image/user-manual/num8.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num9.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num10.jpg" style={{ width: "100%" }} />
                    </Col>
                    <Col span={12}>
                        <img src="./image/user-manual/num11.jpg" style={{ width: "100%" }} />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default withRouter(UserManual);