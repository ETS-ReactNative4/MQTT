import * as React from 'react';
import { withRouter } from 'react-router-dom';
import http from '../../service/Http';
import { message, Card, Divider,Icon, Carousel } from 'antd';
import './super-group-share.css';
import adv from '../../assets/gift-img/adv.png';
import star from '../../assets/using-help/star.png';
import download from '../../assets/using-help/download.png';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
}
type State = {
    data: any,
    info:any,
    superGroup:any,
    GoodsSeriesKeywords:any,
    time: any,
    unfold:any,
    display:any,
    groupNum:any,
    BeginAt:any
}
class SuperGroupShare extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: {},
            info:[],
            superGroup:{},
            GoodsSeriesKeywords:[],
            GoodsSeriesPhotos: [],
            time: {
                day:'0',
                hour:'00',
                minute:'00',
                second:'00',
                allHour:'0'
            },
            unfold:false,
            display:'none',
            groupNum:0,
            BeginAt:{
                month:'10',
                date:'26',
                hour:'00',
                minute:'00'
            }
        };
    }
    SuperGroupId = '';
    UserId='';
    SuperGroup={};
    async componentWillMount() {
        this.SuperGroupId = this.props.match.params.supergroupId;
        this.UserId = this.props.match.params.userId;
        await this.getSuperGroup();
        // await this.getSuperGroupDetail();
        
    }
    getSuperGroup = async () => {
        const res = await http.get(Url.baseUrl+'/app/super/group/detail/share', {
            SuperGroupId: this.SuperGroupId,
            UserId: this.UserId
        });
        if (res.ResultCode === 0) {
            this.setState({
                superGroup:res.Data.SuperGroup
            });
            this.data = Object.assign({},res.Data.SuperGroup);
            this.data.GoodsSeriesPhotos = this.data.GoodsSeriesPhotos?JSON.parse(this.data.GoodsSeriesPhotos):[];
            this.data.GoodsSeriesKeywords = this.data.GoodsSeriesKeywords?this.data.GoodsSeriesKeywords.split('|'):[];
            // console.log(this.data.GoodsSeriesKeywords)
            this.info = res.Data.SuperGroupDetail;
            this.date = this.data.BeginAt.split(' ')[0];
            this.time = this.data.BeginAt.split(' ')[1];
            this.month = this.date.split('-')[1];
            this.day = this.date.split('-')[2];
            this.hour = this.time.split(':')[0];
            this.minute = this.time.split(':')[1];
            this.setState({
                data: this.data,
                info: this.info,
                GoodsSeriesKeywords: this.data.GoodsSeriesKeywords.length>4?this.data.GoodsSeriesKeywords.splice(0,4):this.data.GoodsSeriesKeywords,
                GoodsSeriesPhotos: this.data.GoodsSeriesPhotos,
                groupNum: this.info.length,
                BeginAt:{
                    month: this.month,
                    day: this.day,
                    hour: this.hour,
                    minute: this.minute
                }
            });
            setInterval(() => {
                this.checkEnd();
            }, 1000)
            this.setTime();

        }
    }
    download=()=> {
        const ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf("micromessenger")!==-1) {
            alert('微信请在右上角浏览器打开！')
            return;
        }
        if(ua.indexOf('iphone')!==-1) {
            window.location ='emake://emake.user/registerData?type=2&SuperGroupBean='+JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'https://itunes.apple.com/cn/app/id1260429389';
            },500)
        } else if(ua.indexOf('android')!==-1) {
            window.location = 'emake://emake.user/registerData?type=2&SuperGroupBean='+JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'http://www.emake.cn/download/';
            },500)
        } else {
            window.location = 'http://www.emake.cn/download/';
        }
    }
    changeFoldState =() => {
        if(this.state.unfold) {
            this.setState({
                unfold: false,
                display: 'none'
            })
        } else {
            this.setState({
                unfold: true,
                display: ''
            })
        }
    }
    checkGroupState=(item) => {
        if(this.state.data.GroupState==='1') {
            return '即将开始';
        } else {
            if(item.IsSuccess==='1') {
                return '拼团成功';
            } else {
                if(item.Day==='0'&& item.Hour==='00:00:00') {
                    return '拼团结束'
                } else {
                    return '立即拼团';
                }
            }
        }
        
    }
    join =() => {
        const ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf("micromessenger")!==-1) {
            alert('微信请在右上角浏览器打开！')
            return;
        }
        if(ua.indexOf('iPhone') !==-1) {
            window.location ='emake://emake.user/registerData?type=2&SuperGroupBean='+JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'https://itunes.apple.com/cn/app/id1260429389';
            },500)
        } else if(ua.indexOf('android') !== -1) {
            window.location = 'emake://emake.user/registerData?type=2&SuperGroupBean='+JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'http://www.emake.cn/download/';
            },500)
        } else {
            window.location = 'http://www.emake.cn/download/';
        }
    }
    checkEnd(){
        if (this.state.data.Day==='0'&& this.state.data.Hour==='00:00:00') {
            this.setState({
                IsEnd: true
            })
        } else {
            this.setState({
                IsEnd: false
            })
        }
        
    }

    setTime() {
        let day = this.state.data.Day;
        let hour = Number(this.state.data.Hour.split(':')[0]);
        let minute = Number(this.state.data.Hour.split(':')[1]);
        let second = Number(this.state.data.Hour.split(':')[2]);
        let timer=null;
        let lastTime = (day*24*60*60+hour*60*60+minute*60+second);
        timer = setInterval(() => {
            
            if(lastTime>0){
                day = Math.floor(lastTime / 3600 / 24);
                hour = Math.floor(lastTime / 3600 % 24);
                minute = Math.floor(lastTime / 60 % 60);
                second = Math.floor(lastTime  % 60);
            }
            this.setState({
                time: {
                    day: day,
                    hour: hour,
                    minute: minute,
                    second: second,
                }
            });
            lastTime--;
    
        },1000);
        if(lastTime<0) {
            clearInterval(timer);
        }
        
    }
    render() {
        return (
            <div className='super-group-share'>
                <div className='imgContainer'>
                    <Carousel autoplay={true} >
                        {this.state.GoodsSeriesPhotos.map((item,index)=> (<div key={index}>
                        <img src={item}  style={{ height:215,margin:'0 auto' }} alt="GoodsSeriesImg"/>
                        </div>))}
                    </Carousel>
                    {/* <img src={this.state.data.GoodsSeriesPhotos} style={{ height: 215}} /> */}
                    <img src={download} style={{ position: 'fixed', right: '0',height: '115px',top: '70px',zIndex:9999}}  onClick={this.download}/>
                </div>
                {this.state.GoodsSeriesKeywords.length?<Card
                            hoverable
                            style={{ width: "100%",backgroundColor: '#f2f2f2' }}
                        >
                            <ul style={{ backgroundColor: "#F2F2F2" }}>
                                {
                                    this.state.GoodsSeriesKeywords.map((cont, index) => {
                                        return (
                                            <li key={index} style={{ lineHeight: "24px", fontSize: "12px", float: "left" }}>
                                                <img style={{ margin: "-5px 5px 0 5px", width: "15px" }} alt="star" src={star} />
                                                <span>{cont}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            
                        </Card>:''}
                <div style={{paddingLeft:10,padding:10,backgroundColor: '#FFF',marginBottom: 5}}>
                    <h3>{this.state.data.GroupName}</h3>
                    <p className='groupprice'>
                        <span>￥{this.state.data.GroupPrice}</span><span style={{ fontSize: 12,marginRight: 20 }}>{this.state.data.Unit!==''?'/'+this.state.data.Unit:''}</span><span className='upper' style={{ fontSize: 12 }}>起</span><span style={{ fontSize: 16 }}>拼团价</span>
                    </p>
                    <p style={{ textDecoration: 'line-through', color: '#999999' }}>￥{this.state.data.OldPrice}原价</p>
                    <p style={{ color: '#FF9900' }}>{this.state.data.GoodsAddValue}
                        <span className='countDown' style={{ color: '#999999' }}>{this.state.data.GroupState==='1'?'开始时间':'距离结束'}
                        {this.state.data.GroupState==='1'?<span><span className='time'>{this.state.BeginAt.month}</span>月<span className='time'>{this.state.BeginAt.day}</span>日<span className='time'>{this.state.BeginAt.hour}</span>时<span className='time'>{this.state.BeginAt.minute}</span>分</span>:<span><span className='time'>{this.state.IsEnd?this.state.data.Day:this.state.time.day}</span>天<span className='time'>{this.state.IsEnd &&this.state.data.Hour?this.state.data.Hour.split(':')[0]:this.state.time.hour}</span>时<span className='time'>{this.state.IsEnd&&this.state.data.Hour?this.state.data.Hour.split(':')[1]:this.state.time.minute}</span>分<span className='time'>{this.state.IsEnd&&this.state.data.Hour?this.state.data.Hour.split(':')[2]:this.state.time.second}</span>秒</span>}    
                        </span>
                    </p>
                </div>
                {/* <Card className='topContainer'>
                    
                    
                    
                </Card> */}
                <Card className='bottomContainer'>
                    <div>
                        {this.state.info? this.state.info.map((item, index) => (
                            <div className={'groupContainer'} key={index} >
                                <div className='round'>
                                    {item.PeopleNumber}人团
                                </div>
                                <div className='center'>
                                    <div className='left'>
                                        <p className='groupPrice'>￥{item.GroupPrice}</p>
                                        <p className='remain small'>还差{item.IsSuccess==='1'?'0':item.PeopleNumber-item.PeopleReadyNumber}人拼成</p>
                                    </div>
                                    <div className='right'>
                                        <small className='deliverydate' style={{ overflow: 'hidden', }}>交货期:<small>{item.DeliveryDate.split(' ')[0]}</small></small>
                                        <br/><small style={{ color: '#FF9900' }}>每人订购：{item.SetNum}{this.state.data.Unit}</small>
                                        {/* <p style={{ color: '#999' }}>还剩{item.Day}天<span style={{ fontSize: 6 }}>{item.Hour}</span></p> */}
                                    </div>
                                </div>
                                <div onClick={this.download} className={this.state.data.GroupState==='1'?'begin':(item.Day==='0'&&item.Hour==='00:00:00'&& item.IsSuccess==='0'?'end':'join')}>
                                    <p style={{ color: '#FFF', fontSize: 15 }}>{this.checkGroupState(item)}</p>
                                    {/* <small className={item.Day==='0'&&item.Hour==='00:00:00'&& item.IsSuccess==='0'?'':'setNum'}>每人订购:{item.SetNum}件</small> */}
                                </div>
                            </div>
                        )) : ''}
                        <div>
                            {/* {this.state.groupNum>4?<div>
                                {this.state.unfold?<p onClick={this.changeFoldState}><Icon type='up' theme='outlined'/>折叠更多拼团</p>:<p onClick={this.changeFoldState}><Icon type="down" theme="outlined" />展开更多拼团</p>}
                            </div>:''} */}
                        </div>
                        
                    </div>
                    {/* {this.state.data.IsIngroup ? <div>
                        <h3>还差{this.state.groupDetail.PeopleNumber - this.state.groupDetail.PeopleReadyNumber}人拼团成功</h3>
                        <ul>
                            {[1, 2, 3].map((item, index) => (
                                <li className={index <= this.state.groupDetail.PeopleReadyNumber - 1 ? 'on' : 'off'} key={index}>{item}</li>
                            ))}
                        </ul>
                        <p style={{ color: '#999999', marginBottom: 40 }}>交货期：{this.state.groupDetail.DeliveryDate}</p>
                        <Divider>还剩<span className='endTime'>{this.state.time.allHour}：{this.state.time.minute}：{this.state.time.second}</span>结束</Divider>
                    </div> : } */}

                </Card>
                {/* <img src={adv} style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '50px' }}
                    onClick={this.download} /> */}
            </div>
        );
    }
}
export default withRouter(SuperGroupShare);