// @flow
import * as React from 'react';
import { Form, Input, Icon, Radio, Row, Col, Button, message } from 'antd';
import { Avatar, Loading } from '../../components';
import './CenterProfile.css';
import UserService, { UserGender } from '../../service/User';
import type { UserInfo } from '../../service/User';
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
  avatar: ?string,
  phone: string,
  nickname: string,
  gender: string,
  loading: boolean,
  submitting: boolean,
}

class CenterProfile extends React.Component<Props, State> {
  inputRefs: { [string]: ?HTMLInputElement } = {};
  userInfoCache: UserInfo;

  constructor(props: Props) {
    super(props);
    this.state = {
      avatar: '',
      phone: '',
      nickname: '',
      gender: UserGender.unknown,
      loading: true,
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

  avatarChanged = (url: string) => this.setState({ avatar: url });

  avatarDeleted = () => this.setState({ avatar: null });

  nicknameChanged = (event: SyntheticInputEvent<>) => this.setState({ nickname: event.target.value });

  genderChanged = (event: SyntheticInputEvent<>) => this.setState({ gender: event.target.value });

  formSubmit = async () => {
    const { avatar, nickname, gender } = this.state;
    this.setState({ submitting: true });
    const {
      ResultInfo: info1,
      ResultCode: code1,
    } = await Http.put('user/info', { ...this.userInfoCache, Sex: gender, });
    if (code1 !== Http.ok) {
      this.setState({ submitting: false });
      return message.error(info1);
    }

    const modifiedUser = {
      ...UserService.get(),
      NickName: nickname,
      HeadImageUrl: avatar || '',
    };
    const {
      ResultInfo: info2,
      ResultCode: code2,
    } = await Http.put('user', modifiedUser);
    if (code2 !== Http.ok) {
      this.setState({ submitting: true });
      message.success('性别修改成功');
      return message.error(info2);
    }
    message.success('修改成功');
    UserService.modify(modifiedUser);
    this.setState({ submitting: false });
  };

  async componentWillMount() {
    const {
      ResultCode: code,
      ResultInfo: info,
      Data: user,
    }: {
      ResultCode: number,
      ResultInfo: string,
      Data: UserInfo,
    } = await Http.get('user/info');
    if (code !== Http.ok) return message.error(info);

    UserService.modify(user);
    this.userInfoCache = { ...user };
    this.setState({
      avatar: user.HeadImageUrl,
      phone: user.MobileNumber,
      nickname: user.NickName,
      gender: user.Sex,
      loading: false,
    })
  }

  renderForm() {
    const { avatar, phone, nickname, gender, submitting } = this.state;
    return (
      <Form style={{marginBottom:20}}>
        <Form.Item
          {...formItemLayout}
          label="当前头像">
          <Avatar avatar={avatar} onDelete={this.avatarDeleted} onChange={this.avatarChanged}/>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          required={true}
          label="手机号">
          <Input
            readOnly={true}
            ref={ref => this.inputRefs['phone'] = ref}
            value={phone}
            placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="昵称"
          help={<span><Icon type="info-circle" theme="outlined" style={{marginRight:5}}/>昵称不超过10个字符</span>}>
          <Input
            ref={ref => this.inputRefs['nickname'] = ref}
            suffix={this.addOnAfterInput('nickname')}
            onChange={this.nicknameChanged}
            value={nickname}
            maxLength={10}
            placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="性别">
          <Radio.Group onChange={this.genderChanged} value={gender}>
            <Radio value={UserGender.male}>男</Radio>
            <Radio value={UserGender.female}>女</Radio>
            <Radio value={UserGender.unknown}>保密</Radio>
          </Radio.Group>
        </Form.Item>

        <Row>
          <Col {...formWrapperLayout}>
            <span>“<span style={{ color: 'red' }}>*</span>” 为必填项</span>
          </Col>
          <Col {...formWrapperLayout}>
            <Button type="primary" className="form-submit" onClick={this.formSubmit} loading={submitting}>保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.state;
    return (
      <div className="center-profile-page">
        {loading ? <Loading /> : this.renderForm()}
      </div>
    );
  }
}

export default CenterProfile;