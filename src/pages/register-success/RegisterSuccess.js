// @flow
import * as React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { NavBar } from '../../components';
import SuccessLogo from '../../assets/img/tuzi03.png';
import './RegisterSuccess.css';

type Props = {}

type State = {}

const navs = [
  { title: '注册', selected: true }
];

export default class RegisterSuccess extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="register-success-page">
        <NavBar navs={navs} />

        <div className="content">
          <div className="title">恭喜您，注册成功！</div>
          <img src={SuccessLogo} alt="" />
          <div className="info">亲，为实现价格保护，请上传实名认证资料！</div>
          <Link to="/login"><Button type="primary">登录</Button></Link>
        </div>
      </div>
    );
  }
}