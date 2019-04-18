import * as React from 'react';
import './pricelist.css';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'antd';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class PriceLists extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    link = (n: number) => {
        if (n) {
            this.props.history.push('/serieslist/' + Url.cateUrl[1]);
        } else {
            // 
            this.props.history.push('/serieslist/' + Url.cateUrl[0]);
        }
    }
    render() {
        return (
            <div style={{ padding: "25px" }}>
                <Row>
                    <Col span={6}>
                        <img src="./image/dangrishoujia.png" style={{ width: "52px" }} />
                    </Col>
                    <Col span={18}>
                        <div>
                            <b>易智造</b>
                        </div>
                        <div>链接天下产能</div>
                        <div>构建未来智造生态</div>
                    </Col>
                </Row>
                <div style={{ padding: "3px 0" }}>
                    <img src="./image/shupeidian.jpg" style={{ width: "100%" }} onClick={this.link.bind(PriceLists, 0)} />
                    <div style={{ height: "20px" }} />
                    <img src="./image/xiuxianshipin.jpg" style={{ width: "100%" }} onClick={this.link.bind(PriceLists, 1)} />
                </div>
            </div>
        );
    }
}
export default withRouter(PriceLists);