import './style.css';
import * as React from 'react';
import http from '../../service/Http';
import tbg from '../../assets/gift-img/tbg.png';
import close from '../../assets/gift-img/close.png';
import used from '../../assets/gift-img/used.png';
import guoqi from '../../assets/gift-img/guoqi.png';
import adv from '../../assets/gift-img/adv.png';
import { message, Modal } from 'antd';
import * as moment from 'moment';
import * as ClipboardJS from 'clipboard';
import Url from '../../service/Url';


export default class List extends React.Component {

    constructor(props) {
        super(props);
        const path = this.props.location.pathname;
        this.phone = path.split("/")[2];
        this.code = path.split("/")[3];
    }

    showUse = true;
    showGiftCode = false;
    curCode = "";

    componentWillMount() {
        this.getBags();
    }

    canUse = [];

    cant = [];

    getBags = async () => {
        const res = await http.get(Url.baseUrl+`/web/receive/bag?MobileNumber=${this.phone}&Code=${this.code}`);
        if (res.ResultCode === 0) {
            this.canUse = [];
            this.cant = [];
            res.Data.forEach(ele => {
                if (ele.IsUsed === '0' && moment().isBefore(moment(ele.EndAt))) {
                    this.canUse.push(ele);
                } else {
                    this.cant.push(ele);
                }
            });
            this.setState({});
            return;
        }
        message.warn("查询失败");
    }

    fmtTime(t) {
        if (t && t.length >= 10) {
            t = t.replace(/-/g, ".");
            return t.substring(0, 10);
        }
        return ""
    }

    // 显示使用规则
    showRules = () => {
        this.props.history.push("/rules");
    }

    close = () => {
        this.showGiftCode = false;
        this.setState({});
    }

    useCode = (it) => () => {
        this.curCode = it.CouponId;
        this.showGiftCode = true;
        this.board = new ClipboardJS("#giftCodeBtn");
        this.setState({});
    }

    copy = (e) => {
        message.success("复制成功！");
        setTimeout(() => { this.board.destroy() }, 200);
    }

    switch = () => {
        this.showUse = !this.showUse;
        this.setState({});
    }

    download() {
        window.open('http://www.emake.cn/download/');
    }


    render() {

        return (
            <div className="gift-list-page">
                <header className="header">
                    <div><button onClick={this.switch} style={{ borderBottom: this.showUse ? '3px solid #fff' : 'none' }}>可用 ({this.canUse.length})</button></div>
                    <div><button onClick={this.switch} style={{ borderBottom: !this.showUse ? '3px solid #fff' : 'none' }}>不可用 ({this.cant.length})</button></div>
                </header>
                <p style={{
                    margin: '0',
                    padding: '8px 5% 0 0',
                    textAlign: 'right'
                }}>
                    <a href="javascript: void(0)" onClick={this.showRules} style={{
                        fontSize: '13px',
                        color: '#4A90E2'
                    }}>使用规则</a>
                </p>
                {
                    this.showUse ? (
                        <div className="list">
                            {
                                this.canUse.map((it, idx) => <div key={idx} style={{
                                    position: 'relative',
                                    width: '94%',
                                    margin: '8px 3%'
                                }}>
                                    <img src={tbg} style={{
                                        height: '100px',
                                        width: '100%'
                                    }} />
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0' }}>
                                        <p style={{ height: '60%', margin: '0', paddingLeft: '16px', paddingTop: '16px' }}>
                                            <span style={{
                                                fontSize: '30px',
                                                color: '#F8695D'
                                            }}>￥{it.CouponValue}</span>
                                            &nbsp;
                                            <span style={{
                                                fontSize: '14px',
                                                color: '#F8695D'
                                            }}>满{it.MinPrice}减{it.CouponValue}</span>
                                        </p>
                                        <p style={{
                                            paddingTop: '8px',
                                            height: '40%',
                                            margin: '0',
                                            paddingLeft: '16px',
                                            fontSize: '10px',
                                            fontFamily: 'PingFangSC-Regular',
                                            color: '#9B9B9B'
                                        }}>{this.fmtTime(it.BeginAt) + "-" + this.fmtTime(it.EndAt)}</p>
                                        <button onClick={this.useCode(it)}
                                            style={{
                                                position: 'absolute',
                                                fontSize: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                right: window.innerWidth < 325 ? '4%' : '6%',
                                                borderRadius: '16px',
                                                color: '#F8695D',
                                                border: '1px solid #F8695D',
                                                backgroundColor: 'transparent',
                                                padding: '0 10px',
                                                outline: 'none',
                                                height: '25px',
                                                lineHeight: '25px'
                                            }}
                                        >立即使用</button>
                                    </div>
                                </div>)
                            }
                            <br />
                            <p style={{ fontSize: '12px', color: '#9B9B9B', textAlign: 'center', marginBottom: '48px' }}>亲！我是有底线的~</p>
                        </div>
                    ) : (
                            <div className="list">
                                {
                                    this.cant.map((it, idx) => <div key={idx} style={{
                                        position: 'relative',
                                        width: '94%',
                                        margin: '8px 3%'
                                    }}>
                                        <img src={tbg} style={{
                                            height: '100px',
                                            width: '100%'
                                        }} />
                                        <div style={{ position: 'absolute', width: '100%', height: '100%', top: '0', left: '0' }}>
                                            <p style={{ height: '60%', margin: '0', paddingLeft: '16px', paddingTop: '16px' }}>
                                                <span style={{
                                                    fontSize: '30px',
                                                    color: '#F8695D'
                                                }}>￥{it.CouponValue}</span>
                                                &nbsp;
                                            <span style={{
                                                    fontSize: '14px',
                                                    color: '#F8695D'
                                                }}>满{it.MinPrice}减{it.CouponValue}</span>
                                            </p>
                                            <p style={{
                                                paddingTop: '8px',
                                                height: '40%',
                                                margin: '0',
                                                paddingLeft: '16px',
                                                fontSize: '10px',
                                                fontFamily: 'PingFangSC-Regular',
                                                color: '#9B9B9B'
                                            }}>{this.fmtTime(it.BeginAt) + "-" + this.fmtTime(it.EndAt)}</p>
                                            <img
                                                src={moment().isBefore(moment(it.EndAt)) ? used : guoqi}
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    right: window.innerWidth < 325 ? '6%' : '8%',
                                                    width: '56px',
                                                    height: '56px'
                                                }}
                                            />
                                        </div>
                                    </div>)
                                }
                                <br />
                                <p style={{ fontSize: '12px', color: '#9B9B9B', textAlign: 'center', marginBottom: '48px' }}>亲！我是有底线的~</p>
                            </div>
                        )
                }

                <img src={adv} style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '44px' }}
                    onClick={this.download}
                />

                <Modal visible={this.showGiftCode} footer={false} title="优惠券码" className="gifts-modal">
                    <p><input value={this.curCode} style={{
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent'
                    }} /></p>
                    <button id="giftCodeBtn" onClick={this.copy} data-clipboard-text={this.curCode}>复制使用</button>
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
