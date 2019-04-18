import * as React from 'react';
import './my-group-share.css';
import { withRouter } from 'react-router-dom';
import http from '../../service/Http';
import { message, Card, Divider,Icon,Carousel } from 'antd';
import adv from '../../assets/gift-img/adv.png';
import star from '../../assets/using-help/star.png';
import touxiang from '../../assets/using-help/touxiang.png';
import { last } from 'rxjs/operators';
import download from '../../assets/using-help/download.png';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
}
type State = {
    data: any,
    info:any,
    GoodsSeriesKeywords:any,
    time: any,
    sTime: any,
    unfold:any,
    display:any,
    IsEnd:any
}
class MyGroupShare extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            data: {},
            info:{},
            GoodsSeriesKeywords:[],
            GoodsSeriesPhotos:[],
            time: {
                day:'0',
                hour:'0',
                minute:'0',
                second:'0',
                allHour:'0'
            },
            sTime: {
                allHour:'00',
                hour: '00',
                minute:'00',
                second:'00'
            },
            unfold:false,
            display:'none',
            IsEnd:true
        };
    }
    SuperGroupDeatailId = '';
    UserId='';
    async componentWillMount() {
        this.SuperGroupDetailId = this.props.match.params.supergroupdetailId;
        this.UserId = this.props.match.params.userId;
        await this.getMyGroup();
    }
    getMyGroup = async () => {
        const res = await http.get(Url.baseUrl+'/app/my/super/group/share', {
            SuperGroupDetailId: this.SuperGroupDetailId,
            UserId: this.UserId
        });
        if (res.ResultCode === 0) {
            this.data = res.Data;
            console.log(res.Data)
            this.data = res.Data.SuperGroup;
            this.data.GoodsSeriesPhotos = res.Data.SuperGroup.GoodsSeriesPhotos?JSON.parse(res.Data.SuperGroup.GoodsSeriesPhotos):[];
            this.data.GoodsSeriesKeywords = res.Data.SuperGroup.GoodsSeriesKeywords?res.Data.SuperGroup.GoodsSeriesKeywords.split('|'):[];
            this.info = res.Data.SuperGroupDetail;
            // console.log(this.data.GoodsSeriesKeywords)
            const arr=[];
            for (var i=0;i<this.info.PeopleNumber;i++) {
                arr.push(i);
            }
            this.info.arr=arr; 
            console.warn(this.info)
            this.setState({
                data: this.data,
                info: this.info,
                GoodsSeriesKeywords: this.data.GoodsSeriesKeywords.length>4?this.data.GoodsSeriesKeywords.splice(0,4):this.data.GoodsSeriesKeywords,
                GoodsSeriesPhotos: this.data.GoodsSeriesPhotos
            });
            setInterval(() => {
                this.checkEnd();
                this.setState({});
            }, 1000)
            this.setTime();
            this.setSmallTime();

        }
    }
    checkEnd(){
        if (this.state.info.Day==='0'&& this.state.info.Hour==='00:00:00') {
            this.setState({
                IsEnd: true
            })
        } else {
            this.setState({
                IsEnd: false
            })
        }
        
    }
    download() {
        window.open('http://www.emake.cn/download/');
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
    setSmallTime(){
        let day = this.state.info.Day;
        let hour = Number(this.state.info.Hour.split(':')[0]);
        let minute = Number(this.state.info.Hour.split(':')[1]);
        let second = Number(this.state.info.Hour.split(':')[2]);
        let timer=null;
        if(this.state.info.IsSuccess==='1') {
            this.setState({
                sTime: {
                    day: '0',
                    hour: '00',
                    minute: '00',
                    second: '00',
                    allHour: '00'
                }
            });
            return;
        }
        let lastTime = (day*24*60*60+hour*60*60+minute*60+second);
        timer = setInterval(() => {
            
            if(lastTime>0){
                day = Math.floor(lastTime / 3600 / 24);
                hour = Math.floor(lastTime / 3600 % 24);
                minute = Math.floor(lastTime / 60 % 60);
                second = Math.floor(lastTime  % 60);
            }
            this.setState({
                sTime: {
                    day: day<10?'0'+day:day,
                    hour: hour<10?'0'+hour:hour,
                    minute: minute<10?'0'+minute:minute,
                    second: second<10?'0'+second:second,
                    allHour: (day*24+hour)<10?'0'+(day*24+hour):(day*24+hour)
                }
            });
            lastTime--;
    
        },1000);
        if(lastTime<0) {
            clearInterval(timer);
        }
    }
    render(){
        return (
            <div className='my-group-share'>
                <div className='imgContainer'>
                    <Carousel autoplay={true} >
                        {this.state.GoodsSeriesPhotos.map((item,index)=> (<div key={index}>
                        <img src={item}  style={{ height:215,margin:'0 auto' }} alt="GoodsSeriesImg"/>
                        </div>))}
                    </Carousel>
                    {/* <img src={this.state.data.GoodsSeriesPhotos} style={{ height: 215}} /> */}
                    <img src={download} style={{ position: 'fixed', right: '0',height: '115px',top: '70px', zIndex:9999}}  onClick={this.download}/>
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
                    <div className='imgContainer'>
                        <Carousel autoplay={true} >
                            {this.state.GoodsSeriesPhotos.map((item,index)=> (<div key={index}>
                            <img src={item}  style={{ height:215,margin:'0 auto' }} alt="GoodsSeriesImg"/>
                            </div>))}
                        </Carousel>
                        <img src={download} style={{ position: 'fixed', right: '0',height: '115px',top: '70px'}}  onClick={this.download}/>
                    </div>
                    {this.state.GoodsSeriesKeywords.length?<p className='keywords'>{this.state.data.GoodsSeriesKeywords ? this.state.data.GoodsSeriesKeywords.map((item, index) => (
                        <span key={index}><img style={{ margin: "-5px 5px 0 5px", width: "15px" }} alt="star" src={star} />{item}</span>
                    )) : ''}</p>:''}
                    <h3>{this.state.data.GroupName}</h3>
                    <p className='groupprice'>
                        <span>￥{this.state.data.GroupPrice}</span><span style={{ fontSize: 12,marginRight: 20 }}>{this.state.data.Unit!==''?'/'+this.state.data.Unit:''}</span><span className='upper' style={{ fontSize: 12 }}>起</span><span style={{ fontSize: 16 }}>拼团价</span>
                    </p>
                    <p style={{ textDecoration: 'line-through', color: '#999999' }}>￥{this.state.data.OldPrice}原价</p>
                    <p style={{ color: '#FF9900' }}>{this.state.data.GoodsAddValue}
                        <span className='countDown' style={{ color: '#999999' }}>距离结束
                            <span className='time'>{this.state.IsEnd?this.state.data.Day:this.state.time.day}</span>天<span className='time'>{this.state.IsEnd &&this.state.data.Hour?this.state.data.Hour.split(':')[0]:this.state.time.hour}</span>时<span className='time'>{this.state.IsEnd&&this.state.data.Hour?this.state.data.Hour.split(':')[1]:this.state.time.minute}</span>分<span className='time'>{this.state.IsEnd&&this.state.data.Hour?this.state.data.Hour.split(':')[2]:this.state.time.second}</span>秒
                        </span>
                    </p>
                </Card> */}
                <Card className='bottomContainer'>
                    <div style={{width:'90%',margin:'10px auto'}}>
                        <p style={{fontSize:16}}>还差{this.state.info.IsSuccess==='1'?'0':this.state.info.PeopleNumber - this.state.info.PeopleReadyNumber}人拼团成功</p>
                        <div className='numbers'>
                            {this.state.info.arr?this.state.info.arr.map((item,index)=> (
                                <span style={{marginRight: 10,}} key={index}>
                                    {index<=this.state.info.PeopleReadyNumber-1?<img className='toux' src={touxiang}/>:<div className='circle' ><Icon type="question" theme="outlined" /></div>}
                                </span>
                                
                            )):''}
                        </div>
                        <p style={{ color: '#999999', marginBottom: 40 }}>交货期：{this.state.info.DeliveryDate}</p>
                        {/* <Divider>还剩<span className='endTime'>{this.state.sTime.allHour+':'+this.state.sTime.minute+':'+this.state.sTime.second}</span>结束</Divider> */}
                      
                    </div>

                </Card>
                {/* <img src={adv} style={{ position: 'fixed', left: '0', bottom: '0', width: '100%', height: '50px' }}
                    onClick={this.download} /> */}
            </div>
        )
    }
}

export default withRouter(MyGroupShare);