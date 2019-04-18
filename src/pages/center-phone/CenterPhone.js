// @flow
import * as React from 'react';
import { Form, Input, Icon, Row, Col, Button, message } from 'antd';
import './CenterPhone.css';
import Http from '../../service/Http';

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

type Props = {}

type State = {
  phone: string,
  verify: string,
  verifyButton: string,
  submitting: boolean,
  verifyReceiving: boolean,
  verifyDisable: boolean,
}

const verifyBtnText = '获取验证码';

class CenterPhone extends React.Component<Props, State> {
  inputRefs: { [string]: ?HTMLInputElement } = {};

  intervalHandler: ?IntervalID = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      phone: '',
      verify: '',
      verifyButton: verifyBtnText,
      submitting: false,
      verifyReceiving: false,
      verifyDisable: false,
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

  phoneChange = (e: SyntheticInputEvent<>) => this.setState({ phone: e.target.value.trim() });

  verifyChange = (e: SyntheticInputEvent<>) => this.setState({ verify: e.target.value.trim() });

  verifyClick = async () => {
    const { phone } = this.state;
    if (!/^1\d{10}/.test(phone)) {
      return message.error('请输入正确的手机号');
    }
    this.setState({ verifyReceiving: true, verifyDisable: true });
    const {
      ResultCode: code,
      ResultInfo: info,
    } = await Http.post('get/verificationcode', {
      MobileNumber: phone,
      VerificationType: 2,
    });
    if (code !== Http.ok) {
      this.setState({
        verifyReceiving: false,
        verifyDisable: false,
        verifyButton: verifyBtnText,
      });
      return message.error(info);
    }

    if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
    let time = 60;
    this.intervalHandler = setInterval(() => {
      if (time > 0) {
        this.setState({ verifyButton: `${time--}s后重新获取`, verifyReceiving: false, verifyDisable: true });
      } else {
        this.setState({ verifyButton: verifyBtnText, verifyDisable: false });
        if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
      }
    }, 1000);

  };

  formSubmit = async () => {
    const { phone, verify } = this.state;
    if (!/^1\d{10}/.test(phone)) {
      return message.error('请输入正确的手机号');
    }
    if (!verify) {
      return message.error('请输入验证码');
    }
    this.setState({ submitting: true });
    const {
      ResultCode: code,
      ResultInfo: info,
    } = await Http.put('user/mobilenumber', {
      MobileNumber: phone,
      VerificationCode: verify,
    });
    if (code !== Http.ok) {
      this.setState({ submitting: false });
      return message.error(info);
    }
    message.success('修改成功');
    this.setState({ submitting: false, verify: '', phone: '' });
  };

  componentWillUnmount() {
    if (this.intervalHandler !== null) clearInterval(this.intervalHandler);
  }

  renderForm() {
    const { phone, verify, verifyButton, submitting, verifyDisable, verifyReceiving } = this.state;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="手机号码"
          required={true}>
          <Input
            ref={ref => this.inputRefs['phone'] = ref}
            onChange={this.phoneChange}
            suffix={this.addOnAfterInput('phone')}
            value={phone}
            placeholder="请输入手机号码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          required={true}
          label="手机验证码">
          <Row gutter={8}>
            <Col span={14}>
              <Input
                ref={ref => this.inputRefs['verify'] = ref}
                onChange={this.verifyChange}
                suffix={this.addOnAfterInput('verify')}
                value={verify}/>
            </Col>
            <Col span={10}>
              <Button
                loading={verifyReceiving}
                disabled={verifyReceiving || verifyDisable}
                className="btn-verify"
                onClick={this.verifyClick}>{verifyButton}</Button>
            </Col>
          </Row>
        </Form.Item>

        <Row>
          <Col {...formWrapperLayout}>
            <span>“<span style={{ color: 'red' }}>*</span>” 为必填项</span>
          </Col>
          <Col {...formWrapperLayout}>
            <Button type="primary" loading={submitting} className="form-submit" onClick={this.formSubmit}>保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className="center-phone-page">
        <Row className="form-header">
          <Col {...formWrapperLayout} className="header">
            修改手机
          </Col>
        </Row>
        {this.renderForm()}
      </div>
    );
  }
}

export default CenterPhone;