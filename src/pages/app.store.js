import { connect } from 'mqtt';
import * as uuidv1 from "uuid/v1";
import { message } from 'antd';
import { Loading } from '../components/loading-animation';
import plantAvatar from '../assets/mall/v.png';
import { sortById, sortByField } from '../service/Utils';
import Http from '../service/Http';
import Url from '../service/Url';
import User from '../service/User';
import { db } from './db.js';

// const BrowserWindow = window.electron.remote.BrowserWindow;
// const wins = BrowserWindow.getAllWindows();
// export const loginWin = wins[0];
// export const mainWin = wins[1];
let Txt = {
    set: null,
    help: false,
}

const roomInit = {                // 当前聊天室
    waitting: false,
    desc: '',
    time: '',
    top: false,
    uid: '',
    lastID: '',
    vip: false,
    name: '',
    remark: '',
    remarkCompany: '',
    tel: '',
    avatar: '',
    id: 'chatroom/' + User.getId(),
    msgs: [],
    isAgent: '',
    isFirst: '',
    client_name: '',
    CustomerB: '',
    close: false,
    waitRead: false,
    num: 0,
    FromCoustomer: '',
    CustomerA: '',
}

class AppStore {
    info = User.get() || { UserId: '' };
    client = null;
    comp = null;
    curUserPanel = 0;   // 0：正在聊天；1：未成交会员；2：已成交用户
    curToolPanel = 0;   // 0：商品推荐；1：买家订单；2：快捷回复
    linked = false;
    rooms = new Map();         // 聊天室map；以聊天室ID为索引
    curRoom = roomInit;
    curMsg = "";        // 当前消息编辑框内的内容
    customers = [];     // 在线客服列表
    curCus = '';
    curMaxID = 0;
    showPlant = false;  // 是否展示平台客服
    plantCus = null;
    ListShow = false;
    UserListNow = [];
    RoomUserList = [];
    showUserListViaable = false;
    curCheckRomm = null;
    remarkUserList = [];
    isOnLine = false;
    checkUserListGet = [];
    GetCustomerHelp = false;
    Msgs = [];



    //--------极光推送开始----------//

    //--------极光推送结束----------//
    GetCustomerHelpclose = () => {
        this.GetCustomerHelp = false;
        this.fresh();
    }
    GetCustomerHelps = () => {
        this.GetCustomerHelp = true;
        // this.ShowComAll();
    }
    // 更新用户信息
    updateUserInfo = async () => {
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.get(Url.baseUrl + '/user/info');
        if (code !== Http.ok) {
            return message.error(info);
        }
        User.put(data);
        this.info = Object.assign(this.info, data);
        this.fresh();
        // message.success('更新用户信息成功！');

    }
    // 连接到聊天服务器
    connet = async() => {
        this.curRoom.msgs = [];
        this.curRoom.maxID = 0;
        // console.log(this.info)
        if (this.info.UserId == undefined || this.info.UserId == '' || this.info.UserId == null) {
            await this.updateUserInfo();
        }
        this.client = connect({
            clientId: `user/${this.info.UserId}`,
            port: 8883,
            host: Url.mqttUrl,
            protocol: 'ws',
            clean: false,
            keepalive: 60,
        });
        // console.log(this.client)
        this.client.on('error', () => {
            message.warn('无法连接服务器, 请检查网络');
        })
        this.client.on('connect', res => {
            // message.success('MQTT连接成功,' + this.info.UserId);
            this.client.subscribe(`chatroom/${this.info.UserId}`, {qos: 2}, (err) => {
                if (err) {
                    message.warn('网络错误');
                }
            });
            this.client.subscribe(`user/${this.info.UserId}`, { qos: 2 }, (err) => {
                if (!err) {
                    this.curRoom.uid = this.info.UserId;
                    this.getMaxID();
                } else {
                    message.warn('网络错误');
                }
            });
        });
        this.client.on('message', (topic, msg, _) => {
            const msgs = JSON.parse(msg);
            // message.info(msgs.cmd +':'+ msgs.chatroom_id);
            // console.log(msgs)
            // message.info(msg);
            if (msgs.cmd && msgs.chatroom_id.split('/')[0] !== 'advice') {
                Loading();
                this.getMsg(topic, JSON.parse(msg));
            } else if (!msgs.cmd) {
                Loading();
                this.getMsg(topic, JSON.parse(msg));
            }
        });
        this.fresh();
    }

    // 请求聊天室最大消息ID（应答时）
    getMaxID = (room) => {
        const cid = this.info.UserId;
        const data = {
            cmd: 'MessageList',
            user_id: cid,
            customer_id: '',
            chatroom_id: cid,
            message_id_last: 0,
            user_info: ''
        }
        this.send(data, (err) => {
            if (err) {
                message.warn('请求聊天室消息失败');
                return;
            }
        });
    }
    // 根据消息最大ID接收待应答消息记录
    records = (msg) => {
        const id = msg.chatroom_id;
        if (msg.message_id_last === 0) {
            return;
        }
        // this.curRoom.lastID = msg.message_id_last;
        const cur = this.rooms.get(id);
        this.getHisMsg(cur, msg.message_id_last);
        this.fresh();
    }
    // 查看历史消息
    historyMsg = (maxID) => {
        if (maxID === 0) {
            this.getMaxID(this.curRoom);
            return;
        }
        this.getHisMsg(this.curRoom, maxID);
        this.fresh();
    }
    // 递归追溯历史消息
    getM = (cur, mid) => {
        if (!cur) {
            return;
        }
        this.getHisMsg(cur, mid);
        if (this.curMaxID < (mid - 10)) {
            this.getM(cur, mid - 10);
        }
    }
    // 根据最大消息ID更新消息
    getHisMsg = (room, maxID) => {
        const cid = this.info.UserId;
        const data = {
            cmd: 'MessageList',
            user_id: cid,
            customer_id: '',
            chatroom_id: cid,
            message_id_last: maxID,
            user_info: ''
        }
        this.send(data, (err) => {
            if (err) {
                message.warn('请求聊天室消息失败');
                return;
            }
            // db.update(room);
            this.fresh();
        });
        this.fresh();
    }
    // 接收消息
    getMsg = (topic, msg) => {
        if (msg.cmd === 'Push') {
            return;
        }
        // 请求应答
        if (msg.cmd === "UserRequestService" || msg.cmd === "RequestSwitchService") {
            this.cue();
            this.waitMsg(msg, msg.cmd);
        }
        if (!msg.cmd) {
            this.cue();
            this.recMsg(this.info.UserId, msg);
        }
        if (msg.cmd === 'UserMessageList') {
            // this.curRoom.lastID = 0;
            // console.log('msg.cmd', msg.cmd);
            this.records(msg);
        }
        if (msg.cmd === 'CustomerAcceptService') {
            // if (this.curRoom && this.curRoom.id && msg.topic === this.curRoom.id) {
            //     if (msg.customer_id && msg.customer_id.splice(0, 4) !== 'user/') {
            //         this.cue();
            //     }
            //     this.plantRec(msg);
            // }
        }
        if (msg.cmd === 'ChatroomCustomerList') {
            this.recNum(msg);
        }
        this.fresh();
    }

    // 接收平台客服数
    recNum = async (msg) => {
        console.log(msg);
        if (msg.customer_ids && msg.customer_ids.length == 0) {
            const obj = this.Msg('请求客服接入', "Text")
            const len = this.curRoom.msgs.length;
            const data = {
                tip: true,
                mine: false,
                fromUser: false,
                msgID: len ? (this.curRoom.msgs[len - 1].msgID + 1) : 0,
                msgType: obj.MessageType,
                time: obj.Timestamp,
                body: obj.MessageBody,
                avatar: obj.From.Avatar,
                readed: true,
                id: obj.MessageId,
                name: obj.From.DisplayName,
                tel: this.info.UserId,
                uid: obj.From.UserId,          // 消息归属者ID
                vip: false,
                ing: true
            };
            this.client.publish('chatroom/' + this.info.UserId, JSON.stringify(data), { qos: 2 }, (err) => {
                // console.log(err)
                if (err) {
                    message.warn("发送消息失败，请检查网络连接！");
                    return;
                }
            });
        }
        this.fresh();
    }



    // 消息描述
    desc = (body) => {
        if (!body) {
            return '';
        }
        if (body.Type === 'Goods') {
            return '[商品推荐]'
        }
        if (body.Type === 'Image') {
            return '[图片]'
        }
        if (body.Type === 'SuperGroup') {
            return '[超级团推荐]'
        }
        if (body.Type === 'Order') {
            return '[订单确认]'
        }
        if (body.Type === 'Voice') {
            return '[语音]'
        }
        if (body.Type === 'File') {
            return '[文件]'
        }
        return body.Text
    }
    // 向用户发起聊天
    startChat = (user) => {
        if (this.checkOnline()) {
            const id = 'chatroom/' + user.UserId;
            let r = this.rooms.get(id);
            const t = this.SetTimeShow();
            this.GetUserInfoShows(user.UserId).then(res => {
                if (!r) {
                    r = {
                        waitting: false,
                        close: false,
                        remark: res.RemarkName,
                        remarkCompany: res.RemarkCompany,
                        top: false,
                        time: t,
                        tel: res.MobileNumber,
                        uid: res.UserId,                       // 聊天室内用户（非客服）的ID
                        id: id,
                        vip: res.IsVip,
                        lastID: 0,
                        name: res.NickName || res.RealName || ('用户' + res.MobileNumber.substring(res.MobileNumber.length - 4)),
                        avatar: res.HeadImageUrl,
                        msgs: [],
                        isAgent: res.CustomerB === JSON.parse(localStorage.getItem('info')).UserId ? '1' : '0',
                        CustomerB: res.CustomerB,
                        isFirst: '0',
                        client_name: res.client_name === '电圈子' ? '1' : '0',
                        waitRead: true,
                        num: 0,
                        FromCoustomer: '',
                        CustomerA: res.CustomerA,
                    }
                    let num = null;
                    this.UserListNow.forEach((us, idx) => {
                        if (us.uid === r.uid) {
                            num = idx;
                        }
                    });
                    if (!num) {
                        this.UserListNow.splice(0, 0, r);
                    }
                } else {
                    r.isFirst = '0';
                    r.FromCoustomer = '';
                    r.num = 0;
                    r.waitRead = true;
                    this.update(r);
                    this.UserListNow = this.GetToget();
                }
                this.rooms.set(id, r);
                this.curRoom = r;
                this.curUserPanel = 0;
                // this.JoinChat(r.uid).then(rs => {
                // this.InitUserList();
                this.client.subscribe(id, { qos: 2 }, (err) => {
                    if (err) {
                        message.warn('聊天室订阅失败');
                    }
                    this.JoinChat(r.uid);
                    this.fresh();
                    this.getMaxID(r);
                });
            });
            this.fresh();
            // });
        } else {
            message.warn('客服离线中,请先切换在线状态！');
        }
    }



    // 接收已应答的消息
    recMsg = (topic, msg) => {
        // console.log(topic, this.curRoom.id);
        // if (topic == this.curRoom.id) {      // 平台客服的消息
        //     console.log(1111111);
        //     // this.plantMsg(topic, msg);
        //     return;
        // }
        // console.log(2);
        // const id = topic;                    // 标记聊天室的ID
        // if (!id) {
        //     return
        // }
        let r = this.curRoom;
        const info = msg.From;
        r.lastID = msg.MessageID;
        r.msgs.push({
            mine: (info && info.UserId || '') === (this.info && this.info.UserId) ? true : false,        // 是不是本人发出的消息
            fromUser: (info && info.UserId || '') === (this.info && this.info.UserId) ? true : false, // 是否是来自于用户
            msgID: msg.MessageID,
            id: msg.MessageId,
            msgType: msg.MessageType,
            time: msg.Timestamp,
            body: msg.MessageBody,
            avatar: info && info.Avatar,
            readed: this.curRoom.id === topic || true,
            name: info && info.DisplayName,
            tel: info && info.PhoneNumber || this.info.UserId,
            uid: info && info.UserId,                               // 消息归属者ID
            vip: this.info.IsVip,
            ing: false
        });
        r.desc = this.desc(msg.MessageBody);
        r.time = msg.Timestamp ? msg.Timestamp : '';
        r.FromCoustomer = '';
        this.update(r);
        r.msgs = r.msgs.sort(sortById('msgID'));
        r.msgs = [...new Set(r.msgs)];
        this.fresh();
        // this.GetUserInfoShows(topic.split('/')[1]).then(res => {
        //     const fid = msg.From.UserId;
        //     const uid = res.UserId;           // 聊天室内用户（非客服）的ID
        //     const mid = this.info.UserInfo.UserId;
        //     const sid = this.info.UserInfo.ServiceID;
        //     const check = fid === mid || fid === sid;              // 判断消息是不是自己的
        //     let fromUser = false;
        //     if (msg.From.ClientID.split("/")[0] === 'user') {
        //         fromUser = true;
        //     }
        //     let r = this.rooms.get(topic);
        //     const info = msg.From;
        //     const t = this.SetTimeShow(new Date(parseInt(msg.Timestamp) * 1000));
        //     if (!r) {
        //         const data = {
        //             waitting: false,
        //             close: false,           // 是不是已关闭的聊天室，如果是不出现在正在聊天列表
        //             time: t,
        //             tel: res.MobileNumber,
        //             top: false,
        //             uid: uid,                       // 聊天室内用户（非客服）的ID
        //             id: id,
        //             vip: res.IsVip,
        //             lastID: '',
        //             name: res.NickName || res.RealName || '用户' + res.MobileNumber.substring(res.MobileNumber.length - 4),
        //             avatar: res.HeadImageUrl,
        //             remark: res.RemarkName,
        //             remarkCompany: res.RemarkCompany,
        //             msgs: [],
        //             isAgent: res.CustomerB === JSON.parse(localStorage.getItem('info')).UserId ? '1' : '0',
        //             CustomerB: res.CustomerB,
        //             CustomerA: res.CustomerA,
        //             isFirst: '0',
        //             client_name: res.client_name === '电圈子' ? '1' : '0',
        //             waitRead: true,
        //             num: 1,
        //             FromCoustomer: '',
        //         }
        //         r = data;
        //     } else {
        //         r.num = r.num + 1;
        //     }
        //     // 双端同步
        //     if (r.waitting) {
        //         r.waitting = false;
        //         this.getMaxID(r);
        //     }
        //     r.close = false;
        //     r.lastID = msg.MessageID;
        //     r.msgs.push({
        //         mine: check,        // 是不是本人发出的消息
        //         fromUser: fromUser, // 是否是来自于用户
        //         msgID: msg.MessageID,
        //         id: msg.MessageId,
        //         msgType: msg.MessageType,
        //         time: msg.Timestamp,
        //         body: msg.MessageBody,
        //         avatar: msg.From.Avatar,
        //         readed: this.curRoom.id === topic || check,
        //         name: msg.From.DisplayName,
        //         tel: msg.From.PhoneNumber || this.info.UserInfo.ServiceID,
        //         uid: fid,                               // 消息归属者ID
        //         vip: info.UserType && info.UserType !== '0',
        //         ing: false
        //     });
        //     r.waitRead = true;
        //     r.desc = this.desc(msg.MessageBody);
        //     r.time = msg.Timestamp ? msg.Timestamp : '';
        //     r.FromCoustomer = '';
        //     this.update(r);
        //     let num = null;
        //     this.UserListNow.forEach((us, idx) => {
        //         if (us.id === r.id) {
        //             us.desc = r.desc;
        //             us.time = r.time;
        //             num = idx;
        //         }
        //     });
        //     if (num !== null) {
        //         this.UserListNow.splice(num, 1);
        //     }
        //     const waitUserNum = this.UserListNow.filter(us => us.waitting).length; // 待应答数目
        //     const topUserNum = this.UserListNow.filter(us => us.top).length; // 置顶数目
        //     const nowUserNum = this.curRoom && this.curRoom.id &&
        //         !(topUserNum && this.UserListNow.filter(us => us.top)[0].uid === this.curRoom.uid) ? 1 : 0; // 当前数目
        //     if (!waitUserNum) {
        //         switch (topUserNum + nowUserNum) {
        //             case 0: this.UserListNow.splice(0, 0, r); break;
        //             case 1: this.UserListNow.splice(1, 0, r); break;
        //             case 2: this.UserListNow.splice(2, 0, r); break;
        //         }
        //     } else {
        //         const waitUserNums = this.UserListNow.filter(us => us.waitting).length; // 待应答数目
        //         const topUserNums = this.UserListNow.filter(us => us.top).length; // 置顶数目
        //         const nowUserNums = this.curRoom && this.curRoom.id
        //             && !(topUserNums && this.UserListNow.filter(us => us.top)[0].uid === this.curRoom.uid) ? 1 : 0; // 当前数目
        //         switch (waitUserNums + topUserNums + nowUserNums) {
        //             case 1: this.UserListNow.splice(waitUserNums, 0, r); break;
        //             case 2: this.UserListNow.splice(waitUserNums + 1, 0, r); break;
        //             default: this.UserListNow.splice(waitUserNums + 2, 0, r); break;
        //         }
        //     }
        //     if (r.id === this.curRoom.id) {
        //         this.curRoom = roomInit;
        //     }
        //     this.rooms.set(id, r);
        //     // this.UserListNow = this.GetToget();
        //     this.fresh();
        // });
    }



    // 更新数据
    update = (data) => {
        // db.update(data);
    }

    // this.UserListNow.splice(0, 1, this.curRoom);
    // 打开聊天面板
    chat = (room) => {
        if (this.checkOnline()) {
            if (room.waitting || room.id === this.curRoom.id) {
                return
            }
            this.JoinChat(room.uid);
            room.waitRead = false;
            room.num = 0;
            this.curRoom = room;
            this.curMsg = '';
            if (Txt.set) {
                Txt.set('');
            }
            if (room.isFirst === '1') {
                this.client.subscribe(room.id, { qos: 2 }, (err) => {
                    if (err) {
                        message.warn("无法获取聊天室消息");
                        return;
                    }
                    this.getMaxID(room);
                    room.isFirst = '0';
                    room.FromCoustomer = '';
                    db.update(room);
                    this.UserListNow = this.GetToget();
                });
            } else {
                this.getMaxID(room);
                room.FromCoustomer = '';
                db.update(room);
                this.UserListNow = this.GetToget();
            }
            this.fresh();
        } else {
            message.warn('客服离线中,请先切换在线状态！');
        }

    }










    // 发送指令
    send = (data, fn) => {
        // console.log(data);
        this.client.publish(`user/${this.info.UserId}`, JSON.stringify(data), { qos: 2 }, fn);
    }
    // 请求应答
    sendRequest = async (msgContent) => {
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.post(Url.baseUrl+ '/app/gyb/customer/jmsg', msgContent);
        if (code !== Http.ok) {
            return message.error(info);
        }
        console.log(data);
    }

    showUserListViaableChange = () => {
        this.showUserListViaable = true;
    }

    GetGoodSerList = async () => {
        // const res = await Http.get(`user/audit?UserIdentity=0&SearchContent=${r.tel}&SearchType=1`)
        // if (res.code != 0) {
        //     message.warn('未获取到用户信息');
        //     return;
        // }
    }
    // YY-MM-DD HH:SS
    SetTimeShow = (e) => {
        let date;
        if (e) {
            date = new Date(e);
        } else {
            date = new Date();
        }
        const str = date.getTime() / 1000;
        // const str = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
        return Math.ceil(str);
    }

    // 刷新组件
    fresh = () => {
        if (this.comp) {
            this.comp.setState({});
        }
    }













    // 提取最后一条消息
    lastMsg = (room) => {
        const len = room.msgs.length;
        if (!len) {
            return
        }
        const msg = room.msgs[len - 1];
        room.desc = this.desc(msg.body);
        room.time = msg.time;
        this.rooms.set('chatroom/' + this.info.UserId, room);
        console.log(room);
        // db.add(room);
        this.fresh();
    }

    // 消息列表内添加消息
    addMsg = (room, m) => {
        console.log(room, m);
        const arr = room.msgs;
        // let check = false;
        // arr.forEach(it => {
        //     if (it.id === m.id) {
        //         it.ing = false;
        //         check = true;
        //     }
        // });
        // if (check) {
        //     this.lastMsg(room);
        //     return
        // }
        // if (!arr.length) {
        //     room.msgs.push(m);
        //     this.lastMsg(room);
        //     return;
        // }
        if (arr.length) {
            const maxID = arr[arr.length - 1].msgID;
            if (m.msgID > maxID) {
                room.msgs.push(m);
                this.lastMsg(room);
                return;
            }
            if (m.msgID < arr[0].msgID) {
                arr.unshift(m);
                this.lastMsg(room);
                return;
            }
            arr.push(m);
            room.msgs = arr.sort(sortById('msgID'));
            this.lastMsg(room);
            this.fresh();
        }
    }





    // 编辑消息
    editMsg = (v) => {
        this.curMsg = v;
    }

    // 消息体
    Msg = (content, type) => {
        let img = '';
        return {
            "From": {
                "Avatar": img,
                "DisplayName": this.info.NickName,
                "UserId": this.info.UserId,
                "ClientID": "user/" + this.info.UserId,
                // "Group": JSON.stringify({
                //     GroupName: this.info.StoreName,
                //     GroupPhoto: this.info.StorePhoto,
                //     // CategoryId: this.info.CategoryBId.slice(0, 3)
                // }),
                "Group": '{}',
                // "Group": {},
            },
            "MessageBody": {
                "Text": content,
                "Type": type,
                "VoiceDuration": 0,
            },
            "MessageId": uuidv1(),
            "MessageType": "Message",
            "ToId": this.info.UserId,
        }
    }
    // 推送
    SendPush = async (m) => {
        // console.log(this.curRoom);
        const res = await Http.post(`app/customer/jmsg`, {
            MsgContent: m,
            MsgType: 'Text ',
            ChatType: '0'
        });
        if (res.code !== 0) {
            message.warn('推送消息失败！');
            return;
        }
        console.log('发送推送消息成功:' + JSON.stringify({
            UserId: this.info.UserId,
            Content: m,
        }));
        return res;
    }
    // 当前聊天室是否有客服
    checkIsCustomOnline = (msgID) => {
        const cid = this.info.UserId;
        const data = {
            cmd: 'ChatroomCustomerList',
            user_id: cid,
            customer_id: '',
            chatroom_id: cid,
            message_id_last: msgID,
            user_info: ''
        }
        this.send(data, (err) => {
            if (err) {
                message.warn('请求客服失败');
                return;
            }
        });
    }
    // 发送消息
    sendMsg = () => {
        // message.info('sendMsg');
        // alert('sendMsg');
        // if (!this.curRoom.id) {
        //     return;
        // }
        if (this.curMsg) {
            // this.SendPush(this.curMsg).then(rdx => {
            const obj = this.Msg(this.curMsg, "Text")
            const len = this.curRoom.msgs.length;
            const data = {
                mine: true,         // 是不是本人发出的消息
                fromUser: true,    // 是否是来自于用户
                msgID: len ? (this.curRoom.msgs[len - 1].msgID + 1) : 0,
                msgType: obj.MessageType,
                time: obj.Timestamp,
                body: obj.MessageBody,
                avatar: obj.From.Avatar,
                readed: true,
                id: obj.MessageId,
                name: obj.From.DisplayName,
                tel: this.info.UserId,
                uid: obj.From.UserId,          // 消息归属者ID
                vip: false,
                ing: true
            };
            this.client.publish('chatroom/' + this.info.UserId, JSON.stringify(obj), { qos: 2 }, (err) => {
                console.log(err)
                if (err) {
                    message.warn("发送消息失败，请检查网络连接！");
                    return;
                }
                // this.addMsg(this.curRoom, data);
                // this.checkIsCustomOnline(data.msgID + 1);
                // this.SendPush(this.curMsg);
                const msgContent = {
                    MsgContent: this.curMsg,
                    MsgType: 'Text',
                    MsgNo: this.info.UserId,
                    CategoryBId: '001-002'
                };
                // this.sendRequest(msgContent);
                this.curMsg = "";
                if (Txt.set) {
                    Txt.set('');
                }
                // if (this.curRoom.plant && this.curRoom.plantNum <= 0) {
                //     this.reqPlant();
                // }
            });
        } else {
            message.warn("不能发送空的消息！");
        }
    }

    // 发送商品
    sendGoods = (g) => {
        if (!this.curRoom.id) {
            message.warn("未选择聊天室");
            return;
        }
        // this.SendPush('[商品]').then(rdx => {
        // Loading(true);
        const goods = {
            GoodsDetailUrl: Url.goodsUrl + '/' + g.GoodsSeriesCode,  // 测试
            GoodsImageUrl: g.photo,
            GoodsPriceValue: g.GoodsPriceMin.toString(),
            GoodsSeriesName: g.GoodsSeriesName,
            IsStandard: g.IsStandard
        }
        const obj = this.Msg(JSON.stringify(goods), "Goods");
        this.client.publish('chatroom/' + this.info.UserId, JSON.stringify(obj), { qos: 2 }, (err) => {
            if (err) {
                message.warn("发送消息失败，请检查网络连接！");
                return;
            }
            // this.SendPush('[商品]');
            Loading();
        });
        // })
    }
    // 发送订单
    sendContract = (data) => {
        if (!this.curRoom.id) {
            message.warn("未选择聊天室");
            return;
        }
        const order = Object.assign({}, data);
        const obj = this.Msg(JSON.stringify(order), 'Order');
        // alert(JSON.stringify(obj))
        this.client.publish('chatroom/' + this.info.UserId, JSON.stringify(obj), { qos: 2 }, (err) => {
            if (err) {
                return message.warn('发送订单失败， 请检查网络连接！');
            }
            // this.SendPush('[订单]');
            Loading();
        })
    }

    // 发送超级团商品
    sendGroup = (data) => {
        if (!this.curRoom.id) {
            message.warn("未选择聊天室");
            return;
        }
        data.Type = "SuperGroup";
        data.GoodsSeriesPhotos = JSON.stringify(data.GoodsSeriesPhotos);
        let m = this.Msg('', '');
        m.MessageBody = {
            Text: JSON.stringify(data),
            Type: 'SuperGroup'
        };
        this.client.publish(this.curRoom.id, JSON.stringify(m), { qos: 2 }, (err) => {
            if (err) {
                message.warn("发送消息失败，请检查网络连接！")
            }
        });
    }
    CheckTec = async (code) => {
        const temp = await Http.get(`web/make/technology/template?GoodsSeriesCode=${code}&AuditState=1&CategoryBId=${this.info.CategoryBId}`)
        return temp;
    }
    LookContarct = async (n) => {
        const res = await Http.get('web/make/contract/chat?ContractNo=' + n);
        return res;
    }



    // 发送图片
    sendImg = (url) => {
        this.SendPush('[图片]').then(rdx => {
            const data = this.Msg('', '');
            const body = {
                Image: url,
                Type: 'Image',
                VoiceDuration: 0
            }
            data.MessageBody = body;
            this.client.publish(this.curRoom.id, JSON.stringify(data), { qos: 2 }, (err) => {
                if (err) {
                    message.warn("发送消息失败，请检查网络连接！")
                }
            });
        })
    }
    // 消息提醒
    cue = () => {

        // alert('有新消息')
    }

}

export const appStore = new AppStore();