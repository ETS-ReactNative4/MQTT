import React, { Component } from 'react';
import './iptMsgs.css';
import biaoqing from '../../assets/mall/biaoqing.png';
import album from '../../assets/mall/xiangce.png';
import xiangji from '../../assets/mall/xiangji.png';
// import daili from '../../assets/daili.jpg';
import * as OSS from "ali-oss";
import * as uuidv1 from "uuid/v1";
// import { Loading } from '../loading-animation';
import { message, Modal, Button, Radio, Row, Col, Tabs, Checkbox, Input } from 'antd';
import Http from '../../service/Http';
import User from '../../service/User';
import post from '../../assets/mall/send.png';
import disabledPost from '../../assets/mall/send_disabled.png';

/* 参数：
    ck1：表情
    ck2：图片
    ck3：转接
    ck4：挂断 
    change：编辑
    send：发送消息
    user:聊天列表 */

const TabPane = Tabs.TabPane;

const RadioGroup = Radio.Group;

export let Txt = {
    set: null,
    help: false,
}

class IptMsg extends Component {

    emoj = "😂-😱-😭-😘-😳-😒-😏-😄-😔-😍-😉-😜-😁-😝-😰-😓-😚-😌-😊-💪-👊-👍-☝-👏-✌-👎-🙏-👌-👈-👉-👆-👇-👀-👃-👄-👂-🍚-🍝-🍜-🍙-🍧-🍣-🎂-🍞-🍔-🍳-🍟-🍺-🍻";
    emoji = [];
    file = null;
    camera = null;
    showClose = false;
    txt = null;
    CheckList = [];
    UserList = [];
    Clist = [];
    curC = null;
    isShow = '0';
    holidayClose = false;
    holidayList = [];

    constructor(p) {
        super(p);
        Txt.set = this.setMsg;
        this.state = { msg: '', help: false, Ipt: false };
        this.emoji = this.emoj.split('-');
    }

    setMsg = (m) => {
        this.setState({ msg: m });
    }

    change = (e) => {
        const v = e.target.value;
        this.props.change(v);
        this.setState({ msg: v });
    }

    send = (e) => {
        if (e.keyCode == "13") {
            this.props.send();
            this.setState({msg: ''})
            return false;
        }
    }

    cancel(e) {
        if (e.keyCode == "13") {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    close = () => {
        this.holidayClose = false;
        this.isShow = '0';
        this.showClose = false;
        this.setState({ help: false });
    }

    sendMessage = () => {
        this.props.send();
        this.setState({
            msg: ''
        });
    }
    // 退群
    // TuiJoin = async () => {
    //     const res = await Http.put(`app/chatgroup/join`, {
    //         UserId: JSON.parse(localStorage.getItem('info')).UserId,
    //         EmakeUserId: this.props.now.uid,
    //     });
    //     if (res.code !== 0) {
    //         message.warn(res.info);
    //         return;
    //     }
    //     this.showClose = true;
    // }
    openC = () => {
        const infos = User.get();
        // this.CheckUser(this.props.now.uid).then(res => {
        //     if (res.code != 0) {
        //         message.warn(res.info);
        //         return;
        //     } else {
        //         if (res.data.CustomerA === infos.UserId || res.data.CustomerB === infos.UserId) {
        //             message.warn('专属客服或代理客服不可离开聊天室！');
        //         } else {
        //             if (this.checkOnline()) {
        //                 console.log(this.props.name);
        //                 if (!this.props.name) {
        //                     return
        //                 }
        //                 if (this.props.name && this.props.name === '易智造平台客服') {
        //                     return
        //                 }
        //                 this.TuiJoin();
        //             } else {
        //                 message.warn('客服离线中,请先切换在线状态！');
        //             }
        //         }
        //     }
        // });
        this.setState({});
    }
    confirm = () => {
        this.props.ck4();
        this.close();
    }

    // 选中文件
    upload = async () => {
        const bucket = 'img-emake-cn';
        const region = 'oss-cn-shanghai';
        const accessKeyId = 'LTAIjK54yB5rocuv';
        const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';
        const client = new OSS({
            region,
            accessKeyId,
            accessKeySecret,
            bucket,
        });
        const file = this.file && this.file.files && this.file.files[0];
        let fileName = "";
        let fileSize = 0;
        if (!file) {
            return
        }
        if (file) {
            fileName = file.name;
            fileSize = file.size;
            if (this.props.size && fileSize > (this.props.size * 1024)) {
                message.warn("图片大小超出范围！");
                this.file.value = '';
                return;
            }
        }
        // Loading();
        const result = await client.put(uuidv1(), file);
        if (result.res.status === 200 && result.res.statusCode === 200) {
            // alert(result.url);
            this.props.ck2(result.url, fileName, fileSize);
        } else {
            this.file.value = '';
            message.error(`上传失败`);
        }
        // Loading();
        this.file.value = '';
        this.setState({});
    }
    // 拍照上传
    uploadFile = async(e) => {
        alert('camera');
        alert(e.target.value);
        const bucket = 'img-emake-cn';
        const region = 'oss-cn-shanghai';
        const accessKeyId = 'LTAIjK54yB5rocuv';
        const accessKeySecret = 'T0odXNBRpw2tvTffxcNDdfcHlT9lzD';
        const client = new OSS({
            region,
            accessKeyId,
            accessKeySecret,
            bucket,
        });
        const file = this.camera && this.camera.files && this.camera.files[0];
        let fileName = "";
        let fileSize = 0;
        if (!file) {
            return
        }
        if (file) {
            fileName = file.name;
            fileSize = file.size;
            if (this.props.size && fileSize > (this.props.size * 1024)) {
                message.warn("图片大小超出范围！");
                this.camera.value = '';
                return;
            }
        }
        // Loading();
        const result = await client.put(uuidv1(), file);
        if (result.res.status === 200 && result.res.statusCode === 200) {
            this.props.ck2(result.url, fileName, fileSize);
        } else {
            this.file.value = '';
            message.error(`上传失败`);
        }
        // Loading();
        this.camera.value = '';
        this.setState({});
    }

    openfile = () => {
        const file = document.getElementById('file');
        file.click();
    }
    openCamera = () => {
        const camera = document.getElementById('camera');
        camera.click();
        // alert('openCamera');
    }

    showEmoji = false;
    showEm = () => {
        message.error('3333')
        this.showEmoji = true;
        this.setState({});
    }

    hide = (e) => {
        this.showEmoji = false;
        this.setState({Ipt: !this.state.Ipt});
        // const H = window.innerHeight;
        // alert(H);
        // window.addEventListener('resize', () => {
        //     if(window.innerHeight < H){
        //        // 隐藏按钮
        //        this.setState({
        //            showBtn: false
        //        })
        //     }else{
        //         // 显示按钮
        //         this.setState({
        //             showBtn: true
        //         })
        //     }
        // });
    }

    choose = (e) => () => {
        const str = this.state.msg + e;
        this.props.change(str);
        this.showEmoji = false;
        this.setState({ msg: str }, () => {
            if (this.txt) {
                this.txt.focus();
            }
        });
    }
    // 判断在线
    // checkOnline = () => {
    //     const info = JSON.parse(localStorage.getItem('info'));
    //     let success = false;
    //     if (info && info.UserInfo && info.UserInfo.OnLine === '1') {
    //         success = true;
    //     } else {
    //         success = false;
    //     }
    //     return success;
    // }
    getHelp = () => {
        this.props.chChange();
    }

    // 检查客服专属性
    // CheckUser = async (id) => {
    //     const res = await Http.get(`user/info?UserId=` + id);
    //     return res;
    // }
    sendHelp = () => {
        if (this.CheckList.length) {
            this.isShow = '0';
            this.props.ck3(this.CheckList);
            this.setState({ help: false });
        } else {
            message.warn('协作/咨询对象为空！');
        }
        this.setState({});
    }
    componentDidUpdate() {
        // console.log(this.props.ch);
        // if (this.props.ch) {
        //     if (this.isShow === '0') {
        //         this.CheckUser(this.props.now.uid).then(res => {
        //             if (res.code != 0) {
        //                 message.warn(res.info);
        //                 return;
        //             } else {
        //                 this.CheckList = [];
        //                 this.isShow = '0';
        //                 if (this.props.user.length && this.props.now && this.props.now.id) {
        //                     if (this.checkOnline()) {
        //                         this.GetCategroy().then(r => {
        //                             if (r && r.CategoryId) {
        //                                 this.GetUserList(this.isShow, r.CategoryId, this.props.userList);
        //                             }
        //                         });
        //                         this.props.HelpClose();
        //                         this.setState({ help: true });
        //                     } else {
        //                         message.warn('客服离线中,请先切换在线状态！');
        //                     }
        //                 } else {
        //                     message.warn('请先选定所需协助的聊天室！');
        //                 }
        //             }
        //         });
        //     }
        // }
    }
    // ChangeTips = (e) => {
    //     this.CheckList = [];
    //     this.isShow = e.target.value;
    //     this.GetUserList(e.target.value, this.curC.CategoryId, this.props.userList);
    //     this.setState({});
    // }
    // GetCategroy = async () => {
    //     const res = await Http.get(`web/category_b`);
    //     if (res.code != 0) {
    //         message.warn(res.info);
    //         return;
    //     }
    //     this.Clist = res.data.filter(ds => ds.OnSale === '1');
    //     this.curC = this.Clist.length ? this.Clist[0] : null;
    //     this.isShow = '0';
    //     return this.curC;
    // }
    // ChangeCate = (e) => {
    //     this.CheckList = [];
    //     this.curC = this.Clist.filter(c => c.CategoryId === e)[0];
    //     this.GetUserList(this.isShow, this.curC.CategoryId, this.props.userList);
    //     this.setState({});
    // }
    // GetUserList = (n, id, cidList) => {
    //     this.GetUserInfo().then(des => {
    //         if (des.code != 0) {
    //             message.warn(des.info);
    //             return;
    //         }
    //         this.GetUserLists(n, id, des, cidList);
    //     });
    // }
    // GetUserLists = async (n, id, des, cidList) => {
    //     const info = JSON.parse(localStorage.getItem('info'));
    //     let url = '';
    //     switch (n) {
    //         // 客服
    //         case '0': url = 'console/pcsmanage?pageIndex=1&pageSize=10000&UserState=0&OnLine=1'; break;
    //         case '1': url = `console/getstoreuser?pageIndex=1&pageSize=10000&CategoryBId=${id}&IsACS=1&OnLine=1`; break;
    //         case '2': url = `console/agentuser?pageIndex=1&pageSize=10000&AgentState=1&OnLine=1`; break;
    //     }
    //     const res = await Http.get(url);
    //     if (res.code != 0) {
    //         message.warn(res.info);
    //         return;
    //     }
    //     if (n === '2' && des.data.AgentCity) {
    //         this.UserList = res.data.ResultList.filter(us => us.UserId !== info.UserId && us.City === des.data.AgentCity);
    //     } else {
    //         this.UserList = res.data.ResultList.filter(us => us.UserId !== info.UserId);
    //     }
    //     if (cidList.length) {
    //         cidList.forEach(ci => {
    //             this.UserList.forEach((us, idx) => {
    //                 if (ci.ServiceID === us.ServiceID) {
    //                     this.UserList.splice(idx, 1);
    //                 }
    //             });
    //         });
    //     }
    //     this.setState({});
    // }
    // GetUserInfo = async () => {
    //     const des = await Http.get('user/info?UserId=' + this.props.now.uid);
    //     return des;
    // }
    UserChangeTips = (e) => {
        this.CheckList = e;
        this.setState({});
    }
    CtiyChangeTips = (e) => {
        this.CheckList = [e.target.value];
        this.setState({});
    }
    componentDidMount = () => {
    }
    keyPress = (e) => {
        console.log(e);
        alert(e.keyCode);
        const keycode = e.keyCode;
        if (keycode == '13') {
            alert('13')
            // this.setState({msg:''})
        }
    }
    render() {
        return (
            <div className="chatIpt-comp">
                {/* <div className="emoji" style={{ display: this.showEmoji ? 'block' : 'none' }}>
                    {
                        this.emoji.map((e, i) => <span key={i} onClick={this.choose(e)}>{e}</span>)
                    }
                </div> */}
                <form action="">
                    <Input ref={r => { this.txt = r }}
                    value={this.state.msg}
                    onChange={this.change}
                    onKeyUp={this.send}
                    onKeyDown={this.cancel}
                    onClick={this.hide}/>
                </form>
                <div className="chat-options" style={{width: '100%'}}>
                    {/* <img src={biaoqing} alt="🌤"
                        style={{ marginLeft: '8px' }}
                        title="表情"
                        onClick={this.showEm}
                    /> */}
                    <Row>
                        <Col span={12} style={{textAlign: 'center'}}>
                            <div className="file_c">
                                <img src={album} alt="🌤"
                                    title="图片"
                                    onClick={this.openfile}
                                />
                                <input id="file" type="file" ref={r =>this.file = r }  accept="image/*"
                                    onChange={this.upload}
                                />
                            </div>
                        </Col>
                        {/* <Col span={8} style={{textAlign: 'center'}}>
                            <div className="file_c">
                                <img src={xiangji} alt="🌤"
                                    title="拍照"
                                    onClick={this.openCamera}
                                />
                                <input id="camera" type="file" ref={r =>this.camera = r }  accept="image/*" capture="camera"
                                    onChange={this.uploadFile}
                                />
                            </div>
                        </Col> */}
                        <Col span={12} style={{textAlign: 'center'}}>
                            <div className="file_c">
                                <img src={this.state.msg.trim() === ''? disabledPost:post} alt="🌤"
                                    title="发送"
                                    onClick={this.sendMessage} 
                                />
                            </div>
                            {/* <Buttondisabled={this.state.msg.trim() === ''}>发送</Button> */}
                        </Col>
                    </Row>
                    
                    
                    {/* <img src={zhuanyi} alt="🌤"
                        title="协作"
                        // onClick={this.props.ck3}
                        onClick={this.getHelp}
                    />
                    <img src={guanbi} alt="🌤"
                        title="挂断"
                        onClick={this.openC}
                    /> */}
                </div>
                
                
                {/* <textarea className="mainipt" rows="18"
                    ref={r => { this.txt = r }}
                    value={this.state.msg}
                    onChange={this.change}
                    onKeyUp={this.send}
                    onKeyDown={this.cancel}
                    onClick={this.hide}
                /> */}
                
                <Modal visible={this.showClose}
                    className="ipt_msg_modal"
                    onCancel={this.close}
                    onOk={this.confirm}
                    okText="确定"
                    cancelText="取消"
                >
                    确认结束与{this.props.name}的对话?
                </Modal>
                <Modal
                    visible={this.state.help}
                    onCancel={this.close}
                    onOk={this.sendHelp}
                    okText="确定"
                    cancelText="取消"
                    title={'协作/咨询'}
                >
                    <div style={{ width: '80%', margin: '0 auto' }}>
                        <Row>
                            <Col span={5} />
                            <Col span={15} >
                                <Radio.Group onChange={this.ChangeTips} value={this.isShow} defaultValue={this.isShow} buttonStyle="solid">
                                    <Radio.Button value="0">客服</Radio.Button>
                                    <Radio.Button value="1">省域公司</Radio.Button>
                                    <Radio.Button value="2">城市经理</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col span={4} />
                        </Row>
                        {
                            this.isShow === '1' ? (
                                <Tabs defaultActiveKey={this.curC.CategoryId || null} onChange={this.ChangeCate}>
                                    {
                                        this.Clist.map(cs => (
                                            <TabPane tab={cs.CategoryName} key={cs.CategoryId} />
                                        ))
                                    }
                                </Tabs>
                            ) : null
                        }
                        <div style={{ width: '80%', height: '235px', overflowY: 'auto', margin: '20px auto' }}>
                            {
                                this.isShow !== '2' ? (
                                    // 
                                    <Checkbox.Group value={this.CheckList} style={{ width: '100%' }} onChange={this.UserChangeTips} >
                                        {
                                            this.UserList.map(us => (
                                                <Row key={us.UserId}>
                                                    <Col span={24} ><Checkbox value={us}>{this.isShow === '0' ? us.NickName : us.RealName + '-' + us.RoleName + '-' + us.MobileNumber}</Checkbox></Col>
                                                </Row>
                                            ))
                                        }
                                    </Checkbox.Group>
                                ) : (
                                        //  value={this.state.value}
                                        <RadioGroup onChange={this.CtiyChangeTips}>
                                            {
                                                this.UserList.map(us => (
                                                    <Radio className={'radioStyle'} key={us.UserId} value={us}>{us.RealName + '-' + us.City + '-' + us.MobileNumber}</Radio>
                                                ))
                                            }


                                        </RadioGroup>
                                    )
                            }
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

}
export default IptMsg;