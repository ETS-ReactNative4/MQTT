import * as React from 'react';
import './goods-details.css';
import { Tabs, Card, Divider, message, Carousel, Button, Drawer, Icon, Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import Http from '../../service/Http';
import star from '../../assets/img/tezhengstar.png';
import share from '../../assets/img/fenxiang.png';
import quality from '../../assets/img/zhiliangbaozhang-icon.png';
import aftersales from '../../assets/img/shouhoufuwu-icon.png';
import dot from '../../assets/img/yuandian6x6.png';
import download from '../../assets/using-help/download.png';
import Url from '../../service/Url';

const TabPane = Tabs.TabPane;

class GoodDetails extends React.Component {

    display = "block";
    img = null;

    componentDidMount() {
        // this.img.onload = () => {
        //     this.display = "block";
        //     this.setState({...this.state});
        // }
        // this.img.onerror = () => {
        //     this.display = "block";
        //     message.warn("商品图片加载失败，请重试");
        //     this.setState({...this.state});
        // }
    }
    downloadApp = () => {
        const ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("micromessenger") !== -1) {
            alert('微信请在右上角浏览器打开！')
            return;
        }
        if (ua.indexOf('iPhone') !== -1) {
            window.location = 'emake://emake.user/registerData?type=2&SuperGroupBean=' + JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'https://itunes.apple.com/cn/app/id1260429389';
            }, 500)
        } else if (ua.indexOf('android') !== -1) {
            window.location = 'emake://emake.user/registerData?type=2&SuperGroupBean=' + JSON.stringify(this.state.superGroup);
            setTimeout(() => {
                window.location = 'http://www.emake.cn/download/';
            }, 500)
        } else {
            window.location = 'http://www.emake.cn/download/';
        }
    }

    callback = (key) => {
        const detailsHight = (key === 'details' ? this.detailEle : this.goodsEle).offsetTop;
        this.setState({ activeKey: key });
        document.documentElement.scrollTop = window.pageYOffset = detailsHight;
        window.scrollTo(0,detailsHight);
        
    }
    scrollListener = () => {
        const detailsHight = this.detailEle.offsetTop;
        const dScrollTop = document.documentElement.scrollTop ||  window.pageYOffset;
        const scrollTop = typeof dScrollTop === 'undefined' ? window.pageYOffset : dScrollTop;
        const key = scrollTop < detailsHight ? 'good' : 'details'
        this.setState({ activeKey: key });
        if (this.state.activeKey !== key) {
            this.setState({ activeKey: key });
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            activeModel: 0,
            activeKey: "good",
            goods: '',
            CategoryBId: '',
            GoodsSeriesCode: '',
            GoodsSeriesKeywordList: [],
            GoodsInsurance: [],
            GoodsAfterSale: [],
            isApp: false,
            GoodsSeriesParams: [],
            GoodsSeriesPhotos: [],
            GoodsSeriesDetail: [],
            showParams: false,
            showGoodsSeriesService: false,
            showGoodsSeriesMatch: false,
            height: 256,
            serviceHeight: 256,
            ParamsString: '',
            time: {
                day:'0',
                hour:'00',
                minute:'00',
                second:'00',
            },
        };
    }
    IsNull = (exp) => {
        if (!exp && typeof exp != "undefined" && exp != 0) {
            return true;
        } else {
            if (exp == '' || exp == '[""]') {
                return true;
            } else {
                return false;
            }
        }
    }
    async componentWillMount() {
        const cid = this.props.match.params.code;
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,

        } = await Http.get(Url.baseUrl + `/app/make/series/detail?GoodsSeriesCode=${cid}`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        data.GoodsSeriesKeywordList = data.GoodsSeriesKeywords ? data.GoodsSeriesKeywords.split('|') : [];
        data.GoodsSeriesParams = data.GoodsSeriesParams ? JSON.parse(data.GoodsSeriesParams) : [];
        data.GoodsSeriesPhotos = data.GoodsSeriesPhotos ? JSON.parse(data.GoodsSeriesPhotos) : [];
        try {
            // data.GoodsQuality = this.IsNull(data.GoodsSeriesQuality) || data.GoodsSeriesQuality == '' ? data.GoodsQuality : data.GoodsSeriesQuality;
            data.GoodsQuality = data.GoodsQuality ? JSON.parse(data.GoodsQuality) : [];
        } catch (e) {
            data.GoodsQuality = []
        }
        try {
            // data.GoodsAfterSale = this.IsNull(data.GoodsSeriesAfterSale) || data.GoodsSeriesAfterSale == '' ? data.GoodsAfterSale : data.GoodsSeriesAfterSale;
            data.GoodsAfterSale = data.GoodsAfterSale ? JSON.parse(data.GoodsAfterSale) : [];
        } catch (e) {
            data.GoodsAfterSale = []
        }
        const arr = [];
        if (!data.GoodsSeriesDetail.startsWith('http')) {
            arr.push(data.GoodsSeriesDetail)
        }
        let GoodsQuality = [];
        if (data.GoodsSeriesQuality && data.GoodsSeriesQuality !== '[""]' && data.GoodsSeriesQuality.startsWith('[')) {
            GoodsQuality = JSON.parse(data.GoodsSeriesQuality)
        } else {
            if (!this.IsNull(data.GoodsSeriesQuality)) {
                GoodsQuality.push(data.GoodsSeriesQuality);
            }

        }
        let GoodsAfterSale = [];
        if (data.GoodsSeriesAfterSale && data.GoodsSeriesAfterSale !== '[""]' && data.GoodsSeriesAfterSale.startsWith('[')) {
            GoodsAfterSale = JSON.parse(data.GoodsSeriesAfterSale)
        } else {
            if (!this.IsNull(data.GoodsSeriesAfterSale)) {
                GoodsAfterSale.push(data.GoodsSeriesAfterSale);
            }
        }
        let parString = '';
        data.GoodsSeriesParams.map((it,index) => {
            if (index < 2) {
                parString +=it.ParamName + '  '
            }
        });
        this.setState({
            goods: data,
            GoodsSeriesKeywordList: data.GoodsSeriesKeywordList,
            GoodsInsurance: GoodsQuality,
            GoodsAfterSale: GoodsAfterSale,
            isApp: this.props.match.params.isApp !== undefined ? true : false,
            GoodsSeriesParams: data.GoodsSeriesParams,
            GoodsSeriesPhotos: data.GoodsSeriesPhotos,
            GoodsSeriesDetail: data.GoodsSeriesDetail.startsWith('[') ? JSON.parse(data.GoodsSeriesDetail) : arr,
            CategoryBId: data.CategoryBId,
            GoodsSeriesCode: data.GoodsSeriesCode,
            ParamsString: parString
        });
        if (data.GoodsKind === '1') {
            this.setTime();
        }
        window.onscroll = this.scrollListener;
        const height = (this.state.GoodsSeriesParams.length + 1) * 45 + 55;
        this.setState({
            height: height
        });
        const insuranceLth = this.state.GoodsInsurance.length;
        const afterLth = this.state.GoodsAfterSale.length;
        console.log(insuranceLth, afterLth)
        const serviceHeight = 120 + insuranceLth * 26 + afterLth * 26 + (insuranceLth > 0 ? 41 : 0) + (afterLth > 0 ? 41 : 0);
        console.log(serviceHeight)
        this.setState({
            serviceHeight: serviceHeight
        });
        console.log(this.state.GoodsInsurance);
        console.log(this.state.GoodsAfterSale)
    }

    getVal = () => {
        if (this.state.goods.CategoryId && this.state.goods.CategoryId.length > 3) {
            return this.state.goods.CategoryId.substring(0, 3) === "001" ? this.state.goods.GoodsAddValue : this.state.goods.GoodsAddValue2
        }
        return ""
    }
    callApp = () => {
        message.info('亲，请先下载我们的APP才可以开通会员享受优惠哦~')
    }
    showParamsDrawer = () => {
        this.setState({
            showParams: true
        })
    }
    showServiceDrawer = () => {
        this.setState({
            showGoodsSeriesService: true
        })
    }
    showMatchDrawer = () => {
        this.setState({
            showGoodsSeriesMatch: true
        })
    }
    close = () => {
        this.setState({
            showParams: false,
            showGoodsSeriesService: false,
            showGoodsSeriesMatch: false,
        })
    }
    setTime() {
        let day = this.state.goods.Day;
        let hour = Number(this.state.goods.Hour.split(':')[0]);
        let minute = Number(this.state.goods.Hour.split(':')[1]);
        let second = Number(this.state.goods.Hour.split(':')[2]);
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
                    hour: hour< 10 ? '0'+ hour: hour,
                    minute: minute < 10 ? '0' + minute: minute,
                    second: second < 10 ? '0' + second: second,
                }
            });
            lastTime--;
    
        },1000);
        if(lastTime<0) {
            clearInterval(timer);
        }
        
    }

    attachGoodsEle = ref => this.goodsEle = ref;

    attachDetailEle = ref => this.detailEle = ref;

    render() {
        return (
            <div style={{ display: this.display, backgroundColor: "#f5f5f5" }} className="goods_detail">
                <div style={{ width: "100%", height: "30px", backgroundColor: "#ffffff" }}></div>
                <Tabs activeKey={this.state.activeKey} size="default" onChange={this.callback}>
                    <TabPane tab="商品" key="good"></TabPane>
                    <TabPane tab="详情" key="details"></TabPane>
                </Tabs>
                <a ref={this.attachGoodsEle} name="good">
                    <Carousel autoplay={true}>
                        {this.state.GoodsSeriesPhotos.map((item, index) => (<div key={index}>
                            <img src={item} style={{ height: 215, margin: '0 auto' }} alt="GoodsSeriesImg" />
                        </div>))}
                    </Carousel>
                    {/* <img style={{ width: "100%" }} alt="GoodsSeriesImg" src={this.state.goods.GoodsSeriesPhotos} 
                    ref = {r => this.img = r}
                    /> */}
                    {this.state.isApp ? null : <img src={download} style={{ position: 'fixed', right: '0', height: '115px', top: '70px', zIndex: 9999 }} onClick={this.downloadApp} />}


                    {this.state.GoodsSeriesKeywordList.length ? (
                        <Card
                            hoverable
                            style={{ width: "100%" }}
                        >
                            <ul style={{ backgroundColor: "#F2F2F2" }}>
                                {
                                    this.state.GoodsSeriesKeywordList.map((cont, index) => {
                                        return (
                                            <li key={index} style={{ lineHeight: "24px", fontSize: "12px", float: "left" }}>
                                                <img style={{ margin: "-5px 5px 0 5px", width: "15px" }} alt="star" src={star} />
                                                <span>{cont}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Card>
                    ) : null
                    }
                </a>
                <div style={{ paddingBottom: "10px", borderTop: '1px solid #F2F2F2', backgroundColor: "#ffffff" }}>
                    {/* <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom' }}><span className={this.state.goods.IsStandard == '1' ? 'Standard' : 'notStandard'}>{this.state.goods.IsStandard == '1' ? '标准品' : '设计品'}</span>{this.state.goods.GoodsSeriesTitle}</p> */}
                    {this.state.goods.GoodsKind === '0'? <div style={{paddingLeft: "10px"}}>
                        <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom' }}>{this.state.goods.GoodsSeriesTitle}</p>
                        <p style={{ color: "#5ebecd", fontSize: "20px", margin: "0" }}>
                            ￥{this.state.goods.GoodsPriceMin}<span className="GoodsSeriesUnit" style={{color: "#5ebecd"}}>{this.state.goods.GoodsSeriesUnit ? '/' + this.state.goods.GoodsSeriesUnit : ''}</span> <span className="from" style={{color: "#5ebecd", borderColor: "#5ebecd"}}>起</span>
                            {/* <span style={{ float: "right", marginRight: "10px", fontSize: "13px", color: "#999999" }}>
                                月销量：{this.state.goods.GoodsSale}笔</span> */}
                        </p>
                    </div>:<div>
                        <Row style={{backgroundColor: '#FF6666', padding: '0 10px', }}>
                            <Col span={8} style={{height:'45px', lineHeight: '45px'}}>
                                <p style={{ color: "#FFF", fontSize: "20px", margin: "0" }}>
                                    ￥{this.state.goods.GoodsPriceMin}<span className="GoodsSeriesUnit">{this.state.goods.GoodsSeriesUnit ? '/' + this.state.goods.GoodsSeriesUnit : ''}</span> <span className="from">起</span>
                                {/* <span style={{ float: "right", marginRight: "10px", fontSize: "13px", color: "#999999" }}>
                                    月销量：{this.state.goods.GoodsSale}笔</span> */}
                                </p>
                            </Col>
                            <Col span={16} style={{textAlign: 'right'}}>
                                <p style={{margin: '0'}}>距结束<span style={{color: '#FFFF99'}}>{this.state.time.day+'天'+'  '+this.state.time.hour+':'+ this.state.time.minute+':'+this.state.time.second}</span></p>
                                {/* <div className='progressBar_container'>
                                    <span className="progress-bar">
                                        <span style={{width: Number(((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0)) <100 ? ((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0)+'%': '100%' }}></span>
                                        <label style={{color: '#FFF',textAlign: 'left', paddingLeft: '10px'}}>已抢购{this.state.goods.HasPresellNum}件</label>
                                        <label style={{textAlign: 'right', color:'#DDC170'}}>{Number(((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0))+ '%'}</label>
                                    </span>
                                </div> */}
                                <div className="progress-bar">
                                    <span style={{width: Number(((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0)) <100 ? ((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0)+'%': '100%' }}></span>
                                    <label style={{textAlign: 'left',paddingLeft: '10px'}}>已抢购{this.state.goods.HasPresellNum+ this.state.goods.GoodsSeriesUnit}</label>
                                    <label style={{textAlign: 'right',paddingRight: '10px', color:'#DDC170'}}>{((this.state.goods.HasPresellNum/this.state.goods.PresellNum)*100).toFixed(0)+'%'}</label>
                                </div>
                            </Col>
                        </Row>
                        <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom',paddingLeft: "10px",  }}>{this.state.goods.GoodsSeriesTitle}</p>
                    </div>}
                    
                    <p style={{ color: "#ffc358", fontSize: "12px", margin: "0",paddingLeft: "10px",  }}>{
                        this.getVal()
                    }</p>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: 0,paddingLeft: "10px",  }}><span className="GoodsSeriesSetNum">{this.state.goods.GoodsKind === '0' && this.state.goods.GoodsSeriesSetNum? this.state.goods.GoodsSeriesSetNum+ this.state.goods.GoodsSeriesUnit: this.state.goods.MinSetNum+ this.state.goods.GoodsSeriesUnit}起订</span></p>
                    {/* <p className='vipinfo'><img src={vip} style={{width:26,margin:'-2px 10px 0px'}}/>开通会员，下单最高享<span style={{color:'#F8695D'}}>{9.7}折</span>优惠<span style={{color:'#F8695D',float:'right',marginRight:20}}>></span></p> */}
                    {/* {this.state.GoodsSeriesParams.length?<p className='GoodsSeriesParams'>{this.state.GoodsSeriesParams.map((item,index)=> (<span key={index}>{item.ParamName+'：'+item.ParamValue}&nbsp;&nbsp;&nbsp;</span>))}</p>:null} */}
                    {/* {this.state.GoodsAfterSale.length ? null : (
                        <a name="parameter">
                            <div></div>
                        </a>
                    )} */}
                </div>
                {this.state.goods.GoodsVoltage ? (
                    <div style={{ textIndent: "10px", border: "1px solid #F2F2F2" }}>
                        <p style={{ color: "#999999", fontSize: "13px", margin: "0", lineHeight: "36px" }}>
                            {this.state.goods.GoodsVoltage}
                            {
                                this.state.goods.GoodsSeriesParams.map(it =>
                                    <span style={{ float: "left", marginLeft: "10px" }}>容量：{this.state.goods.GoodsCapacityMin}-{this.state.goods.GoodsCapacityMax}KVA</span>
                                )
                            }
                        </p>
                    </div>
                ) : null}
                {this.state.GoodsSeriesParams.length ? (
                    <div className="serviceContainer" onClick={this.showParamsDrawer}>
                        <span style={{ color: '#999', }}>规格</span><p className="match">{this.state.ParamsString}</p><Icon type="right" />
                    </div>
                    // <Card className="GoodsParams" title={<p style={{marginBottom: '0'}}>规格<span style={{marginLeft: '20px'}}>{this.state.ParamsString}</span></p>} onClick={this.showParamsDrawer} extra={<span style={{ color: '#999' }}>更多<Icon type="right" /></span>}>
                    //     {/* <ul>
                    //         {this.state.GoodsSeriesParams.map((item, index) => (
                    //             <li key={index}><span className="ParamName">{item.ParamName}</span><span>{item.ParamValue}</span></li>
                    //         ))}
                    //     </ul> */}
                    // </Card>
                ) : null}
                {this.state.GoodsInsurance.length > 0 || this.state.GoodsAfterSale.length > 0 ? <div className="serviceContainer" onClick={this.showServiceDrawer}>
                    <span style={{ color: '#999' }}>服务</span>
                    <p style={{ display: 'inline-block' }} className="match">
                        {this.state.GoodsInsurance.length > 0 ? <span className="serviceItem" style={{ marginRight: '20px' }}>质量保障</span> : null}
                        {this.state.GoodsAfterSale.length > 0 ? <span className="serviceItem">售后服务</span> : null}
                    </p>
                    <Icon type="right" />
                </div> : null}
                {this.state.goods.GoodsSeriesMatch !== '' ? <div className="serviceContainer" onClick={this.showMatchDrawer}>
                    <span style={{ color: '#999', }}>配套</span><p className="match">{this.state.goods.GoodsSeriesMatch}</p><Icon type="right" />
                </div> : null}

                {/* {this.state.GoodsInsurance.length ? (
                    <div style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
                        <p style={{ marginTop: "10px" }}><img style={{ margin: "-4px 10px 0 0" }} alt="quality" src={quality} /><span style={{ fontSize: "14px" }}>质量保障</span></p>
                        {
                            this.state.GoodsInsurance.map((cont, index) => {
                                return (
                                    <p key={index} style={{ lineHeight: "16px", fontSize: "13px" }}>
                                        <img style={{ margin: "-5px 5px 0 5px" }} alt="dot" src={dot} />
                                        <span style={{ textAlign: "left" }}>{cont}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                ) : null}
                {this.state.GoodsAfterSale.length ? (
                    <div style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
                        <p style={{ marginTop: "10px" }}><img style={{ margin: "-4px 10px 0 0" }} alt="aftersales" src={aftersales} /><span style={{ fontSize: "14px" }}>售后服务</span></p>
                        {
                            this.state.GoodsAfterSale.map((cont, index) => {
                                return (
                                    <p key={index} style={{ lineHeight: "16px", fontSize: "13px" }}>
                                        <img style={{ margin: "-5px 5px 0 5px" }} alt="dot" src={dot} />
                                        <span style={{ textAlign: "left" }}>{cont}</span>
                                    </p>
                                )
                            })
                        }
                    </div>
                ) : null} */}
                <p style={{ color: '#999', marginTop: '10px', marginBottom: '0', textAlign: 'center' }}><Icon type="down" />上拉查看图文详情</p>
                <div>
                    {/* <a name="parameter">
                        <br/>
                        {this.state.goods.GoodsStandardIcon && this.state.goods.GoodsStandardIcon.startsWith('http')?
                            <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" >
                                <img src={this.state.goods.GoodsStandardIcon} alt='GoodsStandardIcon'/>
                            </p>
                            :<div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: this.state.goods.GoodsStandardIcon }} />
                        }
                    </a> */}

                    <a ref={this.attachDetailEle} name="details">
                        {this.state.GoodsSeriesDetail.length > 0 ? (
                            <div style={{ width: '100%' }}>
                                {this.state.GoodsSeriesDetail.map((item, index) => {
                                    return (
                                        <div key={index}>
                                            {item.startsWith('http') ?
                                                <p style={{ width: '100%' }} className="dangerouslySetInnerHTML-params" >
                                                    <img src={item} alt='GoodsSeriesDetail' />
                                                </p> :
                                                <div style={{ width: '100%' }} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: item }} />
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        ) : null}
                        {/* <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" ><img src={this.state.goods.GoodsSeriesDetail}/></p> */}
                        {/* <div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: this.state.goods.GoodsSeriesDetail }} /> */}
                    </a>
                </div>
                <Divider>END</Divider>
                <Drawer
                    title="商品规格"
                    visible={this.state.showParams}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height={this.state.height}
                    className="Params"
                    style={{
                        height: this.state.showParams ? '100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: '45px', width: '100%' }}>
                        {this.state.GoodsSeriesParams.map((item, index) => (
                            <p key={index} className="ParamsList"><span className="ParamName">{item.ParamName}</span><span>{item.ParamValue}</span></p>
                        ))}
                    </div>
                    <Button type="primary" className="close" onClick={this.close}>关闭</Button>
                </Drawer>
                <Drawer
                    title="服务承诺"
                    visible={this.state.showGoodsSeriesService}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height={this.state.serviceHeight}
                    className="Params"
                    style={{
                        height: this.state.showGoodsSeriesService ? '100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: '45px', width: '100%' }}>
                        {this.state.GoodsInsurance.length > 0 ? <div style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
                            <p style={{ marginTop: "10px" }}><img style={{ margin: "-4px 10px 0 0" }} alt="quality" src={quality} /><span style={{ fontSize: "14px" }}>质量保障</span></p>
                            {
                                this.state.GoodsInsurance.map((cont, index) => {
                                    return (
                                        <p key={index} style={{ lineHeight: "16px", fontSize: "13px" }}>
                                            <img style={{ margin: "-5px 5px 0 5px" }} alt="dot" src={dot} />
                                            <span style={{ textAlign: "left" }}>{cont}</span>
                                        </p>
                                    )
                                })
                            }
                        </div> : null}
                        {this.state.GoodsAfterSale.length > 0 ? <div style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
                            <p style={{ marginTop: "10px" }}><img style={{ margin: "-4px 10px 0 0" }} alt="aftersales" src={aftersales} /><span style={{ fontSize: "14px" }}>售后服务</span></p>
                            {
                                this.state.GoodsAfterSale.map((cont, index) => {
                                    return (
                                        <p key={index} style={{ lineHeight: "16px", fontSize: "13px" }}>
                                            <img style={{ margin: "-5px 5px 0 5px" }} alt="dot" src={dot} />
                                            <span style={{ textAlign: "left" }}>{cont}</span>
                                        </p>
                                    )
                                })
                            }
                        </div> : null}

                    </div>
                    <Button type="primary" className="close" onClick={this.close}>关闭</Button>
                </Drawer>
                <Drawer
                    title="商品配套"
                    visible={this.state.showGoodsSeriesMatch}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    className="Params"
                    style={{
                        height: this.state.showGoodsSeriesMatch ? '100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ textAlign: 'left', marginTop: '20px', padding: '10px 15px' }}>
                        <p>{this.state.goods.GoodsSeriesMatch !== '' ? this.state.goods.GoodsSeriesMatch : '无'}</p>
                    </div>
                    <Button type="primary" className="close" onClick={this.close}>关闭</Button>
                </Drawer>
                {/* <p onClick={this.downloadApp}>
                    <img style={{ width: "100%" }} alt="share" src={share} />
                </p> */}
            </div >
        );
    }
}
export default withRouter(GoodDetails);
