import * as React from 'react';
import './ordering-information.css';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class OrderingInformation extends React.Component<Props, State> {
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
                            <span style={{ color: "#333333" }}>1、休闲食品类平台价格均为不含税价格，如需开票，请在确认订单页面勾选“选择开票”； 价格自动更新为含税价。
                            </span>
                        </p></Col>
                    <Col span={24}>
                        <img src="./image/order/info01.png" style={{ width: "100%" }} />
                    </Col>
                    <Col span={24}>
                        <p>
                            <span style={{ color: "#333333" }}>2、下单成功后，可以在我的—订单列表页面右侧点击“申请开票”填写您的开票信息。
                            </span>
                        </p>
                    </Col>
                    <Col span={24}>
                        <img src="./image/order/info02.png" style={{ width: "100%" }} />
                    </Col>
                    <Col span={24}>
                        <p>
                            <span style={{ color: "#333333" }}>3、您也可以预先在“我的”——“发票管理”中填写您的开票信息，并同时管理多个开票信息。
                            </span>
                        </p>
                    </Col>
                    <Col span={24}>
                        <img src="./image/order/info03.png" style={{ width: "100%" }} />
                    </Col>
                </Row>
            </div>
        );
    }
}
export default withRouter(OrderingInformation);