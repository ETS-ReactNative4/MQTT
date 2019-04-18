// @flow
import * as React from 'react';
import { Steps, Form, Input, Icon, Button, Select, Row, Col, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { Avatar, Loading } from '../../components';
import DealingLogo from '../../assets/img/tuzi02.png';
import DefaultAvatar from '../../assets/img/default_avatar.png';
import FailLogo from '../../assets/img/tuzi04.png';
import PSPDIdIconBack from '../../assets/img/shenfenzheng-fanli.png';
import PSPDIdIconFront from '../../assets/img/shenfenzhengzhengmianli.png';
import Identified from '../../assets/img/yirenzheng.png';
import Areas from '../../assets/json/area.json';
import './CenterIdentify.css'
import Http from '../../service/Http';
import User from '../../service/User';
import type { UserInfo } from '../../service/User';
import { UserState } from '../../service/User';

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

const stepProcess = 'process';
// const stepSuccess = 'success';
const stepError = 'error';
// const stepWait = 'wait';

const provinces = Areas.map(it => ({
  value: it.state,
  display: it.state,
}));
const cities = Areas.reduce((acc, cur) =>
  ({
    [cur.state]: cur.cities.map(it => ({ value: it.city, display: it.city })),
    ...acc,
  }), {});

type Props = {
  history: { push: string => void }
}

type State = {
  step: number,
  stepStatus: string,

  phone: string,

  truename: string,

  identifier: string,

  companyName: string,

  companyAddress: string,

  province: string,
  city: string,

  saleSets: { value: string, display: string }[],
  saleCategory: string,
  saleCategoryName: string,

  submitting: boolean,

  submitTime: ?string,

  showConfirmDlg: boolean,

  errorMsg: ?string,

  cardUrl: ?string,
  identifierFront: ?string,
  identifierBack: ?string,

  loading: boolean,
  showStep: boolean,

  avatar: ?string,
}

class CenterIdentify extends React.Component<Props, State> {
  inputRefs: { [string]: ?HTMLInputElement } = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      step: 0,
      stepStatus: stepProcess,

      phone: '',
      truename: '',
      identifier: '',

      companyName: '',
      companyAddress: '',

      province: provinces[0].value,
      city: cities[provinces[0].value][0].value,

      saleSets: [],
      saleCategory: '',
      saleCategoryName: '',

      submitting: false,
      submitTime: '',
      errorMsg: '由于您的名片信息与您的真实姓名不符',

      cardUrl: null,
      identifierBack: null,
      identifierFront: null,

      loading: false,
      showStep: true,

      avatar: null,

      showConfirmDlg: false,
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

  truenameChange = (e: SyntheticInputEvent<>) => this.setState({ truename: e.target.value.trim() });

  identifierChange = (e: SyntheticInputEvent<>) => this.setState({ identifier: e.target.value.trim() });

  companyNameChange = (e: SyntheticInputEvent<>) => this.setState({ companyName: e.target.value.trim() });

  companyAddressChange = (e: SyntheticInputEvent<>) => this.setState({ companyAddress: e.target.value.trim() });

  provinceChange = (v: string) => this.setState({ province: v, city: cities[v][0].value });

  cityChange = (v: string) => this.setState({ city: v });

  saleCategoryChange = (v: string) => this.setState({ saleCategory: v });

  cardUrlChange = (url: string) => this.setState({ cardUrl: url });
  cardUrlRemove = () => this.setState({ cardUrl: null });

  idFrontChange = (url: string) => this.setState({ identifierFront: url });
  idFrontRemove = () => this.setState({ identifierFront: null });

  idBackChange = (url: string) => this.setState({ identifierBack: url });
  idBackRemove = () => this.setState({ identifierBack: null });

  formSubmit = async () => {
    const {
      phone,
      truename,
      identifier,
      companyName,
      province,
      city,
      saleCategory,
      identifierFront,
      identifierBack,
      cardUrl,
    } = this.state;

    if (!phone) return message.error('请输入手机号');
    if (!truename) return message.error('请输入真实姓名');
    if (!identifier) return message.error('请输入身份证号');
    if (!companyName) return message.error('请输入单位名称');
    if (!province) return message.error('请输入业务区域');
    if (!city) return message.error('请输入业务区域');
    if (!saleCategory) return message.error('请输入经营品类');
    if (!cardUrl) return message.error('请上传名片');
    if (!identifierFront) return message.error('请上传身份证');
    if (!identifierBack) return message.error('请上传身份证');

    this.setState({ showConfirmDlg: true });
  };

  handleSubmitOk = async () => {
    this.setState({ submitting: true, showConfirmDlg: false });
    const {
      phone,
      truename,
      identifier,
      companyName,
      companyAddress,
      province,
      city,
      saleCategory,
      identifierFront,
      identifierBack,
      cardUrl,
      saleSets,
    } = this.state;
    const selectedSale = saleSets.find(it => it.value === saleCategory);
    const {
      ResultInfo: info,
      ResultCode: code,
      Data: data,
    } = await Http.put('user/info/update', {
      TelCell: phone,
      RealName: truename,
      PSPDId: identifier,
      Company: companyName,
      Address: companyAddress,
      Province: province,
      City: city,
      RawCardUrl: cardUrl,
      PSPDIdIconFront: identifierFront,
      PSPDIdIconBack: identifierBack,
      BusinessCategory: saleCategory,
      BusinessCategoryName: selectedSale ? selectedSale.display : '',
    });
    if (code !== Http.ok) {
      this.setState({
        submitting: false,
      });
      return message.error(info);
    }
    this.setState({
      step: 1,
      stepStatus: stepProcess,
      submitTime: data.EditWhen,
    });
    User.modify({ EditWhen: data.EditWhen });
  };

  handleSubmitCancel = async() => {
    this.setState({ showConfirmDlg: false });
  };

  async componentWillMount() {
    this.setState({ showStep: false, loading: true });
    const {
      ResultCode: code1,
      ResultInfo: info1,
      Data: userInfo,
    } = await Http.get('user/info');
    if (code1 !== Http.ok) {
      return message.error(info1);
    }
    User.modify(userInfo);

    switch (userInfo.UserState) {
      case UserState.preregister:
      case UserState.registered:
        await this.handleStep0(userInfo);
        break;
      case UserState.identifying:
        await this.handleStep1(userInfo);
        break;
      case UserState.unidentified:
        await this.handleStep2(userInfo);
        break;
      case UserState.identified:
        await this.handleShowPage(userInfo);
        break;
      default: break;
    }
  }

  async handleStep0(userInfo: UserInfo) {
    const {
      ResultCode: code,
      ResultInfo: info,
      Data: businessCategory,
    } = await Http.get('user/business/category');
    if (code !== Http.ok) {
      return message.error(info);
    }

    const sets = businessCategory.map(it => ({ display: it.CategoryName, value: it.CategoryId }));
    this.setState({
      step: 0,
      stepStatus: stepProcess,
      saleSets: sets,
      saleCategory: userInfo.BusinessCategory || sets[0].value,
      phone: userInfo.MobileNumber,
      truename: userInfo.RealName,
      companyName: userInfo.Company,
      companyAddress: userInfo.Address,
      province: userInfo.Province || provinces[0].value,
      city: userInfo.City || cities[provinces[0].value][0].value,
      identifier: userInfo.PSPDId,
      cardUrl: userInfo.RawCardUrl,
      identifierBack: userInfo.PSPDIdIconBack,
      identifierFront: userInfo.PSPDIdIconFront,
      loading: false,
      showStep: true,
    });
  }

  async handleStep1(userInfo: UserInfo) {
    this.setState({
      step: 1,
      stepStatus: stepProcess,
      loading: false,
      showStep: true,
      submitTime: userInfo.EditWhen,
    })
  }

  async handleStep2(userInfo: UserInfo) {
    this.setState({
      step: 2,
      stepStatus: stepError,
      loading: false,
      showStep: true,
      errorMsg: userInfo.AuditRemark,
    })
  }

  async handleShowPage(userInfo: UserInfo) {
    this.setState({
      loading: false,
      showStep: false,
      identifier: userInfo.PSPDId,
      phone: userInfo.MobileNumber,
      truename: userInfo.RealName,
      companyAddress: userInfo.Address,
      companyName: userInfo.Company,
      province: userInfo.Province,
      city: userInfo.City,
      saleCategoryName: userInfo.BusinessCategoryName,
      cardUrl: userInfo.RawCardUrl,
      identifierFront: userInfo.PSPDIdIconFront,
      identifierBack: userInfo.PSPDIdIconBack,
      avatar: userInfo.HeadImageUrl,
    })
  }

  renderInputPage = () => {
    const {
      phone,
      truename,
      identifier,
      companyName,
      companyAddress,
      province,
      city,
      saleCategory,
      submitting,
      saleSets,
      cardUrl,
      identifierBack,
      identifierFront,
    } = this.state;
    return (
      <Form>
        <Form.Item
          {...formItemLayout}
          label="手机号码">
          <Input
            ref={ref => this.inputRefs['phone'] = ref}
            onChange={this.phoneChange}
            suffix={this.addOnAfterInput('phone')}
            value={phone}
            placeholder="请输入手机号码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="真实姓名"
          required={true}>
          <Input
            ref={ref => this.inputRefs['truename'] = ref}
            onChange={this.truenameChange}
            suffix={this.addOnAfterInput('truename')}
            value={truename}
            placeholder="请输入真实姓名" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="身份证号"
          required={true}>
          <Input
            ref={ref => this.inputRefs['identifier'] = ref}
            onChange={this.identifierChange}
            suffix={this.addOnAfterInput('identifier')}
            value={identifier}
            placeholder="请输入身份证号码" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="单位名称"
          required={true}>
          <Input
            ref={ref => this.inputRefs['companyName'] = ref}
            onChange={this.companyNameChange}
            suffix={this.addOnAfterInput('companyName')}
            value={companyName}
            placeholder="请输入单位名称" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="公司地址">
          <Input
            ref={ref => this.inputRefs['companyAddress'] = ref}
            onChange={this.companyAddressChange}
            suffix={this.addOnAfterInput('companyAddress')}
            value={companyAddress}
            placeholder="请输入公司地址" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="业务区域"
          required={true}>
          <Row gutter={8}>
            <Col span={12}>
              <Select value={province} onChange={this.provinceChange}>
                {provinces.map(({value, display}, index) =>
                  <Select.Option key={index} value={value}>{display}</Select.Option>)}
              </Select>
            </Col>
            <Col span={12}>
              <Select value={city} onChange={this.cityChange}>
                {cities[province].map(({value, display}, index) =>
                  <Select.Option key={index} value={value}>{display}</Select.Option>)}
              </Select>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="经营品类"
          required={true}>
          <Select value={saleCategory} onChange={this.saleCategoryChange}>
            {saleSets.map(({value, display}, index) =>
              <Select.Option key={index} value={value}>{display}</Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="我的名片"
          required={true}>
          <Avatar
            hint="选择文件并上传"
            avatar={cardUrl}
            onChange={this.cardUrlChange}
            onDelete={this.cardUrlRemove}
            square={false}/>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="我的身份证"
          required={true}>
          <div className="identifier-row">
            <div className="identifier-col">
              <span>正面</span>
              <Avatar
                hint="选择文件并上传"
                avatar={identifierFront}
                onChange={this.idFrontChange}
                onDelete={this.idFrontRemove}
                square={false}/>
            </div>
            <div className="identifier-col">
              <span>反面</span>
              <Avatar
                hint="选择文件并上传"
                avatar={identifierBack}
                onChange={this.idBackChange}
                onDelete={this.idBackRemove}
                square={false}/>
            </div>
          </div>
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={<span style={{ color: 'grey' }}>例</span>}>
          <div className="identifier-row">
            <div className="identifier-col">
              <img src={PSPDIdIconFront} alt="" />
            </div>
            <div className="identifier-col">
              <img src={PSPDIdIconBack} alt="" />
            </div>
          </div>
        </Form.Item>

        <Row>
          <Col {...formWrapperLayout}>
            <span>上传图片大小请限制在2M以内，图片格式支持JPG、PNG、GIF，“<span style={{ color: 'red' }}>*</span>” 为必填项</span>
          </Col>
          <Col {...formWrapperLayout}>
            <Button type="primary" className="form-submit" onClick={this.formSubmit} loading={submitting}>提交审核</Button>
          </Col>
        </Row>
      </Form>
    );
  };

  renderShowPage() {
    const {
      phone,
      truename,
      identifier,
      companyName,
      companyAddress,
      province,
      city,
      saleCategoryName,
      cardUrl,
      identifierBack,
      identifierFront,
      avatar,
    } = this.state;
    return (
      <div className="identified-content">
        <img className="avatar" src={avatar || DefaultAvatar} alt=""/>

        <div className="desc">
          <span>{truename}</span>
          <img src={Identified} alt=""/>
          <span>已认证</span>
          <span className="phone">{phone}</span>
        </div>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">身份证号：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <span>{identifier}</span>
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">单位名称：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <span>{companyName}</span>
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">公司地址：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <span>{companyAddress}</span>
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">业务区域：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <span>{`${province} ${city}`}</span>
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">经营品类：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <span>{saleCategoryName}</span>
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">我的名片：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <img className="identify" src={cardUrl} alt="" />
          </Col>
        </Row>

        <Row className="row">
          <Col {...formItemLayout.labelCol}>
            <span className="title">我的身份证：</span>
          </Col>
          <Col {...formItemLayout.wrapperCol}>
            <img className="identify" src={identifierFront} alt="" />
            <img className="identify" src={identifierBack} alt="" />
          </Col>
        </Row>
      </div>
    );
  };

  renderChecking = () => {
    const { submitTime } = this.state;
    return (
      <div className="checking-identify">
        <span>实名认证信息已提交，客服审核1—3个工作日</span>
        <img src={DealingLogo} alt="" />
        <span>您的实名认证信息已提交客服审核中，请耐心等待</span>
        <span>提交时间：{submitTime}</span>
        <Button onClick={() => this.props.history.push('/')}>逛逛首页</Button>
      </div>
    );
  };

  renderCheckFail = () => {
    const { errorMsg } = this.state;
    return (
      <div className="check-failed">
        <span>很抱歉，您的实名认证失败！</span>
        <img src={FailLogo} alt="" />
        <span className="error">失败原因：{errorMsg}</span>
        <div className="btn">
          <Link to="/"><Button type="default">逛逛首页</Button></Link>&nbsp;&nbsp;
          <Button type="danger" onClick={() =>
            this.setState({ step: 0, stepStatus: stepProcess, submitting: false })
          }>再次审核</Button>
        </div>
      </div>
    );
  };

  pageMap = [
    this.renderInputPage,
    this.renderChecking,
    this.renderCheckFail,
  ];

  render() {
    const { step, stepStatus, loading, showStep, showConfirmDlg } = this.state;
    return (
      <div className="center-identify-page">
        {loading ? <Loading /> : (
          showStep ? (
            <div className="in-progress">
              <Steps current={step} status={stepStatus}>
                <Steps.Step title="填写基本信息" />
                <Steps.Step title="等待客服审核" />
                <Steps.Step title="审核结果" />
              </Steps>
              {this.pageMap[step]()}
            </div>
          ) : this.renderShowPage()
        )}
        <Modal
          title="提示"
          visible={showConfirmDlg}
          onOk={this.handleSubmitOk}
          onCancel={this.handleSubmitCancel}
          okText="提交"
          cancelText="取消"
        >
          <p>实名信息认证通过后将无法修改，是否提交？</p>
        </Modal>
      </div>
    );
  }
}

export default CenterIdentify;