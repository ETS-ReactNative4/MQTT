import React, { Component } from 'react';
import './msgs.css';
import nomsg from '../../assets/mall/wuxiaoxi.png';
import touxiang from '../../assets/mall/touxiang.png';
import tuzi from '../../assets/mall/tuzi.png';
import kefu from  '../../assets/img/price.png';
import v from '../../assets/mall/v.png';
import ing from '../../assets/mall/ing.gif';
import { Modal, message, Spin, Divider, Icon } from 'antd';
import Http from '../../service/Http';
import * as moment from 'moment';
import User from '../../service/User';
import { connect } from 'tls';

// const BrowserWindow = window.electron.remote.BrowserWindow;
const pro = window.child_process;

/* 参数：
    msgs：消息列表 
    id
    */

class Msgs extends Component {

    wrap = null;
    info = null;
    id = "";
    len = 0;
    ShowPDFContent = false;
    lastMsgId = 0;
    componentWillMount() {
        this.id = this.props.id;
        this.info = User.get();
        this.setState({
            update: false
        })
    }

    // 头像
    src = (it) => {
        if (it.SenderInfo.HeadImageUrl !== undefined && it.SenderInfo.HeadImageUrl !== '') {
            // if (it.fromUser) {
            return it.SenderInfo.HeadImageUrl;
            // }
        }
        return kefu;
    }

    componentDidUpdate() {
        // if (this.id !== this.props.id) {
        //     this.wrap.scrollTop = this.wrap.scrollHeight;
        //     this.id = this.props.id;
        // }
        this.loaded();
    }

    loaded = () => {
        const ms = this.props.msgs;
        console.log(ms);
        if ( ms && !ms.length) {
            return
        }
        const curId = ms && ms[ms.length - 1].msgID;
        if (this.lastMsgId !== curId) {
            this.lastMsgId = curId;
            this.wrap.scrollTop = this.wrap.scrollHeight;
        }
    }

    // componentDidUpdate() {
    //     if (this.id !== this.props.id || this.len !== this.props.room.msgs.length) {
    //         this.wrap.scrollTop = this.wrap.scrollHeight;
    //         this.id = this.props.id;
    //         this.len = this.props.room.msgs.length;
    //     }
    // }

    // loaded = () => {
    //     this.wrap.scrollTop = this.wrap.scrollHeight;
    // }

    open = (body) => {
        console.log(body);
        if (body.MsgType === 'Goods') {
            const data = JSON.parse(body.MsgContent);
            const code = data.GoodsSeriesCode? data.GoodsSeriesCode: '';
            this.props.open(code);
        } else if (body.MsgType === 'MutilePart') {
            const data = body.MsgContent? JSON.parse(body.MsgContent): {};
            const code = data.Contract ? data.Contract:'';
            const state = data.ContractState ? data.ContractState: '';
            let str = 'look';
            if (state === '0') {
                str = User.getToken();
            }
            this.props.sign(code, str);
        } else if (body.MsgType === 'Order') {

        }
        // if (body.ContractType === '2') {
        //     this.props.sign(body.Url);
        // } else {
        //     if (body.ContractState == '0') {
        //         this.props.sign(body.Contract)
        //     } else {
        //         if (body && body.indexOf('mallGoodsDetail') !== -1) {
        //             this.props.sign(body);
        //         } else {
        //             this.props.sign(body.Url);
        //         }
        //     }
        // }
        // this.props.sign(url);
        // if (url.indexOf('individual') !== -1) {
        //     const a = url.substring(url.lastIndexOf('/') + 1);
        //     const b = url.substring(44, 55);
        //     const res = await Http.get(`web/make/technology?ContractNo=${b}&ProductId=${a}`);
        //     if (res.data.params.length === 0) {
        //         message.warn('该商品未配置技术协议');
        //         return
        //     }
        // }
        // pro.exec('start ' + url);
    }

    // 跳转到订单
    jump = (data) => () => {
        console.log(data);
        this.props.jump(data.ContractNo);
    }
    StopAudio = (e) => {
        const t = document.querySelectorAll('audio');
        const tar = document.getElementById(e);
        t.forEach(ts => {
            if (ts !== tar) {
                ts.pause();
            }
        })
    }
    openFile = (FilePath) => {
        window.open(FilePath);
    }
    rendMsg = (m) => {
        const checkIsMine = (m) => {
            if (m.SenderId === User.getId()) {
                return true;
            }
            return false;
        }
        // console.log(m);
        if (!m || !m.MsgContent) {
            return ''
        }
        if (m.MsgType === 'Text') {
            // if (checkIsMine(m)) {
            //     return <span>{m.MsgContent}</span>
            // } else {
            //     const nickName = m.SenderInfo? m.SenderInfo.NickName: '';
            //     return <div>
            //         <p>客服 {nickName}</p>
            //         <span>{m.Msg}</span>
            //     </div>
            // }
            return (
                <span>{m.MsgContent}</span>
            )
        }
        if (m.MsgType === 'File') {
            const content = m.MsgContent ? JSON.parse(m.MsgContent): {};
            return (
                <div className="send_goods_c" onClick={this.openFile.bind(this, content.FilePath)}>
                    <a href={content.FilePath} download={true} target="_blank">
                        <div className="wrap">
                            <Icon type="file" style={{fontSize: '30px'}} />
                            <div className="info_c" style={{height: 'auto'}}>
                                <div>
                                    <span className="price_c" title={content.FileName}>{content.FileName}</span>
                                </div>
                                <p className="num_c" style={{margin: "0", color: '#c9c9c9' }}>{content.FileSize}</p>
                            </div>
                        </div>
                    </a>
                </div>
            )

        }
        if (m.MsgType === 'Goods') {
            const data = JSON.parse(m.MsgContent);
            console.log(data);
            return (
                <div className="send_goods_c">
                    <a href="javascript: void(0)" onClick={this.open.bind(this, m)}>
                        <div className="wrap">
                            <img src={data.GoodsSeriesIcon} alt="img" style={{border: '1px solid #ccc'}}/>
                            <div className="info_c">
                                <div>
                                    {/* <span className="span">{data.IsStandard == '1' ? "标准品" : "设计品"}</span> */}
                                    <span className="price_c" title={data.GoodsSeriesName}>{data.GoodsSeriesTitle}</span>
                                </div>
                                <p className="num_c" style={{ color: "#5ebecd", fontSize: "20px", margin: "0" }}>￥{data.GoodsPriceMin}<span className="GoodsSeriesUnit">/{data.GoodsSeriesUnit}</span><span className="from">起</span></p>
                            </div>
                        </div>
                    </a>
                </div>
            )
        }
        if (m.MsgType === 'Image') {
            return (
                <a href={m.MsgContent} target="_blank">
                    <img src={m.MsgContent} alt="img"
                        width="150"
                    // onLoad={this.loaded}
                    />
                </a>
            )
        }
        if (m.MsgType === 'Voice') {
            const voice = m.MsgContent ? JSON.parse(m.MsgContent): {};
            return (
                <audio className="audio_play" duration={m.VoiceDuration} id={m.MsgId} src={voice.Voice} controls="controls" onPlay={this.StopAudio.bind(this, m.MsgId)} />
            )
        }
        if (m.MsgType === 'MutilePart') {
            const data = m.MsgContent ? JSON.parse(m.MsgContent): {};
            return (
                <a href="javascript: void(0)" onClick={this.open.bind(this, m)}>
                    <h5 style={{ textAlign: 'center', margin: '0', padding: '8px' }}>{data.Text}</h5>
                    <img src={data.ImageUrl ? data.ImageUrl: data.Image} alt="contract"
                        width="150"
                        onLoad={this.loaded}
                    />
                </a>
            )
        }
        if (m.MsgType === 'SuperGroup') {
            if (!m.body.Text) {
                return '[此条数据为异常的测试数据]'
            }
            const data = JSON.parse(m.body.Text);
            let photos = [];
            try {
                photos = JSON.parse(data.GoodsSeriesPhotos);
            } catch (e) {
                photos = data.GoodsSeriesPhotos;
            }
            return (
                <div className="super_group">
                    <a href='javascript:void(0)' target="_blank">
                        <h5 title={data.GroupName}>{data.GroupName}</h5>
                        <div className="wrap">
                            <img src={photos[0]} alt="group"
                                onLoad={this.loaded}
                            />
                            <div className="info_c">
                                <p className="price_c">
                                    <span className="now_price">￥{data.GroupPrice}</span>
                                    <span>&nbsp;/{data.Unit}&nbsp;起</span>
                                    &nbsp;
                                    &nbsp;
                                    <span className="now_price">拼团价</span>
                                </p>
                                <p className="old_c">
                                    ￥{data.OldPrice}&nbsp;原价
                                </p>
                                <p className="desc_c">{data.GoodsAddValue}</p>
                            </div>
                        </div>
                    </a>
                </div>
            )
        }
        // if(m.body.Type === 'Order'){
        //     const data = JSON.parse(m.body.Text);
        //     return (
        //         <div className="send_goods_c">
        //             <a href="javascript: void(0)" onClick={this.jump(data.ContractNo)}>
        //                 <h5 style={{padding: '8px 16px 0', margin: '0 auto',fontSize:'16px'}}>订单提醒</h5>
        //                 <Divider style={{margin:'5px'}}/>
        //                 <p style={{margin: '0', paddingLeft: '16px', color: '#ccc'}}>订单号：{data.ContractNo}</p>
        //                 <div className="wrap">
        //                     <img src={data.GoodsSeriesIcon} alt="img"/>
        //                     <div className="info_c">
        //                         <p className="price_c" title={data.GoodsTitle}>
        //                             <span style={{
        //                                 backgroundColor: data.IsStandard === '1' ? 'rgba(77, 189, 204, 1)' : 'rgba(255, 204, 0, 1)',
        //                                 color: 'white',
        //                                 fontSize: '9px',
        //                                 padding: '0 2px'
        //                             }}>
        //                                 {data.IsStandard === '1' ? '标准品' : '设计品'}
        //                             </span>
        //                             &nbsp;
        //                             {data.GoodsTitle}
        //                         </p>
        //                         <p className="num_c" style={{color:'#b7b7b7'}} title={data.GoodsExplain}>{data.GoodsExplain}</p>
        //                     </div>
        //                 </div>
        //                 <Divider style={{margin:'5px'}}/>
        //                 <p
        //                 style={{
        //                     fontSize: '12px',
        //                     color: '#ccc',
        //                     margin: '0',
        //                     padding: '8px 16px',
        //                     textAlign: 'right'
        //                 }}
        //                 >共{data.ContractQuantity}件商品&nbsp;&nbsp;合计￥
        //                     <span style={{color: '#4dbecd'}}>
        //                         {parseFloat(data.ContractAmount)}
        //                     </span>
        //                 </p>
        //             </a>
        //         </div>
        //     )
        // }
    }
    rendMsgOrder = (m) => {
        const data = m.MsgContent? JSON.parse(m.MsgContent): {};
        return (
            <div className="send_goods_c">
                <a href="javascript: void(0)" onClick={this.jump(data)}>
                    <h5 style={{ padding: '8px 16px 0', margin: '0 auto', fontSize: '16px' }}>订单提醒</h5>
                    <Divider style={{ margin: '5px 0' }} />
                    <p style={{ margin: '0', paddingLeft: '16px', color: '#ccc' }}>订单号：{data.ContractNo}<span></span></p>
                    <div className="wrap">
                        <img src={data.GoodsSeriesIcon} alt="img" />
                        <div className="info_c">
                            <p className="price_c" title={data.GoodsTitle}>
                                {/* <span style={{
                                    backgroundColor: data.IsStandard === '1' ? 'rgba(77, 189, 204, 1)' : 'rgba(255, 204, 0, 1)',
                                    color: 'white',
                                    fontSize: '9px',
                                    padding: '0 2px'
                                }}>
                                    {data.IsStandard === '1' ? '标准品' : '设计品'}
                                </span> */}
                                {/* &nbsp; */}
                                    {data.GoodsTitle}
                            </p>
                            <p className="num_c" style={{ color: '#b7b7b7' }} title={data.GoodsExplain}>{data.GoodsExplain}</p>
                        </div>
                    </div>
                    <Divider style={{ margin: '5px 0' }} />
                    <p
                        style={{
                            fontSize: '12px',
                            color: '#ccc',
                            margin: '0',
                            padding: '8px 16px',
                            textAlign: 'right'
                        }}
                    >共{data.ContractQuantity}件商品&nbsp;&nbsp;合计￥
                            <span style={{ color: '#4dbecd' }}>
                            {parseFloat(data.ContractAmount)}
                        </span>
                    </p>
                </a>
            </div>
        )
    }
    // 获取用户信息
    getUserInfo = async (id) => {
        if (!id || !this.info) {
            return;
        }
        const res = await Http.get(`user/info?UserId=${id}`)
        // const res = await Http.get(`store/servergetuserinfo?UserId=${id}&CategoryBId=${this.info.CategoryBId}`)
        if (res.code != 0) {
            message.warn('未获取到用户信息');
            return;
        }
        res.data.avatar = res.data.HeadImageUrl;
        this.curInfo = res.data;
        if (!this.curInfo.RemarkName) {
            this.curInfo.RemarkName = '';
        }
        if (!this.curInfo.RemarkCompany) {
            this.curInfo.RemarkCompany = '';
        }
        this.showInfo = true;
        this.setState({});
    }

    showInfo = false;
    curInfo = null;
    openInfo = (id) => () => {
        // this.getUserInfo(id);
    }

    closeM = () => {
        this.showInfo = false;
        this.setState({});
    }

    edit = async () => {
        const res = await Http.put('console/customserviceadduserremark', {
            RemarkCompany: this.curInfo.RemarkCompany,
            RemarkName: this.curInfo.RemarkName,
            UserId: this.curInfo.UserId
        });
        if (res.code != 0) {
            message.warn('设置失败');
            return;
        }
        message.success("设置成功");
        this.showInfo = false;
        this.props.edit(this.curInfo.RemarkName, this.curInfo.RemarkCompany);
    }

    iptN = (e) => {
        if (!this.curInfo) {
            return
        }
        this.curInfo.RemarkName = e.target.value;
        this.setState({});
    }

    iptC = (e) => {
        if (!this.curInfo) {
            return
        }
        this.curInfo.RemarkCompany = e.target.value;
        this.setState({});
    }

    getHistory = () => {
        this.props.history();
    }

    // 判断用户类型
    userType = () => {
        const info = this.curInfo;
        if (info.IsAgent === '1') {
            return '城市代理商'
        }
        if (info.IsVip === '0') {
            return '普通用户'
        }
        return '会员用户'
    }

    // 性别
    sexy = () => {
        if (this.curInfo.Sex === '0') {
            return '男'
        }
        if (this.curInfo.Sex === '1') {
            return '女'
        }
        return '保密'
    }

    // 根据时间差显示时间
    showTime = (idx) => {
        const msgs = this.props.msgs;
        // console.log(msgs[idx])
        const ua = navigator.userAgent.toLowerCase();
        let isIos = false;
        if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
            isIos = true;
        }
        if (!msgs[idx - 1]) {
            if (msgs[idx] && msgs[idx].MsgCreateTime) {
                // console.log(msgs[idx]);
                if (isIos) {
                    return msgs[idx].MsgCreateTime.replace(/-/g, '/');
                } else {
                    return moment(msgs[idx].MsgCreateTime).format("YYYY-MM-DD HH:mm");
                }
                // return moment(new Date(msgs[idx].MsgCreateTime).getTime()).format("YYYY-MM-DD HH:mm");
            } else {
                if (isIos) {
                    return moment(new Date()).format("YYYY-MM-DD HH:mm").replace(/-/g, '/');
                } else {
                    return moment(new Date()).format("YYYY-MM-DD HH:mm");
                }
                
            }
        }
        // const t1 = moment((msgs[idx - 1].MsgCreateTime) * 1000);
        // const t2 = moment((msgs[idx].MsgCreateTime) * 1000);
        const t1 = new Date(msgs[idx -1].MsgCreateTime.replace(/-/g,'/')).getTime();
        const t2 = new Date(msgs[idx].MsgCreateTime.replace(/-/g,'/')).getTime();
        const du = moment.duration(t2 - t1).minutes();
        if (du >= 5) {
            if (isIos) {
                return msgs[idx].MsgCreateTime.replace(/-/g, '/');
            }
            return moment(msgs[idx].MsgCreateTime).format("YYYY-MM-DD HH:mm")
        }
        return ''
    }
    // 判断是否是我的消息
    checkMymsg = (m) => {
        if ((m && m.SenderId === User.getId()) || (m && m.mine)) {
            return true;
        }
        return false;
    }
    componentWillReceiveProps(props) {
        console.log(props);
    }
    componentDidUpdate = () => {
        if (this.props.id === '0') {
            this.wrap.scrollTop = this.wrap.scrollHeight;
        }
        
    }

    render() {
        const msgs = this.props.msgs;
        const arr = [];
        for(let i in msgs) {
            arr.push(i);
        }
        if (!this.info) {
            this.info = User.get();
        }
        let kefuhead_img = '';
        if (this.info && this.info.userinfo) {
            kefuhead_img = this.info.userinfo.HeadImageUrl;
        }
        // const c = room.plant;
        // console.log(msgs);
        // console.log(room);
        return (

            <div className="msgs-comp" ref={r => { this.wrap = r }}>
                {
                    msgs && !msgs.length ? (
                        <img src={nomsg} alt="暂无消息"
                            className="zanwuxiaoxi"
                        />
                    ) : ''
                }
                {
                    (msgs && this.props.curPage < Math.ceil(this.props.totalCount /10) ? (<p style={{ textAlign: 'center' }}>
                        <a href="javascript: void(0)" style={{ fontSize: '10px', backgroundColor: '#f2f2f2',padding: '2px 6px', borderRadius:'4px' }}
                            onClick={this.getHistory}
                        >查看历史消息</a>
                    </p>): '')
                }
                {
                    msgs && msgs.map((m, idx) => {
                        return m.MsgType == 'System' ? (
                            <p className="msgs_comp_tips" key={idx} style={{textAlign:'center',}}>
                                <span style={{ fontSize: '10px', backgroundColor: '#f2f2f2',padding: '2px 6px', borderRadius:'4px' }}>系统提示：易智造客服<span style={{color: '#5792F0'}}>{m.SenderInfo.NickName}</span> 为您服务</span>
                            </p>
                        ) : (
                                <div key={idx}>
                                    <div style={{ textAlign: 'center' }}><span className="time_show">{this.showTime(idx)}</span></div>
                                    <div className="msg_item" >
                                        <div>
                                            {
                                                (m && m.MsgType)  !== 'Order' ? (
                                                    <div>
                                                        {this.checkMymsg(m)? null:<p style={{margin: '0', paddingLeft: '45px'}}>{'客服  '}{m.SenderInfo?m.SenderInfo.NickName: ''}</p>}
                                                        <div className={this.checkMymsg(m) ? "my_msg" : "user_msg"}>
                                                        {/* src={c ? (m.mine ? kefuhead_img : this.src(m)) : this.src(m)} */}
                                                            <img src={this.checkMymsg(m) ? (this.info.HeadImageUrl !==''? this.info.HeadImageUrl: touxiang) : this.src(m)} alt="avatar" className="avatar"
                                                                />
                                                            {/* {(m.fromUser && m.vip) ? <img src={v} alt="vip" className="vip_c" /> : ''} */}
                                                            {/* <span className="name">
                                                                {
                                                                    m.fromUser ? ((room.remark || m.name) + ' ' + (room.remarkCompany || '')) : m.name
                                                                }
                                                            </span> */}
                                                            <div className="msg">
                                                                {
                                                                    this.rendMsg(m)
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                        <div style={{ margin: '0 auto', width: "95%", border: '1px solid #b7b7b7', borderRadius: '4px' }}>
                                                            {this.rendMsgOrder(m)}
                                                        </div>

                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                    })
                }
                {
                    this.curInfo ? (
                        <Modal visible={this.showInfo} className="user_info_modal"
                            width="400px"
                            cancelText="取消"
                            okText="确定"
                            onCancel={this.closeM}
                            onOk={this.edit}
                        >
                            <h5>用户资料</h5>
                            <div className="header_c">
                                <div className="img_c">
                                    <img src={this.src(this.curInfo)} alt="avatar" className="avatar" />
                                    {this.curInfo.IsVip == '0' ? '' : <img src={v} alt="vip" className="vip_c" />}
                                </div>
                                <div className="info_c">
                                    <p>{this.curInfo.NickName || '用户' + this.curInfo.MobileNumber.substring(this.curInfo.MobileNumber.length - 4)}</p>
                                    <p>订单数：{this.curInfo.TotalContractCount}</p>
                                    <p>订单金额：{this.curInfo.TotalContractAmount}</p>
                                </div>
                            </div>
                            <div className="main_c">
                                <div className="item_c">
                                    <p className="left_c">姓名</p>
                                    <p className="right_c">{this.curInfo.RealName}</p>
                                </div>
                                <div className="item_c">
                                    <p className="left_c">性别</p>
                                    <p className="right_c">{this.sexy()}</p>
                                </div>
                                <div className="item_c">
                                    <p className="left_c">备注姓名</p>
                                    <input className="right_c" maxLength="8" value={this.curInfo.RemarkName}
                                        onChange={this.iptN}
                                    />
                                </div>
                                <div className="item_c">
                                    <p className="left_c">公司名称</p>
                                    <input className="right_c" maxLength="10" value={this.curInfo.RemarkCompany}
                                        onChange={this.iptC}
                                    />
                                </div>
                                <div className="item_c">
                                    <p className="left_c">用户类型</p>
                                    <p className="right_c">{this.userType()}</p>
                                </div>
                                {/* {
                                    this.curInfo.IsVip == '0' ? '' : (
                                        <div className="item_c">
                                            <p className="left_c">会员有效期</p>
                                            <p className="right_c">{this.curInfo.ViPEndAt}</p>
                                        </div>
                                    )
                                } */}
                                <div className="item_c">
                                    <p className="left_c">注册时间</p>
                                    <p className="right_c">{this.curInfo.CreateTime}</p>
                                </div>
                                {/* {
                                    this.curInfo.IsVip != '0' ? '' : (
                                        
                                    )
                                } */}
                                <div className="item_c">
                                    <p className="left_c">注册手机号</p>
                                    <p className="right_c">{this.curInfo.MobileNumber}</p>
                                </div>
                            </div>
                        </Modal>
                    ) : ''
                }
            </div>
        )
    }

}
export default Msgs;