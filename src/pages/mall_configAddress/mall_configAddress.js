import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_configAddress.css';
import { Carousel, Row, Col, Button, message, Icon} from 'antd';
import Http from '../../service/Http';
import Url from '../../service/Url';
import none from '../../assets/mall/wudizhi.png';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    Address: []
}
class MallConfigAddress extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            Address: []
        };
    }
    async componentWillMount() {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl +`/user/address?AddressType=0`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        this.setState({
            Address: data
        });
    }
    newAddress = () => {
        this.props.history.push('/mallNewAddress');
    }
    editAdress = (item) => {
        this.props.history.push('/mallNewAddress/'+JSON.stringify(item))
    }
    selectAddress = (item) => {
        sessionStorage.setItem('Address', JSON.stringify(item));
        const path = sessionStorage.getItem('LastPath');
        this.props.history.push(path);
    }
    render() {
        return (
            <div className='mall_configAddress'>
                {this.state.Address.length > 0 ? <div className="address_container">
                    {this.state.Address.map((it, idx) => (
                        <div className="address_item" key={idx}>
                            <Row>
                                <Col span={22} onClick={this.selectAddress.bind(this, it)}>
                                    <p className="phone"><span>{it.UserName}</span><span>{it.MobileNumber}</span></p>
                                    <p style={{wordBreak: 'break-all'}}>{it.Province+it.City+it.County+it.District+it.Address}</p>
                                </Col>
                                <Col span={2} onClick={this.editAdress.bind(this, it)}>
                                    <Icon type="right"/>
                                </Col>
                            </Row>
                            
                        </div>
                    ))}
                    </div>: <div className="img_container">
                        <img src={none} />
                    </div>
                }
                <div className="btn_container">
                    <Button className="addAddress" onClick={this.newAddress}>新增地址</Button>
                </div>
            </div>
        );
    }
}
export default withRouter(MallConfigAddress);