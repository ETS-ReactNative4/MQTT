import './style.css';
import * as React from 'react';
import bg from '../../assets/gift-img/10000.png';
import close from '../../assets/gift-img/close.png';
import http from '../../service/Http';
import { message, Modal } from 'antd';
import Url from '../../service/Url';

export default class Get extends React.Component {

    showGot = false;
    edit = true;
    phone = "";
    code = "";

    constructor(props) {
        super(props);
        // const buf = sessionStorage.getItem("gift");
        // if(buf){
        //     const b = JSON.parse(buf);
        //     this.phone = b.phone,
        //     this.code = b.code,
        //     this.edit = false;
        // }
    }

    // 修改手机号码
    changeTel = () => {
        this.edit = true;
        this.setState({});
    }

    // 输入手机号码
    onInputPhone = (e) => {
        const val = e.target.value;
        if (val === "") {
            this.phone = val;
            this.setState({});
            return;
        }
        if (val) {
            const num = parseInt(val, 10);
            if (num !== NaN && num.toString().length === val.length) {
                this.phone = val;
                this.setState({});
            }
        }
    }

    // 输入验证码
    onInputCode = (e) => {
        const val = e.target.value;
        if (val === "") {
            this.code = val;
            this.setState({});
            return;
        }
        if (val) {
            const num = parseInt(val, 10);
            if (num !== NaN && num.toString().length === val.length) {
                this.code = val;
                this.setState({});
            }
        }
    }

    // 显示使用规则
    showRules = () => {
        this.props.history.push("/rules");
    }

    // 获取验证码
    getCode = async () => {
        if (!this.phone) {
            message.warn("手机号码不能为空");
            return;
        }
        const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
        if (!phoneReg.test(this.phone)) {
            message.warn("请输入正确的手机号码");
            return
        }
        const res = await http.post(Url.baseUrl+"/coupon/verificationcode", {
            MobileNumber: this.phone,
        });
        if (res.ResultCode === 0) {
            message.success("验证码已发送");
            return;
        }
        message.warn("获取验证码出错");
    }

    // 领取大礼包
    getBag = async () => {
        if (!this.phone) {
            message.warn("手机号码不能为空");
            return;
        }
        if (!this.code) {
            message.warn("验证码不能为空");
            return;
        }
        const res = await http.post(Url.baseUrl+"/web/receive/bag", {
            MobileNumber: this.phone,
            Code: this.code
        });
        if (res.ResultCode === 0) {
            this.edit = false;
            this.setState({});
            return
        }
        if (res.ResultCode === -1 || res.ResultCode === -2) {
            message.warn(res.ResultInfo);
            return;
        }
        if (res.ResultCode === -3) {
            this.showGot = true;
            this.setState({});
            return
        }
        message.warn("网络错误");
    }

    watch = () => {
        this.props.history.push(`/giftslist/${this.phone}/${this.code}`);
    }

    close = () => {
        this.showGot = false;
        this.setState({});
    }

    download() {
        window.open('http://www.emake.cn/download/');
    }


    render() {

        return (
            <div className="get-gift-page" style={{ background: 'linear-gradient(-90deg, #FF5527 6%, #D93E39 96%)' }}>
                <img src={bg} style={{
                    width: '100%'
                }} />
                <button className="use" onClick={this.showRules}>
                    使用规则
                </button>
                <div style={{ marginTop: '8px' }}>
                    {
                        this.edit ? (
                            <span>
                                <div className="tel">
                                    <input type="text" placeholder="请输入手机号" value={this.phone} onChange={this.onInputPhone} />
                                    <button onClick={this.getCode}>获取验证码</button>
                                </div>
                                <div className="code">
                                    <input type="text" placeholder="请输入验证码" value={this.code} onChange={this.onInputCode} />
                                </div>
                            </span>
                        ) : (
                                <div className="success">
                                    礼包已放入账号：{this.phone}
                                    &nbsp;&nbsp;
                                <a href="javascript: void(0)" onClick={this.changeTel} style={{
                                        fontSize: '16px',
                                        color: '#FA5800',
                                        letterSpacing: '0'
                                    }}>修改></a>
                                </div>
                            )
                    }
                    <div className="get" onClick={this.edit ? this.getBag : this.watch}>{this.edit ? "领取大礼包" : "查看大礼包"}</div>
                    <div className="download" onClick={this.download}>下载易智造APP</div>
                    <div style={{
                        background: 'rgba(201,15,2,0.35)',
                        color: '#fff',
                        width: '90%',
                        margin: '16px 5% 0',
                        padding: '16px 8px',
                        borderRadius: '4px'
                    }}>
                        <h3 style={{ color: '#fff', textAlign: 'center' }}>活动规则</h3>
                        <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>时间：2018年9月1日 00:00-2018年9月30日23:59:59（领取即可使用），过期作废
                        </p>
                        <h3 style={{ color: '#fff', textAlign: 'center' }}>参与条件</h3>
                        <p style={{ fontSize: '12px' }}>1、“易智造”APP，新用户（从未登录过易智造的用户）通过指定新人活动页面，登陆后均可参与该活动，新用户将有机会领取价值最高10000元现金大礼包;</p>
                        <p style={{ fontSize: '12px' }}>2、礼包领取后，需要在APP下单后方可使用抵用现金大礼包。</p>
                    </div>
                </div>
                <Modal visible={this.showGot} footer={false} title="已领取提示" className="gifts-modal">
                    <p>{this.phone}已领取</p>
                    <button onClick={this.watch}>查看大礼包</button>
                    <img src={close} style={{
                        position: 'absolute',
                        width: '24px',
                        height: '24px',
                        top: '13px',
                        right: '12px'
                    }} onClick={this.close} />
                </Modal>
            </div>
        )
    }



}