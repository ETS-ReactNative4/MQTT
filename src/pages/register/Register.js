// @flow
import * as React from 'react';
import { Form, Input, Icon, Col, Row, Button, Checkbox, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { Loading, NavBar } from '../../components';
import './Register.css'
import Http from '../../service/Http';
import Utils from '../../service/Utils';
import { Md5 } from 'md5-typescript';

type ValidateStatus = 'success' | 'error' | 'warning' | 'validating'

type DisplayElement = string | React.Node

type Check = { regex: RegExp, message: DisplayElement }

type Props = {
  form: any,
  history: { push: string => void }
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

  agreement: boolean,
  agreementShow: boolean,
  agreementContent: React.Node,

  registering: boolean,
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

const formFooterLayout = {
  xs: { span: 24 },
  sm: { span: 17 },
};

const navs = [
  { title: '注册', selected: true }
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

const agreementContent = (
  <Loading />
);

const HTMLDecode = text => {
  return <div dangerouslySetInnerHTML={{ __html: text.replace(/&lg/g, '<').replace(/&tg/g, '>') }} />;
};

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

class Register extends React.Component<Props, State> {

  inputRefs: { [string]: ?HTMLInputElement } = {};

  intervalHandler: ?IntervalID = null;

  type='text';

  constructor(props: Props) {
    super(props);
    this.state = {
      verifyButton: verifyButtonInit,

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

      agreement: true,
      agreementShow: false,
      agreementContent,

      registering: false,
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

  verifyFocus = () => this.setState({ verifyValidate: 'success' });

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
      VerificationType: 1,
    });
    if (code === Http.ok) {
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
    } else {
      message.error(info);
      this.setState({ verifyButton: verifyButtonInit, verifyEnable: true, verifyLoading: false })
    }
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

  agreementChange = () => this.setState({ agreement: !this.state.agreement });

  agreementShow = async (index: number) => {
    this.setState({ agreementShow: true });

    const {
      ResultInfo: info,
      ResultCode: code,
      Data: data,
    } = await Http.get(`user/article/${index}`);
    if (code !== Http.ok) {
      return message.error(info);
    }

    this.setState({ agreementContent: HTMLDecode(data.Content) });
  };

  agreementHide = () => this.setState({ agreementShow: false, agreementContent, });

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
      agreement,
    } = this.state;

    if (![phoneValidate, verifyValidate, passwordValidate, passwordConfirmValidate]
      .every(it => it === 'success')) return;

    if (!agreement) return message.error('请同意服务条款');

    this.setState({ registering: true });

    const {
      ResultCode: code,
      ResultInfo: info,
      Data: user,
    } = await Http.post('app/user/regist', {
      MobileNumber: phone,
      VerificationCode: verify,
      Password: Md5.init(password+":emake").toUpperCase(),
    });

    if (code !== Http.ok) {
      this.setState({ registering: false });
      return message.error(info);
    }

    this.props.history.push('/register-success');
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
      verify, verifyHelper, verifyValidate, verifyEnable, verifyLoading,
      password, passwordHelper, passwordValidate,
      passwordConfirm, passwordConfirmHelper, passwordConfirmValidate,
      agreement, registering
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
            autoComplete="off"
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
                autoComplete="off"
                ref={ref => this.inputRefs['verify'] = ref}
                onFocus={this.verifyFocus}
                onBlur={this.verifyBlur}
                onChange={this.verifyChange}
                suffix={this.addOnAfterInput('verify')}
                value={verify}/>
            </Col>
            <Col span={10}>
              <Button
                loading={verifyLoading}
                disabled={!verifyEnable}
                className="btn-verify"
                onClick={this.verifyClick}>{verifyButton}</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="设置密码"
          required={true}
          help={passwordHelper}
          validateStatus={passwordValidate}>
          <Input
            ref={ref => this.inputRefs['password'] = ref}
            type={this.type}
            autoComplete="off"
            onFocus={this.passwordFocus}
            onBlur={this.passwordBlur}
            onChange={this.passwordChange}
            suffix={this.addOnAfterInput('password')}
            value={password}
            placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="确认密码"
          required={true}
          help={passwordConfirmHelper}
          validateStatus={passwordConfirmValidate}>
          <Input
            ref={ref => this.inputRefs['passwordConfirm'] = ref}
            type={this.type}
            autoComplete="off"
            onFocus={this.passwordConfirmFocus}
            onBlur={this.passwordConfirmBlur}
            onChange={this.passwordConfirmChange}
            suffix={this.addOnAfterInput('passwordConfirm')}
            value={passwordConfirm}
            placeholder="请再次输入密码" />
        </Form.Item>

        <Row className="form-footer">
          <Col { ...formFooterLayout }>
            <Checkbox checked={agreement} onChange={this.agreementChange} />
            &nbsp;我已认真阅读并同意
            <span className="form-agreement">
              <span onClick={() => this.agreementShow(1)}>《使用许可证》</span>
              <span onClick={() => this.agreementShow(3)}>《隐私政策》</span>
              <span onClick={() => this.agreementShow(2)}>《服务条款》</span>
            </span>
          </Col>
        </Row>

        <Row>
          <Col {...formWrapperLayout}>
            <span>“<span style={{ color: 'red' }}>*</span>” 为必填项</span>
          </Col>
          <Col {...formWrapperLayout}>
            <Button type="primary" className="form-submit" onClick={this.formSubmit} loading={registering}>立即注册</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAgreement() {
    const { agreementContent } = this.state;
    return (
      <div style={{ height: '400px', overflow: 'auto' }}>
        {agreementContent}
      </div>
    );
  }

  render() {
    const { agreementShow } = this.state;
    return (
      <div className="register-page">
        <NavBar navs={navs}/>
        <div className="form-container">
          <Row className="form-header">
            <Col {...formWrapperLayout} className="header">
              <span>已有账号？</span><Link to="/login">请登录</Link>
            </Col>
          </Row>
          {this.renderForm()}
        </div>
        <Modal
          title="易智造用户条款"
          visible={agreementShow}
          onCancel={this.agreementHide}
          okText="我同意"
          cancelText="关闭"
          onOk={() => this.setState({ agreement: true, agreementShow: false })}
        >
          {this.renderAgreement()}
        </Modal>
      </div>
    );
  }
}

export default Register;