// @flow
import * as React from 'react';
import { Form, Input, Icon, Col, Row, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components';
import './Reset.css';
import Http from '../../service/Http';
import { Md5 } from 'md5-typescript';
import successLogo from '../../assets/img/tuzi03.png';

type ValidateStatus = 'success' | 'error' | 'warning' | 'validating'

type DisplayElement = string | React.Node

type Check = { regex: RegExp, message: DisplayElement }

type Props = {
  form: any,
  history: { push: (string) => void },
}

type State = {
  verifyButton: string,

  phone: string,
  phoneHelper: ?DisplayElement,
  phoneValidate: ValidateStatus,

  verifyEnable: boolean,
  verifyLoading: boolean,
  verify: string,
  verifyHelper: ?DisplayElement,
  verifyValidate: ValidateStatus,

  password: string,
  passwordHelper: ?DisplayElement,
  passwordValidate: ValidateStatus,

  passwordConfirm: string,
  passwordConfirmHelper: ?DisplayElement,
  passwordConfirmValidate: ValidateStatus,

  submitting: boolean,
  success: boolean,
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const formWrapperLayout = {
  xs: {
    span: 24,
  },
  sm: {
    span: 12,
    offset: 5,
  }
};

const navs = [
  { title: '忘记密码', selected: true }
];

const normalMsg = msg => (
  <div>
    <Icon type="exclamation-circle-o"/> <span>{msg}</span>
  </div>
);

const warningMsg = msg => (
  <div>
    <Icon type="minus-circle-o" /> <span>{msg}</span>
  </div>
);

const verifyButtonInit = '获取验证码';

const normalHelpers = {
  phone: normalMsg('11位手机号码'),
  verify: normalMsg('验证码已发送，5分钟内输入有效'),
  password: normalMsg('6-11位字符,可包含数字，字母(区分大小写)'),
};

const helpers = {
  phone: [
    { regex: /^\S+$/, message: warningMsg('手机号码不能为空！') },
    { regex: /^1\d{10}$/, message: warningMsg('手机号码格式错误！') },
  ],
  verify: [
    { regex: /^\S+$/, message: warningMsg('验证码不能为空！') },
  ],
  password: [
    { regex: /^\S+$/, message: warningMsg('密码不能为空！') },
    { regex: /^[\da-zA-Z]+$/, message: warningMsg('密码格式错误：字符为数字和字母') },
    { regex: /^[\da-zA-Z]{6,}$/, message: warningMsg('密码格式错误：少于6位！') },
    { regex: /^[\da-zA-Z]{6,11}$/, message: warningMsg('密码格式错误：多于11位！') },
  ]
};

const getHelperDisplay = (key: string, value: string) => {
  const rules: Check[] = helpers[key];
  for (const { regex, message } of rules) {
    if (!regex.test(value)) {
      return {
        [`${key}Helper`]: message,
        [`${key}Validate`]: 'error',
      };
    }
  }
  return {
    [`${key}Helper`]: null,
    [`${key}Validate`]: 'success',
  };
};

class Reset extends React.Component<Props, State> {

  inputRefs: { [string]: ?HTMLInputElement } = {};

  intervalHandler: ?IntervalID = null;
  type='text';
  constructor(props: Props) {
    super(props);
    this.state = {
      verifyButton: '获取验证码',

      phone: '',
      phoneHelper: null,
      phoneValidate: 'success',

      verifyEnable: true,
      verifyLoading: false,
      verify: '',
      verifyHelper: null,
      verifyValidate: 'success',

      password: '',
      passwordHelper: null,
      passwordValidate: 'success',

      passwordConfirm: '',
      passwordConfirmHelper: null,
      passwordConfirmValidate: 'success',

      submitting: false,
      success: false,
    };
  }

  addOnAfterInput = (key: string) =>
    <Icon
      onClick={() => {
        this.setState({ [key]: '' });
        const input = this.inputRefs[key];
        input && input.focus();
      }}
      className="delete-content"
      type="close-circle" />;

  phoneFocus = () => this.setState({ phoneHelper: normalHelpers.phone, phoneValidate: 'success' });

  phoneBlur = () => this.setState({ ...getHelperDisplay('phone', this.state.phone) });

  phoneChange = (e: SyntheticInputEvent<>) => this.setState({ phone: e.target.value.trim() });

  verifyFocus = () => {};

  verifyBlur = () => this.setState({ ...getHelperDisplay('verify', this.state.verify) });

  verifyChange = (e: SyntheticInputEvent<>) => this.setState({ verify: e.target.value.trim() });

  verifyClick = async () => {
    const input = this.inputRefs['verify'];
    input && input.focus();

    const { phone, phoneValidate } = this.state;
    if (phoneValidate !== 'success') return;

    this.setState({ verifyEnable: false, verifyLoading: true });
    const { ResultCode: code, ResultInfo: info } = await Http.post('get/verificationcode', {
      MobileNumber: phone,
      VerificationType: 2,
    });
    if (code !== Http.ok) {
      this.setState({ verifyButton: verifyButtonInit, verifyEnable: true, verifyLoading: false });
      return message.error(info);
    }

    this.setState({
      verifyHelper: normalHelpers.verify,
      verifyValidate: 'success',
    });
    if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
    let time = 60;
    this.intervalHandler = setInterval(() => {
      if (time > 0) {
        this.setState({ verifyButton: `${time--}s后重新获取`, verifyLoading: false, verifyEnable: false });
      } else {
        this.setState({ verifyButton: verifyButtonInit, verifyEnable: true });
        if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
      }
    }, 1000);
  };

  passwordFocus = () => {this.type='password';this.setState({ passwordHelper: normalHelpers.password, passwordValidate: 'success' })};

  passwordBlur = () => this.setState({ ...getHelperDisplay('password', this.state.password) });

  passwordChange = (e: SyntheticInputEvent<>) => this.setState({ password: e.target.value.trim() });

  passwordConfirmFocus = () => {this.type='password';this.setState({ passwordConfirmHelper: null, passwordConfirmValidate: 'success' })};

  passwordConfirmBlur = () => {
    const { password, passwordConfirm } = this.state;
    if (password !== passwordConfirm) {
      this.setState({ passwordConfirmHelper: warningMsg('两次密码输入不一致！'), passwordConfirmValidate: 'error' });
    }
  };

  passwordConfirmChange = (e: SyntheticInputEvent<>) => this.setState({ passwordConfirm: e.target.value.trim() });

  formSubmit = async () => {
    // if (Utils.dev) {
    //   this.props.history.push('/register-success');
    // }

    const {
      phone,
      phoneValidate,
      verify,
      verifyValidate,
      password,
      passwordValidate,
      passwordConfirmValidate,
    } = this.state;

    if (![phoneValidate, verifyValidate, passwordValidate, passwordConfirmValidate]
      .every(it => it === 'success')) return;

    this.setState({ submitting: true });

    const {
      ResultCode: code,
      ResultInfo: info,
    } = await Http.post('user/password/forget', {
      Password:  Md5.init(password+":emake").toUpperCase(),
      VerificationCode: verify,
      MobileNumber:phone
    }, {
      headers: Http.authorization(phone, phone),
    });

    if (code !== Http.ok) {
      this.setState({ submitting: false });
      return message.error(info);
    }

    this.setState({ success: true });
  };

  successJump = () => {
    this.props.history.push('/login');
  };

  componentDidMount() {
    const phoneInput = this.inputRefs['phone'];
    phoneInput && phoneInput.focus();
  }

  componentWillUnmount() {
    if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
  }

  renderForm() {
    const {
      verifyButton,
      phone, phoneHelper, phoneValidate,
      verify, verifyHelper, verifyValidate, verifyEnable,
      password, passwordHelper, passwordValidate,
      passwordConfirm, passwordConfirmHelper, passwordConfirmValidate,
    } = this.state;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="手机号码"
          required={true}
          help={phoneHelper}
          validateStatus={phoneValidate}>
          <Input
            ref={ref => this.inputRefs['phone'] = ref}
            onFocus={this.phoneFocus}
            onBlur={this.phoneBlur}
            onChange={this.phoneChange}
            suffix={this.addOnAfterInput('phone')}
            value={phone}
            placeholder="请输入手机号码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          required={true}
          help={verifyHelper}
          validateStatus={verifyValidate}
          label="手机验证码">
          <Row gutter={8}>
            <Col span={14}>
              <Input
                ref={ref => this.inputRefs['verify'] = ref}
                onFocus={this.verifyFocus}
                autoComplete='off'
                onBlur={this.verifyBlur}
                onChange={this.verifyChange}
                suffix={this.addOnAfterInput('verify')}
                value={verify}/>
            </Col>
            <Col span={10}>
              <Button
                loading={!verifyEnable}
                className="btn-verify"
                onClick={this.verifyClick}>{verifyButton}</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="输入新密码"
          required={true}
          help={passwordHelper}
          validateStatus={passwordValidate}>
          <Input
            ref={ref => this.inputRefs['password'] = ref}
            type={this.type}
            autoComplete='off'
            onFocus={this.passwordFocus}
            onBlur={this.passwordBlur}
            onChange={this.passwordChange}
            suffix={this.addOnAfterInput('password')}
            value={password}
            placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="确认新密码"
          required={true}
          help={passwordConfirmHelper}
          validateStatus={passwordConfirmValidate}>
          <Input
            ref={ref => this.inputRefs['passwordConfirm'] = ref}
            type={this.type}
            autoComplete='off'
            onFocus={this.passwordConfirmFocus}
            onBlur={this.passwordConfirmBlur}
            onChange={this.passwordConfirmChange}
            suffix={this.addOnAfterInput('passwordConfirm')}
            value={passwordConfirm}
            placeholder="请再次输入新密码" />
        </Form.Item>

        <Row>
          <Col {...formWrapperLayout}>
            <Button type="primary" className="form-submit" onClick={this.formSubmit}>提交</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSuccess() {
    return (
      <div className="success-content">
        <div className="title">重置密码成功！</div>
        <img src={successLogo} alt=""/>
        <Button type="primary" onClick={this.successJump}>登录</Button>
      </div>
    );
  }

  render() {
    const { success } = this.state;
    return (
      <div className="reset-page">
        <NavBar navs={navs}/>
        {!success ? <div className="form-container">
          <Row className="form-header">
            <Col {...formWrapperLayout} className="header">
              <span>已有账号？</span><Link to="/login">请登录</Link>
            </Col>
          </Row>
          {this.renderForm()}
        </div> : this.renderSuccess()}
      </div>
    );
  }
}

export default Reset;