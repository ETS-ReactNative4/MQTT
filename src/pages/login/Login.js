// @flow
import * as React from 'react';
import { Form, Button, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import './Login.css';
import toPwd from '../../assets/img/to_pwd.png';
import toQrCode from '../../assets/img/to_qrcode.png';
import phoneLogo from '../../assets/img/phone.png';
import passwordLogo from '../../assets/img/mima.png';
import Http from "../../service/Http";
import User from "../../service/User";
import Utils from "../../service/Utils";
import Url from '../../service/Url';
import QRCode from 'qrcode';
import UUID from 'uuid/v4';
import mqtt from 'mqtt';
import { Md5 } from 'md5-typescript';
import type { UserInfo } from "../../service/User";
import {PageFooter} from '../../components';

const iconStyle = {
  color: 'rgba(0, 0, 0, .25)',
  width: '20px',
  height: '20px',
  transform: 'translateX(-4px)'
};

type Props = {
  form: any,
  history: { push: (string) => void },
}

type State = {
  qrCode: boolean,
  qrCodeData: string,
  uuid: ?string,
}

class Login extends React.Component<Props, State> {
  client: ?any;

  constructor(props: Props) {
    super(props);
    this.state = {
      qrCode: false,
      qrCodeData: '',
      uuid: null,
    };
  }

  handleSubmit = (e: Event) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { phone, password } = values;
        const {
          ResultCode: code,
          ResultInfo: info,
          Data: user,
        } = await Http.post('user/login', {
          MobileNumber: phone,
          Password: Md5.init(password+":emake").toUpperCase(),
          client_id: "emake_web",
        });
        if (code === Http.ok) {
          this.loginSuccess({
            ...user.userinfo,
            access_token: user.access_token,
            refresh_token: user.refresh_token,
          });
        } else {
          message.error(info);
        }
      }
    });
  };

  switchLoginType = async () => {
    const { qrCode, qrCodeData, uuid: originUUID } = this.state;
    const uuid = originUUID || `user/EMAKE/${UUID()}`;
    this.setState({
      qrCodeData: qrCodeData || await QRCode.toDataURL(uuid),
      qrCode: !qrCode,
      uuid,
    });

    if (!qrCode && (!this.client || !this.client.connected)) {
      this.client && this.client.unsubscribe();
      const client = mqtt.connect({
        clientId: uuid,
        port: +8883,
        host: Url.mqttUrl,
        protocol: 'ws',
        clean: false,
      });
      client.on('connect', () => {
        client.subscribe(uuid, { qos: 2 });
      });
      client.on('message', async (topic, msg) => {
        const { access_token, refresh_token } = JSON.parse(msg.toString());
        User.modify({ access_token, refresh_token })
        User.updataToken(access_token, refresh_token);
        const { ResultCode, Data } = await Http.get('user/info')
        client.unsubscribe(uuid)
        client.end(true)
        this.loginSuccess({
          ...Data,
          access_token,
          refresh_token,
        });
      });
      this.client = client;
    }
  };

  loginSuccess = (user: any,) => {
    User.put(user);
    User.updataToken(user.access_token, user.refresh_token);
    this.props.history.push('/center');
  };

  componentWillMount() {
    if (User.validate()) {
      this.props.history.push('/center');
    }
  }

  componentDidMount() {
    if (Utils.dev) {
      this.props.form.setFieldsValue({
        phone: '',
        password: '',
      })
    }
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: '请输入手机号' },
            ],
          })(
            <Input
              prefix={<img src={phoneLogo} alt="" style={iconStyle} />}
              placeholder="请输入手机号" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入登录密码' }],
          })(
            <Input
              prefix={<img src={passwordLogo} alt="" style={iconStyle} />}
              type="password"
              placeholder="请输入登录密码" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { qrCode, qrCodeData } = this.state;
    return (
      <div className='login'>
        <div className="login-page">
          <div className="form-container">
            <h1>{qrCode ? '扫码登录' : '账号登录'}</h1>
            {!qrCode ? <div className="content">
              {this.renderForm()}
              <div className="form-bottom">
                <span><Link to="/register">立即注册</Link></span>
                <span><Link to="/reset">忘记密码</Link></span>
              </div>
            </div> : <img className="qr-code" src={qrCodeData} alt="" />}
            <img onClick={this.switchLoginType} className="switch-logo" src={qrCode ? toPwd : toQrCode} alt="" />
          </div>
        </div>
        <PageFooter reverse={this.props.location.pathname === '/login'}/>
      </div>
      
    );
  }
}

export default Form.create()(Login);
