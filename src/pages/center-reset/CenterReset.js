// @flow
import * as React from 'react';
import { Row, Col, Form, Input, Button, Icon, message } from 'antd';
import './CenterReset.css'
import Http from '../../service/Http';
import { Md5 } from 'md5-typescript';

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
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  submitting: boolean,
}

class CenterReset extends React.Component<Props, State> {
  inputRefs: { [string]: ?HTMLInputElement } = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      submitting: false,
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

  oldPasswordChange = (e: SyntheticInputEvent<>) => this.setState({ oldPassword: e.target.value.trim() });

  newPasswordChange = (e: SyntheticInputEvent<>) => this.setState({ newPassword: e.target.value.trim() });

  confirmPasswordChange = (e: SyntheticInputEvent<>) => this.setState({ confirmPassword: e.target.value.trim() });

  formSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = this.state;
    if (!oldPassword) return message.error('请输入旧密码');
    if (!newPassword) return message.error('请输入新密码');
    if (!/^[\da-zA-Z]+$/.test(newPassword)) return message.error('密码格式错误：字符为数字和字母');
    if (!/^[\da-zA-Z]{6,}$/.test(newPassword)) return message.error('密码格式错误：少于6位！');
    if (!/^[\da-zA-Z]{6,11}$/.test(newPassword)) return message.error('密码格式错误：多于11位！');
    if (newPassword !== confirmPassword) return message.error('两次密码输入不一致！');

    this.setState({ submitting: true });
    const {
      ResultInfo: info,
      ResultCode: code,
    } = await Http.put('user/password', {
      OldPassword: Md5.init(oldPassword+":emake").toUpperCase(),
      Password: Md5.init(newPassword+":emake").toUpperCase(),
      VerificationPassword: Md5.init(confirmPassword+":emake").toUpperCase(),
    });

    this.setState({ submitting: false });
    if (code !== Http.ok) {
      return message.error(info);
    }
    message.success('修改成功');
  };

  renderForm() {
    const { oldPassword, newPassword, confirmPassword, submitting } = this.state;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="原始密码"
          required={true}>
          <Input
            type="password"
            ref={ref => this.inputRefs['oldPassword'] = ref}
            onChange={this.oldPasswordChange}
            suffix={this.addOnAfterInput('oldPassword')}
            value={oldPassword}
            placeholder="请输入原始密码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="设置新密码"
          required={true}>
          <Input
            type="password"
            ref={ref => this.inputRefs['newPassword'] = ref}
            onChange={this.newPasswordChange}
            suffix={this.addOnAfterInput('newPassword')}
            value={newPassword}
            placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="确认密码"
          required={true}>
          <Input
            type="password"
            ref={ref => this.inputRefs['confirmPassword'] = ref}
            onChange={this.confirmPasswordChange}
            suffix={this.addOnAfterInput('confirmPassword')}
            value={confirmPassword}
            placeholder="请再次输入新密码" />
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
      <div className="center-reset-page">
        <Row className="form-header">
          <Col {...formWrapperLayout} className="header">
            重置密码
          </Col>
        </Row>
        {this.renderForm()}
      </div>
    );
  }
}

export default CenterReset;