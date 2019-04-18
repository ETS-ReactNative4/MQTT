import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './mall_index.css';
import { Carousel, Row, Col, Button, message} from 'antd';
import dingdanb from '../../assets/mall/dingdanb.png';
import dingdanIcon from '../../assets/mall/dingdanicon.png';
import huiyuanb from  '../../assets/mall/huiyuanb.png';
import huiyuanIcon from '../../assets/mall/huiyuanicon.png';
import kefub from  '../../assets/mall/kefub.png';
import kefuIcon from '../../assets/mall/kefuicon.png';
import arrowDown from '../../assets/mall/jiantou_fenlei01.png';
import arrowUp from '../../assets/mall/jiantou_fenlei02.png';
import SeriesItem from '../../components/series-item';
import Http from '../../service/Http';
import Url from '../../service/Url';
import User from '../../service/User';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
    type: 0,
    CarouselImgs: [],
    AllCate: [],
    ShowCate: [],
    arrowDown: true,
    activeCate: {
        CategoryCId: '',
        CategoryName: '全部'
    },
    GoodsSeriesList: [],
    fold: true,
    position: 'relative',
    top: 0,
    fontSize: '13px'
}
class MallIndex extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
            CarouselImgs: [],
            AllCate: [],
            ShowCate: [],
            arrowDown:true,
            activeCate: {
                CategoryCId: '',
                CategoryCName: '全部'
            },
            GoodsSeriesList: [
                {
                    GoodsSeriesTitle: 'S11硅钢油浸式变压器',
                    GoodsSeriesCode: '0001',
                    IsStandard: '0',
                    GoodsPrice: '14647.97',
                    GoodsSeriesIcon: 'http://placehold.it/100x100'
                }
            ],
            fold:true,
            position: 'relative',
            top: 0,
            fontSize: '13px'
        };
    }
    scrollListener = () => {
        const dScrollTop = document.documentElement.scrollTop ||  window.pageYOffset;
        if (dScrollTop > 125) {
            this.setState({
                position: 'fixed',
                top: 0
            });
        } else {
            this.setState({
                position: 'relative',
                top:0
            })
        }
        
    }
    componentWillMount() {
        // window.onscroll = this.scrollListener;
        
        // this.getAds();
        // this.getCate();
        // alert(window.XMLHttpRequest)
    }
    
    componentDidMount() {
        this.getAds();
        this.getCate();
        // sessionStorage.setItem('Access_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVOdW1iZXIiOiIxODM2Mjk4MTEyNyIsImNsaWVudF9pZCI6IjBCQjg0NzJBMjM5NDExRTlBQ0Y3MDAxNjNFMDA3MEREIiwicmFuZG9tIjo0NSwidXNlcklkIjoiZjMxNTdhZmMtMDI3MC0xMWU4LTg2Y2UtMDAxNjNlMDA3MGRkIiwiZXhwIjoxNTUwNTgyNjI2LCJncmFudF90eXBlIjoiYWNjZXNzX3Rva2VuIn0.YHekOWiEtfC3R0IvJHeEvH5W-SSvB3Q1tS51TnFN0yk')
    }
    
    getAds = async() => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl +`/web/mainpage/third`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        this.setState({
            CarouselImgs: data.length ? data: [{TurnUrl: '', PicUrl: ''}]
        });
    }
    getCate = async() => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl +`/app/category_c?CategoryBId=001-002`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        const arr = [];
        if (data && data.length > 0) {
            data.map(it => {
                const obj = {
                    CategoryCId: it.CategoryCId,
                    CategoryCName: it.CategoryCName
                };
                arr.push(obj);
            });
            this.setState({
                AllCate: data
            });
            if (this.state.fold) {
                const clientWidth = window.innerWidth;
                // alert(clientWidth)
                if (clientWidth <=320) {
                    this.setState({
                        fontSize: '10px'
                    });
                } else {
                    this.setState({
                        fontSize: '13px'
                    });
                }
                arr.splice(4, arr.length-4);
            }
            arr.unshift({CategoryCId: '', CategoryCName: '全部'});
            this.setState({
                ShowCate: arr
            });
            this.getSeries('');
        }
    }
    getSeries = async(CategoryCId) => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl +`/app/series/recommend?CategoryBId=001-002&CategoryCId=` + CategoryCId);
        if (code !== Http.ok) {
            return message.error(info);
        }
        this.setState({
            GoodsSeriesList: data
        });
    }
    changeCate = (item, index) => {
        this.setState({
            activeCate: {
                CategoryCId: item.CategoryCId,
                CategoryCName: item.CategoryCName
            }
        });
        if (item.CategoryCId!=='') {
            let arr = [];
            if (this.state.fold) {
                arr = this.state.ShowCate;
            } else {
                arr = this.state.AllCate;
            }
            arr.shift();
            arr.splice(index-1,1);
            arr.splice(0,0, item);
            
            if (this.state.fold) {
                arr.unshift({
                    CategoryCId: '',
                    CategoryCName:'全部'
                })
            }
            
            
        }
        this.getSeries(item.CategoryCId);
    }
    unfold = () => {
        const state = this.state.fold;
        const arr = []; 
        this.state.AllCate.map(it => {
            const obj ={
                CategoryCId:it.CategoryCId, 
                CategoryCName: it.CategoryCName
            }
            arr.push(obj); 
        });
        if (state) {
            console.log(arr);
            // arr.unshift({CategoryCId: '', CategoryCName: '全部'});
            this.setState({
                ShowCate: arr,
                position: 'fixed',
                top: 0
            });
        } else {
            if (arr[0].CategoryCId !==''){
                arr.unshift({CategoryCId: '', CategoryCName: '全部'});
            }
            // const clientWidth = window.innerWidth;
            // if (clientWidth <375) {
            //     arr.splice(4, arr.length-4);
            // } else {
                
            // }
            arr.splice(5, arr.length-5);
            this.setState({
                ShowCate: arr,
                position: 'relative',
                top:0
            });
            // arr.unshift({CategoryCId: '', CategoryCName: '全部'});
        }
        this.setState({fold: !state});
        
    }
    toVip = () => {
        this.props.history.push('/mallVip');
    }
    toOrder = () => {
        this.props.history.push('/mallCenterOrder');
    }
    toChat = () => {
        this.props.history.push('/mallChatting');
    }

    render() {
        return (
            <div className='mall_index' style={{height: '100%'}}>
                <div className="carousel_container" style={{ width: '100%'}}>
                    <Carousel autoplay={true}>
                        {this.state.CarouselImgs.map((item, index) => (<div key={index}>
                            <a href={item.TurnUrl} target="_blank">
                                <img src={item.PicUrl !== '' ? item.PicUrl: 'http://placehold.it/200x200'} style={{ height: 200, margin: '0 auto' }} alt="GoodsSeriesImg" />
                            </a>
                        </div>))}
                    </Carousel>
                </div>
                <div className="Icon_container">
                    <Row style={{ height: '3.5rem', color: '#FFF'}}>
                        <Col onClick={this.toOrder} span={10} style={{ backgroundImage: `url(${dingdanb})`, height: '100%', lineHeight: '3.5rem', textAlign: 'center' }}><span><img className="icon" src={dingdanIcon}/>我的订单</span></Col>
                        {/* <Col onClick={this.toVip} span={8} style={{ backgroundImage: `url(${huiyuanb})`, height: '100%', lineHeight: '3.5rem', textAlign: 'center' }}><span><img className="icon" src={huiyuanIcon}/>我的会员</span></Col> */}
                        <Col onClick={this.toChat} span={10} style={{ backgroundImage: `url(${kefub})`, height: '100%', lineHeight: '3.5rem', textAlign: 'center' }}><span><img className="icon" src={kefuIcon}/>客服</span></Col>
                    </Row>
                </div>
                <div className={this.state.fold ? 'cate_container fold': 'cate_container'} style={{position: this.state.position, top: this.state.top}}>
                    {this.state.fold ?'': 
                    <p className="select_tip">请选择品类
                        <img style={{position: 'absolute', right: '10px', marginTop: '10px'}} className="arrow" src={arrowUp} onClick={this.unfold}/>
                    </p>}
                    {this.state.fold ? <ul className="fold_cate">
                        {this.state.ShowCate.map((it, index) => (<li key={index}>
                            <Button style={{fontSize: this.state.fontSize}} onClick={this.changeCate.bind(this, it, index)} className={this.state.activeCate.CategoryCId===it.CategoryCId? 'active': ''}>{it.CategoryCName}</Button>
                        </li>))} 
                        {this.state.fold ? <img className="arrow" src={arrowDown} onClick={this.unfold}/>:''}
                    </ul>:<ul className="cate">
                        {this.state.ShowCate.map((it, index) => (<li key={index} style={{fontSize: this.state.fontSize}} onClick={this.changeCate.bind(this, it, index)} className={this.state.activeCate.CategoryCId===it.CategoryCId? 'active': ''}>
                            {it.CategoryCName}
                        </li>))} 
                    </ul>}
                </div>
                <div className="series_container" style={{marginBottom: '50px'}}>
                    {this.state.GoodsSeriesList.map((it, index)=> (
                        <SeriesItem series={it} key={index} {...this.props}/>
                    ))}
                </div>
            </div>
        );
    }
}
export default withRouter(MallIndex);