import * as React from 'react';
import './ordering-process.css';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class OrderingProcess extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    render() {
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <p>
                            <span style={{ color: "#333333" }}>添加到购物车→订单洽谈→订单确认→支付预付款→ 云工厂生产→验货完成→支付订单尾款→平台发货 →确认收货→交易结束
                            </span>
                        </p>
                    </Col>
                    <Col span={24}>
                        <img src="./image/order/pro.png" style={{ width: "100%" }} />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default withRouter(OrderingProcess);