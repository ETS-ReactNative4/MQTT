import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './s.css';
import { Carousel, Row, Col, Button, Checkbox, message } from 'antd';
import IptMsg from '../../components/iptMsgs'
import Msgs from '../../components/msgs';
import Http from '../../service/Http';
import Url from '../../service/Url';
import { appStore } from '../app.store';
import User from '../../service/User';
import { randomWord } from '../../service/Utils';
import { Md5 } from 'md5-typescript';
import * as uuidv1 from "uuid/v1";
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    params: {},
    payWay: ''
}
class MallChatting extends React.Component<Props, State> {
    JIM = null;
    constructor(props: Props) {
        super(props);
        this.state = {
            chatMsgList: [],
            onlyMQTT: false,
            PageIndex: 1,
            totalCount: 0,
            id: '0'
        };
    }
    componentWillMount() {
        document.title = '易智造客服';
        const userId = User.getId();
        if (userId == undefined || userId == '' || userId == null) {
            this.updateUserInfo();
        }
        // this.InitJIM();
        const JMessage = window.JMessage;
        this.JIM = new JMessage();
        let params = {
            appkey: '8370282dfbaea4aeebbcd5a2',
            random_str: randomWord(true, 20, 32),
            timestamp: new Date().getTime(),
            flag: 1
        }
        params.signature = Md5.init(`appkey=${params.appkey}&timestamp=${params.timestamp}&random_str=${params.random_str}&key=c3485ff2e5cbd07161facb94`).toUpperCase();
        // console.log(params);
        this.JIM.init(params).onSuccess(() => {
            if (User.getId() && !this.JIM.isLogin()) {
                //登录
                this.JIM.login({
                    'username': User.getId(),
                    'password': '123456'
                }).onSuccess((data) => {
                    console.log('23333,', data);
                    const info = sessionStorage.getItem('OrderData');
                    console.log(info);
                    console.log(info !== undefined, typeof info);
                    if (info !== undefined && info !== 'undefined' && info !== null && info !== 'null') {
                        this.sendOrderOrGoods(JSON.parse(info));
                    }
                }).onFail((data) => {
                    //同上
                    console.log(data);
                    this.LoginJIM();
                });
            }
            // 实时监听收到的消息
            this.JIM.onMsgReceive((rmsg) => {
                let tmp = []
                rmsg.messages.forEach(item => {
                    tmp.push(item.content.msg_body.extras);
                });
                const msgList = this.state.chatMsgList.concat(tmp);
                this.setState({
                    chatMsgList: msgList,
                    id: '0'
                })
            });
            this.JIM.onSyncConversation(scon => {
                // 获取离线数据的时候还没有设置聊天对象
                // commit(types.SET_SYNC_CONVERSATION, scon)
            });
            this.JIM.onMutiUnreadMsgUpdate(data => {
                console.log(data)
            });
            this.getHisMsg();
        }).onFail((data) => {
            console.log(data);
            this.InitJIM();
        })
        // this.JIM.login({
        //     'username' : User.getPhone(),
        //     'password' : '123456'
        // }).onSuccess((data) => {
        //     console.log(data);
        //      //data.code 返回码
        //      //data.message 描述
        //      //data.online_list[] 在线设备列表
        //      //data.online_list[].platform  Android,ios,pc,web
        //      //data.online_list[].mtime 最近一次登录时间
        //      //data.online_list[].isOnline 是否在线 true or false
        //      //data.online_list[].isLogin 是否登录 true or false
        //      //data.online_list[].flag 该设备是否被当前登录设备踢出 true or false
        // }).onFail((data) => {
        //   //同上
        //     console.log(data);
        // });


    }
    LoginJIM = () => {
        console.log(User.getId());
        this.JIM.login({
            'username': User.getId(),
            'password': '123456'
        }).onSuccess((data) => {
            console.log('23333,', data);
        }).onFail((data) => {
            //同上
            console.log(data);
            this.LoginJIM();
        });
    }
    InitJIM = () => {
        const JMessage = window.JMessage;
        this.JIM = new JMessage();
        let params = {
            appkey: '8370282dfbaea4aeebbcd5a2',
            random_str: randomWord(true, 20, 32),
            timestamp: new Date().getTime(),
            flag: 1
        }
        params.signature = Md5.init(`appkey=${params.appkey}&timestamp=${params.timestamp}&random_str=${params.random_str}&key=c3485ff2e5cbd07161facb94`).toUpperCase();
        // console.log(params);
        this.JIM.init(params).onSuccess(() => {
            if (User.getId() && !this.JIM.isLogin()) {
                //登录
                this.JIM.login({
                    'username': User.getId(),
                    'password': '123456'
                }).onSuccess((data) => {
                    console.log('23333,', data);
                }).onFail((data) => {
                    //同上
                    console.log(data);
                    this.LoginJIM();
                });
            }
            // 实时监听收到的消息
            this.JIM.onMsgReceive((rmsg) => {
                let tmp = []
                rmsg.messages.forEach(item => {
                    tmp.push(item.content.msg_body.extras);
                });
                const msgList = this.state.chatMsgList.concat(tmp);
                this.setState({
                    chatMsgList: msgList,
                    id: '0'
                })
            });
            this.JIM.onSyncConversation(scon => {
                // 获取离线数据的时候还没有设置聊天对象
                // commit(types.SET_SYNC_CONVERSATION, scon)
            });
            this.JIM.onMutiUnreadMsgUpdate(data => {
                console.log(data)
            });
            this.getHisMsg();
        }).onFail((data) => {
            console.log(data);
            this.InitJIM();
        })
    }

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

        // message.success('更新用户信息成功！');

    }
    componentDidMount() {
        window.onresize = this.onWindowResize;
        appStore.comp = this;
        // appStore.connet();
        // if (appStore.client !== null) {
        //     if (appStore.client.options.clientId == undefined  || appStore.client.options.clientId.split('/')[1] == undefined || appStore.client.options.clientId.split('/')[1] == '') {
        //         console.log(appStore.client.options.clientId);
        //         appStore.client = null;
        //         appStore.connet();
        //     }
        // } else {
        //     if (appStore.info.UserId !== '') {
        //         appStore.connet();
        //     } else {
        //         this.updateUserInfo();
        //         appStore.connet();
        //     }

        // }
        // this.setState({});
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        appStore.comp = null;
    }
    onWindowResize = () => {
        // alert(2333);
    }
    jumpOrder = (OrderNo) => {
        this.props.history.push('/mallOrderDetail/' + OrderNo);
    }
    signContract = (OrderNo, ContractState) => {
        console.log(OrderNo);
        this.props.history.push('/mallContract/' + OrderNo + '/' + ContractState);
    }
    openGoods = (GoodsSeriesCode) => {
        this.props.history.push('/mallGoodsDetail/' + GoodsSeriesCode);
    }
    // 发送文本信息
    sendMsg = async () => {
        const s = appStore;
        if (s.curMsg) {
            const {
                ResultCode: code,
                ResultInfo: info,
                Data: data
            } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
                MsgContent: s.curMsg,
                MsgType: 'Text',
                MsgNo: uuidv1(),
                CategoryBId: '001-002'
            });
            if (code !== Http.ok) {
                return message.error(info);
            }
            s.curMsg = '';
        }
    }
    // 发送图片
    sendImg = async (url) => {
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
            MsgContent: url,
            MsgType: 'Image',
            MsgNo: uuidv1(),
            CategoryBId: '001-002'
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
    }
    sendOrderOrGoods = async (obj) => {
        console.log(obj);
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', obj);
        if (code !== Http.ok) {
            sessionStorage.setItem('OrderData', undefined);
            return message.error(info);
        }
        sessionStorage.setItem('OrderData', undefined);
    }

    getMyMsg = async () => {
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.get(Url.baseUrl + '/app/gyb/mymsg');
        if (code !== 0) {
            return message.error(info);
        }
        console.log(data);
    }
    getHisMsg = async (pageIndex = this.state.PageIndex) => {
        let msgs = [];
        // 舍弃MQTT消息
        const {
            ResultCode: code,
            ResultInfo: info,
            Data: data
        } = await Http.get(Url.baseUrl + '/app/gyb/chat/recode', {
            EmakeUserId: User.getId(),
            CategoryBId: '001-002',
            RequestType: '1',
            IsConsult: '1',
            PageIndex: pageIndex,
            PageSize: 10
        });
        if (code !== 0) {
            return message.error(info);
        }
        const sortMsg = (a, b) => {
            const aTime = a ? new Date(a.MsgCreateTime.replace(/-/g, '/')).getTime() : '';
            const bTime = b ? new Date(b.MsgCreateTime.replace(/-/g, '/')).getTime() : '';
            return aTime - bTime;
        }
        const msgList = data.Msgs ? data.Msgs.sort(sortMsg) : [];
        if (data && data.Msgs !== undefined) {
            if (pageIndex == 1) {
                msgs = msgList;
            } else {
                msgs = [...msgList, ...this.state.chatMsgList];
            }
            this.setState({
                chatMsgList: msgs,
                totalCount: data.TotalCount
            });
        }

    }
    // sortMsg(a,b) {
    //     const aTime = a ? new Date(a.MsgCreateTime).getTime(): '';
    //     const bTime = b ? new Date(b.MsgCreateTime).getTime(): '';
    //     const ua = navigator.userAgent.toLowerCase();
    //     if (/\(i[^;]+;( U;)? CPU.+Mac OS X/gi.test(ua)) {
    //         return bTime -aTime;
    //     } else if (/android|adr/gi.test(ua)) {
    //        return aTime -bTime;
    //     } else {
    //         return aTime -bTime;
    //     }
    // }
    // 查看历史记录
    HistoryMsg = () => {
        // 舍弃MQTT消息
        const page = this.state.PageIndex + 1;
        this.getHisMsg(page);
        this.setState({
            PageIndex: page,
            id: '1'
        })
    }
    render() {
        const s = appStore;
        return (
            <div id="chat" className='mall_chatting' style={{ height: '100%', backgroundColor: '#fff' }}>
                <Msgs msgs={this.state.chatMsgList} id={this.state.id} jump={this.jumpOrder}
                    edit={s.editRemark}
                    sign={this.signContract}
                    open={this.openGoods}
                    history={this.HistoryMsg}
                    totalCount={this.state.totalCount}
                    curPage={this.state.PageIndex}
                />
                <IptMsg
                    name={s.curRoom.remark || s.curRoom.name}
                    ck2={this.sendImg}
                    ck4={s.close}
                    change={s.editMsg}
                    send={this.sendMsg}
                    user={s.UserListNow}
                    now={s.curRoom}
                    userList={s.checkUserListGet}
                    chChange={s.GetCustomerHelps}
                    HelpClose={s.GetCustomerHelpclose}
                    ch={s.GetCustomerHelp}
                />
            </div>
        );
    }
}
export default withRouter(MallChatting);