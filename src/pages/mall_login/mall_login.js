import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_login.css';
import { Carousel, Row, Col, Button, Form, Input, message } from 'antd';
import { Md5 } from 'md5-typescript';
import User from '../../service/User';
import Http from '../../service/Http';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    MobileNumber: '',
    Password: ''
}
class MallLogin extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            MobileNumber: '',
            Password: ''
        };
    }
    componentWillMount() {
    }
    getPhone = (e) => {
        this.setState({
            MobileNumber: e.target.value
        });
    }
    getPassword = (e) => {
        this.setState({
            Password: e.target.value
        });
    }
    Login = async () => {
        const MobileNumber = this.state.MobileNumber;
        const Password = this.state.Password;
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.post(Url.baseUrl + `/auth`, {
            // client_id: '680E8B100FF311E9AC6100163E008033',
            // client_secret: '1CC3633C579A90CFDD895E64021E2163',
            mobileNumber: MobileNumber,
            client_id: '0BB8472A239411E9ACF700163E0070DD', // 正式环境
            client_secret: '2B296AB4F2DB709CC20056F93C4B04EE',
            // client_id: 'FA49C1982F6511E99750F44D305CA5F2', // 开发环境
            // client_secret: 'AF94ED0D6F5ACC95F97170E3685F16C0', 
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        User.updataToken(data.access_token, data.refresh_token);
        this.props.history.push('/mallIndex');
    }
    updateUserInfo = async () => {
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.get(Url.baseUrl + '/user/info');
        if (code !== Http.ok) {
            return message.error(info);
        }
        User.put(data);

    }
    render() {
        return (
            <div className='mall_login'>
                <Form>
                    <Input value={this.state.MobileNumber} placeholder="请输入手机号" onChange={this.getPhone} />
                    <Input value={this.state.Password} placeholder="请输入密码" onChange={this.getPassword} />
                </Form>
                <div className="btnGroup">
                    <Button className="payButton" onClick={this.Login}>登录</Button>
                </div>
            </div>
        );
    }
}
export default withRouter(MallLogin);