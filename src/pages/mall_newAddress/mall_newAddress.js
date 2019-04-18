import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_newAddress.css';
import { Row, Col, Button, message, Input, Icon, Drawer, Select} from 'antd';
import Http from '../../service/Http';
import Url from '../../service/Url';
import Areas from '../../assets/json/area.json';
const Option = Select.Option;
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    RefNo: '',
    Contacter: '',
    MobileNumber: '',
    Province: '',
    City: '',
    Country: '',
    StreetName: '',
    Area: '',
    StreetName: '',
    DetailAddress: '',
    ShowArea: false,
    ShowStreet: false,
    provinces: [],
    cities: [],
    areas: [],
    streets: []
}
class MallNewAddress extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            RefNo: '',
            Contacter: '',
            MobileNumber: '',
            Province: '北京市',
            City: '北京市',
            Country: '东城区',
            Street: '',
            Area: '',
            StreetName: '',
            DetailAddress: '',
            ShowArea: false,
            ShowStreet: false,
            provinces: [],
            cities: [],
            areas: [],
            streets: []
        };
    }
    componentWillMount() {
        const params = this.props.match.params.address;
        if (params) {
            const address = JSON.parse(this.props.match.params.address);
            this.setState({
                RefNo: address.RefNo,
                Contacter: address.UserName,
                MobileNumber: address.MobileNumber,
                Province: address.Province,
                City: address.City,
                Country: address.County,
                Street: address.Street,
                StreetName: address.District,
                Area: address.Province+address.City+address.County,
                DetailAddress: address.Address
            });
        }
        this.getProvinces();
        this.getCities();
        this.getAreas();
        this.getStreet();
    }
    getProvinces = () => {
        const provinces = Areas.map(it => ({
            value: it.state,
            display: it.state,
          }));
          this.setState({
              provinces: provinces
          });
    }
    getCities = () => {
        const cities = Areas.reduce((acc, cur) =>
            ({
            [cur.state]: cur.cities.map(it => ({ value: it.city, display: it.city })),
            ...acc,
            }), {});  
        this.setState({
            cities: cities
        });
    }
    getAreas = () => {
        const infos = Areas.reduce(
            (acc: any, cur:any) => (
                {
                    ...acc,
                    [cur.state]: cur.cities.reduce(
                        (accInner: any, curInner: any) => (
                            {
                                ...accInner,
                                [curInner.city]: curInner.areas.map((it: any) => ({value:it.county,display: it.county})),
                            }
                        ), {}
                    ),
                }
            ), {}
        );
        const areas = Object.keys(infos).reduce(
            (acc:any, cur:any) => (
                {
                    ...acc,
                    ...infos[cur],
                }
            ),{}
        );
        this.setState({
            areas: areas
        })
    }
    getStreet = () => {
        if (this.state.Province+this.state.City+this.state.Country !== '') {
            Areas.map(it => {
                if (it.state === this.state.Province) {
                    it.cities.map(item => {
                        if (item.city === this.state.City) {
                            if (item.areas.length === 0 ) {
                                this.setState({
                                    streets: []
                                });
                            } else {
                                item.areas.map(oItem => {
                                    if (oItem.county === this.state.Country) {
                                        this.setState({
                                            streets: oItem.streets
                                        });
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
        
    }
    contacterChange = (e: SyntheticInputEvent<>) => {
        this.setState({
            Contacter: e.target.value.trim()
        })
    }
    phoneChange = (e: SyntheticInputEvent<>) => {
        this.setState({
            MobileNumber: e.target.value.trim()
        })
    }
    deatailAddressChange = (e: SyntheticInputEvent<>) => {
        this.setState({
            DetailAddress: e.target.value.trim()
        })
    }
    showAreaDrawer = () => {
        this.setState({
            ShowArea: true
        });
    }
    showStreetDrawer = () => {
        if (this.state.Area === '') {
            return message.info('请先选择所在地区');
        } else {
            if(this.state.streets.length > 0 ) {
                this.setState({
                    ShowStreet: true,
                    Street: this.state.streets[0]
                });
            }
        }
        
    }
    close = () => {
        this.setState({
            ShowArea: false,
            ShowStreet: false,
            Province: '北京市',
            City: '北京市',
            Country: '东城区',
        })
    }
    selectProvince = (item) => {
        const city = this.state.cities[item.display][0].value;
        const country = this.state.areas[city][0].value;
        this.setState({
            Province: item.display,
            City: city,
            Country: country
        });
    }
    selectCity = (item) => {
        this.setState({
            City: item.display,
            Country: this.state.areas[item.display][0].value
        });
    }
    selectArea = (item) => {
        this.setState({
            Country: item.display
        });
    }
    selectStreet = (item) => {
        this.setState({
            Street: item
        });
    }
    confirmArea = () => {
        this.getStreet();
        this.setState({
            Area: this.state.Province+this.state.City+this.state.Country,
            ShowArea: false,
            StreetName: ''
        });
    }
    confirmStreet = () => {
        this.setState({
            StreetName: this.state.Street,
            ShowStreet: false
        })
    }
    addAddress = async() => {
        if (this.state.Contacter === '') {
            return message.error('请输入收货人!');
        }
        if (this.state.MobileNumber === '') {
            return message.error('请输入联系电话！');
        }
        if (!(/^1\d{10}$/.test(this.state.MobileNumber))) {
            return message.error('联系电话格式错误!');
        }
        if (this.state.Area === '') {
            return message.error('请选择所在地区！');
        }
        if (this.state.streets.length > 0 && this.state.StreetName === '') {
            return message.error('请选择街道！');
        }
        if (this.state.DetailAddress === '' || this.state.DetailAddress.length < 5) {
            return message.error('请输入详细地址，不少于5个字！');
        }
        const address = {
            UserName: this.state.Contacter,
            MobileNumber: this.state.MobileNumber,
            Province: this.state.Province,
            City: this.state.City,
            County: this.state.Country,
            District: this.state.StreetName,
            Address: this.state.DetailAddress,
            AddressType: '0'
        }
        if (this.state.RefNo !== '') {
            address.RefNo = this.state.RefNo;
            const {
                ResultInfo: info,
                ResultCode: code,
                Data: data,
            } = await Http.put(Url.baseUrl +`/user/address`, address);
            if (code !== Http.ok) {
                return message.error(info);
            }
            message.success('地址编辑成功！');
        } else {
            const {
                ResultInfo: info,
                ResultCode: code,
                Data: data,
            } = await Http.post(Url.baseUrl +`/user/address`, address);
            if (code !== Http.ok) {
                return message.error(info);
            }
            message.success('地址新增成功！');
        }
        
        this.props.history.push('/mallConfigAddress');

    }
    render() {
        const provinceDisplay = this.state.provinces.map((item, index) =>
            <li key={index} value={item.value} className={this.state.Province=== item.display ? 'active': ''} onClick={this.selectProvince.bind(this, item)}>{item.display}</li>
        );
        const cityDisplay = this.state.cities[this.state.Province].map((item, index) =>
            <li key={index} value={item.value} className={this.state.City=== item.display ? 'active': ''} onClick={this.selectCity.bind(this, item)}>{item.display}</li>
        );
        const areaDisplay = this.state.areas[this.state.City].map((item, index) =>
            <li key={index} value={item.value} className={this.state.Country=== item.display ? 'active': ''} onClick={this.selectArea.bind(this, item)}>{item.display}</li>
        );
        const streetDisplay = this.state.streets.map((item, index) => 
            <li key={index} value={item} className={this.state.Street===item ? 'active':''} onClick={this.selectStreet.bind(this, item)}>{item}</li>
        );
        return (
            <div className='mall_newAddress' style={{backgroundColor: '#FFF', height: '100%'}}>
                <div className="form_container">
                    <Row className="formItem">
                        <Col span={5}>收货人</Col>
                        <Col span={19}>
                            <Input value={this.state.Contacter} onChange={this.contacterChange}/>
                        </Col>
                    </Row>
                    <Row className="formItem">
                        <Col span={5}>联系电话</Col>
                        <Col span={19}>
                            <Input value={this.state.MobileNumber} onChange={this.phoneChange}/>
                        </Col>
                    </Row>
                    <Row className="formItem" onClick={this.showAreaDrawer}>
                        <Col span={5}>所在地区</Col>
                        <Col span={19} style={{textAlign: 'right'}}>
                            <span>{this.state.Area ? this.state.Area : '请选择所在地区'}<Icon type="right"/></span>
                        </Col>
                    </Row>
                    <Row className="formItem" onClick={this.showStreetDrawer}>
                        <Col span={5}>街道</Col>
                        <Col span={19} style={{textAlign: 'right'}}>
                            <span>{this.state.StreetName ? this.state.StreetName : (this.state.Area && this.state.streets.length === 0 ? '无': '请选择街道')}<Icon type="right"/></span>
                        </Col>
                    </Row>
                    <Row className="area">
                        <Input.TextArea rows={3} value={this.state.DetailAddress} placeholder="请填写详细地址，不少于5个字" onChange={this.deatailAddressChange}/>
                    </Row>
                </div>
                <div className="btn_container">
                    <Button type="primary" onClick={this.addAddress} style={{fontSize: '16px'}}>{this.state.RefNo !== '' ? '保存' : '提交'}</Button>
                </div>
                <Drawer
                    visible={this.state.ShowArea}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height="250"
                    className="Area"
                    title={<p className="drawer-title"><span style={{float:'left'}} onClick={this.close}>取消</span><span style={{float:'right'}} onClick={this.confirmArea}>确定</span></p>}
                    style={{
                        height: this.state.ShowArea?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <Row>
                        <Col span={8}>
                            <ul className="selectArea">
                                {provinceDisplay}
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="selectArea">
                                {cityDisplay}
                            </ul>
                        </Col>
                        <Col span={8}>
                            <ul className="selectArea">
                                {areaDisplay}
                            </ul>
                        </Col>
                    </Row>
                </Drawer>
                <Drawer
                    visible={this.state.ShowStreet}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height="250"
                    className="Street"
                    title={<p className="drawer-title"><span style={{float:'left'}} onClick={this.close}>取消</span><span style={{float:'right'}} onClick={this.confirmStreet}>确定</span></p>}
                    style={{
                        height: this.state.ShowStreet?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <ul className="selectArea">
                        {streetDisplay}
                    </ul>
                </Drawer>
            </div>
        );
    }
}
export default withRouter(MallNewAddress);