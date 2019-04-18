import * as React from 'react';
import './goods-details.css';
import { Tabs, Card, Divider, message, Carousel } from 'antd';
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

class GoodDetails extends React.Component{

    display = "block";
    img = null;

    componentDidMount(){
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
    downloadApp= () => {
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

    callback = (key) => {
        switch (key) {
            case "good":
                this.setState({ activeModel: 1 });
                break;
            case "parameter":
                this.setState({ activeModel: 2 });
                break;
            case "details":
                this.setState({ activeModel: 3 });
                break;
        }
        this.setState({ activeKey: key });
        if (window.location.href.indexOf("#") === -1) {
            window.location.href = window.location.href + '#' + key;
        } else {
            window.location.href = window.location.href.slice(0, window.location.href.indexOf("#")) + '#' + key;
        }
    }
    // scrollListener = () => {
    //     let abs = document.getElementsByClassName("ant-tabs-nav")[0].children;
    //     for (let ibs = 0; ibs < abs.length; ibs++) {
    //         abs[ibs].style.color = "#111111";
    //     }
    //     document.getElementsByClassName("ant-tabs-tab-active")[0].style.color = "#4DBECD";
    //     var parameterHight = document.getElementsByName("parameter")[0].offsetTop;
    //     var detailsHight = document.getElementsByName("details")[0].offsetTop;
    //     if (document.documentElement.scrollTop < parameterHight) {
    //         this.setState({ activeKey: "good" });
    //     } else if (parameterHight - 400 < document.documentElement.scrollTop) {
    //         if (document.documentElement.scrollTop < detailsHight) {
    //             this.setState({ activeKey: "parameter" });
    //         } else {
    //             this.setState({ activeKey: "details" });
    //         }
    //     }
    // }
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
            GoodsSeriesParams:[],
            GoodsSeriesPhotos:[],
            GoodsSeriesDetail:[],
        };
    }
    async componentWillMount() {
        const cid = this.props.match.params.code;
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,

        } = await Http.get(Url.baseUrl+`/app/make/series/detail?GoodsSeriesCode=${cid}`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        data.GoodsSeriesKeywordList = data.GoodsSeriesKeywords?data.GoodsSeriesKeywords.split('|'):[];
        data.GoodsSeriesParams = data.GoodsSeriesParams ? JSON.parse(data.GoodsSeriesParams) : [];
        console.log(data.GoodsSeriesParams)
        data.GoodsSeriesPhotos = data.GoodsSeriesPhotos?JSON.parse(data.GoodsSeriesPhotos): [];
        try {
            data.GoodsQuality = data.GoodsQuality.replace(/\n/g, "");
            data.GoodsQuality = data.GoodsQuality ? JSON.parse(data.GoodsQuality) : [];
        } catch (e) {
            data.GoodsQuality = []
        }
        try {
            data.GoodsAfterSale = data.GoodsAfterSale.replace(/\n/g, "");
            data.GoodsAfterSale = data.GoodsAfterSale ? JSON.parse(data.GoodsAfterSale) : [];
        } catch (e) {
            data.GoodsAfterSale = []
        }
        console.log(data.GoodsSeriesDetail)
        const arr = [];
        if (!data.GoodsSeriesDetail.startsWith('[')) {
            arr.push(data.GoodsSeriesDetail)
        }
        this.setState({
            goods: data,
            GoodsSeriesKeywordList: data.GoodsSeriesKeywordList.length>4?data.GoodsSeriesKeywordList.splice(0,4):data.GoodsSeriesKeywordList,
            GoodsInsurance: data.GoodsQuality,
            GoodsAfterSale: data.GoodsAfterSale,
            isApp: this.props.match.params.isApp!==undefined?true:false,
            GoodsSeriesParams: data.GoodsSeriesParams,
            GoodsSeriesPhotos: data.GoodsSeriesPhotos,
            GoodsSeriesDetail: data.GoodsSeriesDetail.startsWith('[')?JSON.parse(data.GoodsSeriesDetail):arr,
            CategoryBId: data.CategoryBId,
            GoodsSeriesCode: data.GoodsSeriesCode
        });
        
        window.onscroll = this.scrollListener;
    }

    getVal = () => {
        if (this.state.goods.CategoryId && this.state.goods.CategoryId.length > 3) {
            return this.state.goods.CategoryId.substring(0, 3) === "001" ? this.state.goods.GoodsAddValue : this.state.goods.GoodsAddValue2
        }
        return ""
    }
    callApp =() => {
        message.info('亲，请先下载我们的APP才可以开通会员享受优惠哦~')
    }

    render() {
        return (
            <div style={{display: this.display}}>
                {/* <div style={{ width: "100%", height: "30px", backgroundColor: "#ffffff" }}></div> */}
                {/* <Tabs activeKey={this.state.activeKey} size="default" onChange={this.callback}>
                    <TabPane tab="商品" key="good"></TabPane>
                    <TabPane tab="参数" key="parameter"></TabPane>
                    <TabPane tab="详情" key="details"></TabPane>
                </Tabs> */}
                {/* <a name="good">
                    <Carousel autoplay={true} >
                        {this.state.GoodsSeriesPhotos.map((item,index)=> (<div key={index}>
                        <img src={item}  style={{ height:215,margin:'0 auto' }} alt="GoodsSeriesImg"/>
                        </div>))}
                    </Carousel>
                    <img style={{ width: "100%" }} alt="GoodsSeriesImg" src={this.state.goods.GoodsSeriesPhotos} 
                    ref = {r => this.img = r}
                    />
                    {this.state.isApp?null:<img src={download} style={{ position: 'fixed', right: '0',height: '115px',top: '70px',zIndex:9999}}  onClick={this.downloadApp}/>}
                    
                    
                    {this.state.GoodsSeriesKeywordList[0] !== "" ? (
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
                </a> */}
                {/* <div style={{ paddingLeft: "10px" }}>
                    <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0" }}>{this.state.goods.GoodsSeriesName}</p>
                    <p style={{ color: "#5ebecd", fontSize: "20px", margin: "0" }}>
                        {this.state.goods.PriceRange}
                        <span style={{ float: "right", marginRight: "10px", fontSize: "13px", color: "#999999" }}>
                            月销量：{this.state.goods.GoodsSale}笔</span>
                    </p>
                    <p style={{ color: "#ffc358", fontSize: "12px", margin: "0" }}>{
                        this.getVal()
                    }</p>
                    <p className='vipinfo'><img src={vip} style={{width:26,margin:'-2px 10px 0px'}}/>开通会员，下单最高享<span style={{color:'#F8695D'}}>{9.7}折</span>优惠<span style={{color:'#F8695D',float:'right',marginRight:20}}>></span></p>
                    {this.state.GoodsSeriesParams.length?<p className='GoodsSeriesParams'>{this.state.GoodsSeriesParams.map((item,index)=> (<span key={index}>{item.ParamName+'：'+item.ParamValue}&nbsp;&nbsp;&nbsp;</span>))}</p>:null}
                    {this.state.GoodsAfterSale.length ? null : (
                        <a name="parameter">
                            <div></div>
                        </a>
                    )}
                </div> */}
                {/* {this.state.goods.GoodsVoltage ? (
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
                {this.state.GoodsInsurance.length ? (
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
                <div>
                    {/* <a name="parameter">
                        {this.state.goods.GoodsStandardIcon && this.state.goods.GoodsStandardIcon.startsWith('http')?
                            <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" >
                                <img src={this.state.goods.GoodsStandardIcon} alt='GoodsStandardIcon'/>
                            </p>
                            :<div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: this.state.goods.GoodsStandardIcon }} />
                        }
                    </a> */}
                    
                    <a name="details">
                        {this.state.GoodsSeriesDetail.length>0?(
                            <div style={{width: '100%'}}>
                                {this.state.GoodsSeriesDetail.map((item,index) => {
                                    return (
                                        <div key={index}>
                                            {item.startsWith('http')?
                                            <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" >
                                                <img src={item} alt='GoodsSeriesDetail'/>
                                            </p>:
                                            <div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: item}} />
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        ): null}
                        {/* {this.state.GoodsSeriesDetail && this.state.goods.GoodsSeriesDetail.startsWith('http')?
                            <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" >
                                <img  src={this.state.goods.GoodsSeriesDetail} alt='GoodsSeriesDetail'/>
                            </p>
                            :<div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: this.state.goods.GoodsSeriesDetail }} />
                        } */}
                        {/* <p style={{width: '100%'}} className="dangerouslySetInnerHTML-params" ><img src={this.state.goods.GoodsSeriesDetail}/></p> */}
                        {/* <div style={{width: '100%'}} className="dangerouslySetInnerHTML-params" dangerouslySetInnerHTML={{ __html: this.state.goods.GoodsSeriesDetail }} /> */}
                    </a>
                </div>
                {/* <Divider>END</Divider> */}
                {/* <p onClick={this.downloadApp}>
                    <img style={{ width: "100%" }} alt="share" src={share} />
                </p> */}
            </div >
        );
    }
}
export default withRouter(GoodDetails);