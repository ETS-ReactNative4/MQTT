import * as React from 'react';
import './mall_goodsdetail.css';
import { Tabs, Card, Divider, message, Carousel, Button, Drawer, Icon, Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import Http from '../../service/Http';
import star from '../../assets/img/tezhengstar.png';
import share from '../../assets/img/fenxiang.png';
import quality from '../../assets/img/zhiliangbaozhang-icon.png';
import aftersales from '../../assets/img/shouhoufuwu-icon.png';
import dot from '../../assets/img/yuandian6x6.png';
import download from '../../assets/using-help/download.png';
import huiyuan from '../../assets/mall/huiyuan20_16.png';
import orderQty from '../../assets/mall/shuliang.png';
import Url from '../../service/Url';
import { appStore } from '../app.store';
import * as uuidv1 from "uuid/v1";

const TabPane = Tabs.TabPane;

class MallGoodsDetail extends React.Component {

    display = "block";
    img = null;
    titleEle = null;

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
        const detailsHight = this.detailEle && this.detailEle.offsetTop;
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
            GoodsAllHeight: '80%',
            ParamsHeight: '200',
            MainHeight: '400',
            IconWidth: '120',
            MenuList: [],
            LastMenuList: [],
            AddService: [],
            AddServiceInfo: [],
            ShowAddService: false,
            showGoodsAll: false,
            Product_dict: [],
            Selected: [],
            OrderQty: 0
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
        data.GoodsSeriesKeywordList = data.GoodsSeriesKeywords ? data.GoodsSeriesKeywords.split('|').filter(it => it!== '') : [];
        data.GoodsSeriesParams = data.GoodsSeriesParams ? JSON.parse(data.GoodsSeriesParams) : [];
        data.GoodsSeriesPhotos = data.GoodsSeriesPhotos ? JSON.parse(data.GoodsSeriesPhotos) : [];
        try {
            data.GoodsQuality = this.IsNull(data.GoodsSeriesQuality) || data.GoodsSeriesQuality == '' ? data.GoodsQuality : data.GoodsSeriesQuality;
            data.GoodsQuality = data.GoodsQuality ? JSON.parse(data.GoodsQuality) : [];
        } catch (e) {
            data.GoodsQuality = []
        }
        try {
            data.GoodsAfterSale = this.IsNull(data.GoodsSeriesAfterSale) || data.GoodsSeriesAfterSale == '' ? data.GoodsAfterSale : data.GoodsSeriesAfterSale;
            data.GoodsAfterSale = data.GoodsAfterSale ? JSON.parse(data.GoodsAfterSale) : [];
        } catch (e) {
            data.GoodsAfterSale = []
        }
        const arr = [];
        if (!data.GoodsSeriesDetail.startsWith('[')) {
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
            OrderQty: data.GoodsSeriesSetNum
        });
        window.onscroll = this.scrollListener;
        const height = (this.state.GoodsSeriesParams.length + 1) * 45 + 55;
        this.setState({
            height: height
        });
        const insuranceLth = this.state.GoodsInsurance.length;
        const afterLth = this.state.GoodsAfterSale.length;
        const serviceHeight = 120 + insuranceLth * 26 + afterLth * 26 + (insuranceLth > 0 ? 41 : 0) + (afterLth > 0 ? 41 : 0);
        console.log(serviceHeight)
        const clientWidth = window.innerWidth;
        this.setState({
            serviceHeight: serviceHeight,
            IconWidth: Math.floor(clientWidth*120/375)
        });
        this.getParam();
    }

    getVal = () => {
        // console.log(this.state.goods);
        if (this.state.goods.CategoryId && this.state.goods.CategoryId.length > 3) {
            return this.state.goods.CategoryId.substring(0, 3) === "001" ? this.state.goods.GoodsAddValue : this.state.goods.GoodsAddValue2
        }
        return ""
    }
    getParam = async() => {
        const cid = this.props.match.params.code;
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/app/make/series/goodsall?GoodsSeriesCode=`+cid);
        if (code !== Http.ok) {
            return message.error(info);
        }
        data.menu_list.map(item => {
            item.ParamOptionalMap = [];
            data.product_dict.index.map(it => {
                data.product_dict[it].Specs.index.map(oItem => {
                    const d = data.product_dict[it].Specs[oItem];
                    if (d.ParamId == item.ParamId) {
                        const obj = {
                            ParamId: item.ParamId,
                            ParamOptionalId: d.ParamOptionalId,
                            ParamOptionalName: d.ParamOptionalName,
                            Disabled: false,
                            Active: false
                        };
                        const list = item.ParamOptionalMap.filter(param => {
                            return this.isObjEqual(param, obj);
                        });
                        if (list.length === 0) {
                            item.ParamOptionalMap.push(obj);
                        }
                    }
                });
            })
            if (item.ParamOptionalMap.length === 1) {
                item.ParamOptionalMap[0].Active = true;
            }
        })
        console.log(data.menu_list);
        this.setState({
            MenuList: data.menu_list,
            Product_dict: data.product_dict,
        });
        if (data.product_dict.index.length === 1) {
            const a = [];
            a.push(data.product_dict[data.product_dict.index[0]]);
            this.setState({
                Selected: a
            });
        }
        console.log(this.state.MenuList)
        console.log(data.product_dict);
        const totalHeight = window.innerHeight*0.8;
        this.setState({
            ParamsHeight: totalHeight - 110 -129 +'',
            MainHeight: totalHeight -130 + ''
        })
        // const titleBottom = this.titleEle.offsetBottom;
        // console.log(titleBottom);

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
    showGoodsAll = () => {
        this.setState({
            showGoodsAll: true
        });
    }
    toChat = () => {
        this.props.history.push('/mallChatting/' + this.state.goods.GoodsSeriesCode + '/' + 'goods');
    }
    sendGoodsItem = () => {
        console.log(this.state.goods);
        const s = appStore;
        this.props.history.push('/mallChatting');
        const obj ={
            photo: this.state.GoodsSeriesPhotos[0],
            GoodsPriceMin: this.state.goods.GoodsPriceMin,
            GoodsSeriesName: this.state.goods.GoodsSeriesName,
            GoodsSeriesCode: this.state.GoodsSeriesCode,
            IsStandard: this.state.goods.IsStandard
        }
        if (s.client == null || s.client == undefined) {
            s.connet();
        }
        s.sendGoods(obj);
        
    }
    // JPush 发送商品
    sendGoods = async() => {
        const goodsData = {
            MsgContent: this.state.GoodsSeriesCode,
            MsgType: 'Goods',
            MsgNo: uuidv1(),
            CategoryBId: '001-002'
        };
        // const {
        //     ResultCode: code,
        //     ResultInfo: info,
        //     Data: Data
        // } = await Http.post(Url.baseUrl + '/app/gyb/customer/jmsg', {
        //     MsgContent: this.state.GoodsSeriesCode,
        //     MsgType: 'Goods',
        //     MsgNo: uuidv1(),
        //     CategoryBId: '001-002'
        // });
        // if (code !== 0) {
        //     return message.error(info);
        // }
        this.props.history.push('/mallChatting');
        sessionStorage.setItem('OrderData', JSON.stringify(goodsData));
    }
    backTo = () => {
        this.setState({
            AddServiceInfo: [],
            ShowAddService: false
        });
    }
    MakeSure = () => {
        const arr = this.state.AddServiceInfo;
        const addservice = this.state.AddService;
        const NameList = [];
        addservice.map(it => {
            NameList.push(it.GoodsType);
        });
        const appendixList = arr.filter(it => {
            return it.GoodsType === '2';
        });
        const brandList = arr.filter(it => {
            return it.GoodsType === '3';
        });
        if((appendixList.length === 0 && NameList.indexOf('2') !== -1)) {
            return message.info('请选择附件');
        }
        if((brandList.length === 0 && NameList.indexOf('3') !== -1)) {
            return message.info('请选择品牌');
        }
        this.setState({
            ShowAddService: false
        })
    }
    toVip = () => {
        this.props.history.push('/mallVip');
        // const ua = navigator.userAgent.toLowerCase();
        // if (ua.indexOf("micromessenger") !== -1) {
        //     alert('微信请在右上角浏览器打开！')
        //     return;
        // }
        // if (ua.indexOf('iPhone') !== -1) {
        //     window.location = 'emake://emake.user';
        //     setTimeout(() => {
        //         window.location = 'https://itunes.apple.com/cn/app/id1260429389';
        //     }, 500)
        // } else if (ua.indexOf('android') !== -1) {
        //     window.location = 'emake://emake.user';
        //     setTimeout(() => {
        //         window.location = 'http://www.emake.cn/download/';
        //     }, 500)
        // } else {
        //     window.location = 'http://www.emake.cn/download/';
        // }
    }
    close = () => {
        this.setState({
            showParams: false,
            showGoodsSeriesService: false,
            showGoodsSeriesMatch: false,
            showGoodsAll: false
        })
    }
    isObjEqual = (o1, o2) => {
        const props1 = Object.getOwnPropertyNames(o1);
        const props2 = Object.getOwnPropertyNames(o2);
        if (props1.length !== props2.length) {
            return false;
        }
        for (let i = 0, max = props1.length; i < max; i++) {
            const propName = props1[i];
            if (o1[propName] !== o2[propName]) {
                return false;
            }
        }
        return true;
    }
    setClassName = (it, item) => {
        let className = '';
        if (it.ParamOptionalMap.length === 1) {
            className = 'selectBtn active';
        } else {
            const selected = this.state.Selected;
            console.log(selected);
            selected.map(goods => {
                goods.Specs.index.map(spec => {
                    if (goods.Specs[spec].ParamOptionalId === item.ParamOptionalId) {
                        className = 'selectBtn active';
                    } else {
                        className = 'selectBtn';
                    }
                });
            });
        }
        return className;
    }
    filterGoods = (data) => {
        let product = this.state.Product_dict;
        let goods = [];
        let lastMenuList = [];
        product.index.map(it => {
            product[it].Specs.index.map(oItem => {
                if (oItem === data.ParamId && product[it].Specs[oItem].ParamOptionalId === data.ParamOptionalId) {
                    goods.push(product[it]);
                }
            });
        });
        console.log(goods)
        goods.map(it => {
            const obj ={};
            it.Specs.index.map(item => {
                const obj ={
                    Disabled: false,
                    Active: false,
                    ParamId: item,
                    ParamOptionalName: it.Specs[item].ParamOptionalName,
                    ParamOptionalId: it.Specs[item].ParamOptionalId
                };
                const list = lastMenuList.filter(param => {
                    return this.isObjEqual(param, obj);
                });
                if (list.length === 0) {
                    lastMenuList.push(obj);
                }
            })
        });
        this.state.MenuList.map(it => {
            it.ParamOptionalMap.map(oItem => {
                if (it.ParamId !== data.ParamId) {
                    oItem.Disabled = true;
                    lastMenuList.map(item => {
                        if (it.ParamId === item.ParamId && oItem.ParamOptionalId === item.ParamOptionalId) {
                            oItem.Disabled = false;
                        }
                        
                    })
                }
                if (oItem.ParamOptionalId !== data.ParamOptionalId) {
                    oItem.Active = false;
                }
                
            });
            const list = it.ParamOptionalMap.filter(map => {
                return !map.Disabled;
            });
            if (list.length === 1) {
                list[0].Active = true;
            }
            
        });
        this.setState({
            Selected: goods,
            LastMenuList: lastMenuList
        });
    }
    filterLastGoods = (data) => {
        let product = this.state.Selected;
        let goods = [];
        let lastMenuList = [];
        product.map(it => {
            it.Specs.index.map(oItem => {
                if (oItem === data.ParamId && it.Specs[oItem].ParamOptionalId === data.ParamOptionalId) {
                    goods.push(it);
                }
            })
        });
        console.log(goods)
        goods.map(it => {
            const obj ={};
            it.Specs.index.map(item => {
                const obj ={
                    Disabled: false,
                    Active: false,
                    ParamId: item,
                    ParamOptionalName: it.Specs[item].ParamOptionalName,
                    ParamOptionalId: it.Specs[item].ParamOptionalId
                };
                const list = lastMenuList.filter(param => {
                    return this.isObjEqual(param, obj);
                });
                if (list.length === 0) {
                    lastMenuList.push(obj);
                }
            })
        });
        console.log(lastMenuList);
        // this.state.MenuList.map(it => {
        //     it.ParamOptionalMap.map(oItem => {
        //         // if (it.ParamId !== data.ParamId) {
        //         //     oItem.Disabled = true;
        //         //     lastMenuList.map(item => {
        //         //         if (it.ParamId === item.ParamId && oItem.ParamOptionalId === item.ParamOptionalId) {
        //         //             oItem.Disabled = false;
        //         //         }
                        
        //         //     })
        //         // }
        //         if (oItem.ParamOptionalId !== data.ParamOptionalId) {
        //             oItem.Active = false;
        //         }
                
        //     });
        //     const list = it.ParamOptionalMap.filter(map => {
        //         return !map.Disabled;
        //     });
        //     if (list.length === 1) {
        //         list[0].Active = true;
        //     }
            
        // });
        this.setState({
            Selected: goods,
            LastMenuList: lastMenuList
        });
    }
    getTotalPrice = () => {
        let GoodsPrice = this.state.Selected.length === 1 ? this.state.Selected[0].GoodsPrice: 0;
        this.state.AddServiceInfo.map(it => {
            GoodsPrice+=it.GoodsType === '2' ? it.GoodsPrice: it.GoodsPrice*GoodsPrice;
        });
        return '￥'+ GoodsPrice.toFixed(2);
    }
    getTotalVipPrice = () => {
        let GoodsPrice = this.state.Selected.length === 1 ? this.state.Selected[0].GoodsPrice: 0;
        this.state.AddServiceInfo.map(it => {
            GoodsPrice+=it.GoodsPrice;
        });
        GoodsPrice = Math.round(GoodsPrice*97)/100;
        return '￥'+ GoodsPrice;
    }
    getBrandPrice = (GoodsPrice, BrandPrice) => {
        return Math.floor(GoodsPrice* BrandPrice*100)/100;
    }
    selectGoods = (data,e) => {
        if (data.Disabled || data.Active) {
            return;
        }
        const arr = e.target.parentNode.childNodes;
        arr.forEach((ais) => {
            ais.className="ant-btn selectBtn";
        });
        const node = e.target;
        node.className="ant-btn selectBtn active";
        data.Active = true;
        if (this.state.Selected.length === 0 || this.state.LastMenuList.length === 0) {
            this.filterGoods(data);
        } else {
            console.log(this.state.Selected);
            console.log(this.state.LastMenuList);
            const list = this.state.LastMenuList.filter(it => {
                return it.ParamOptionalId === data.ParamOptionalId;
            });
            if (list.length === 0) {
                this.filterGoods(data);
            } else {
                this.filterLastGoods(data);
            }
        }
        
    }
    selectAddService = (GoodsList, GoodsType, item, e) => {
        console.log(GoodsList, GoodsType, item);
        let addServiceInfo = this.state.AddServiceInfo;
        if (GoodsType === '2') {
            if (item.ProductId === '') {
                const arr = e.target.parentNode.childNodes;
                arr.forEach((ais: any) => {
                    ais.style.color = "#333";
                    ais.style.border = '1px solid #E4E4E4';
                });
            } else {
                const list = addServiceInfo.filter(it => {
                    return it.ProductId === '' && it.GoodsType === GoodsType;
                });
                if (list.length >0) {
                    const arr = e.target.parentNode.childNodes;
                    arr.forEach((ais: any) => {
                        ais.style.color = "#333";
                        ais.style.border = '1px solid #E4E4E4';
                    });
                }
            }
            e.target.style.color = '#4bbdcc';
            e.target.style.border = "1px solid #4DBECD";
            
        } else {
            const arr = e.target.parentNode.childNodes;
            arr.forEach((ais: any) => {
                ais.style.color = "#333";
                ais.style.border = '1px solid #E4E4E4';
            }); 
            e.target.style.color = '#4bbdcc';
            e.target.style.border = "1px solid #4DBECD";
        }
        if (GoodsType === '2') {
            if (item.ProductId === '') {
                addServiceInfo = addServiceInfo.filter(it => {
                    return it.GoodsType !== GoodsType
                });
            } else {
                addServiceInfo = addServiceInfo.filter(it => {
                    return it.GoodsType !== GoodsType ||  (it.GoodsType === GoodsType && it.ProductId !== '')
                });
            }
            const list = addServiceInfo.filter(it => {
                return this.isObjEqual(it, item);
            });
            if (list.length === 0) {
                addServiceInfo.push(item);
            } else {
                addServiceInfo.map((it, index) => {
                    if (it.ProductId === item.ProductId) {
                        addServiceInfo.splice(index, 1);
                    }
                })
                e.target.style.color = '#333';
                e.target.style.border = '1px solid #E4E4E4';
            }
            
        } else {
            if (item.ProductId === '') {
                addServiceInfo = addServiceInfo.filter(it => {
                    return it.GoodsType !== GoodsType
                });
            } else {
                addServiceInfo = addServiceInfo.filter(it => {
                    return it.GoodsType !== GoodsType
                });
            }
            const list = addServiceInfo.filter(it => {
                return this.isObjEqual(it, item);
            });
            if (list.length === 0) {
                addServiceInfo.push(item);
            }
        }
        this.setState({
            AddServiceInfo: addServiceInfo
        });
        console.log(addServiceInfo);
    }
    qtyAdd = () => {
        let qty = this.state.OrderQty;
        qty++;
        this.setState({
            OrderQty: qty
        });
    }
    qtyPlus = () => {
        let qty = this.state.OrderQty;
        if (qty > this.state.goods.GoodsSeriesSetNum) {
            qty--;
            this.setState({
                OrderQty: qty
            });
        } else {
            this.setState({
                OrderQty: this.state.goods.GoodsSeriesSetNum
            });
        }
    }
    showAddService = () => {
        this.setState({
            ShowAddService: true,
            AddServiceInfo: []
        })
    }
    getAddService = async() => {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/app/make/addservice`, {
            ProductId: this.state.Selected[0].ProductId
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.length > 0) {
            data.map(it => {
                it.GoodsList.map(item => {
                    item.GoodsType = it.GoodsType;
                });
                it.GoodsList.push({
                    GoodsTitle: '无',
                    GoodsPrice: 0,
                    ProductId: '',
                    GoodsType: it.GoodsType
                })
            });
            this.setState({
                AddService: data,
                ShowAddService:true
            });
            if (this.state.AddServiceInfo.length === 0) {
                const parentNodes = document.getElementsByClassName('addService');
                const nodes = parentNodes.length > 0 ? parentNodes[0].childNodes : [];
                if (parentNodes.length >1) {
                    const children = parentNodes[1].childNodes;
                    children.forEach(ais => {
                        ais.style.color = "#333";
                        ais.style.border = '1px solid #E4E4E4';
                    });
                }
                nodes.forEach(ais => {
                    ais.style.color = "#333";
                    ais.style.border = '1px solid #E4E4E4';
                });
                
            }
        } else {
            const ProductIds = [
                {ProductId: this.state.Selected[0].ProductId, ProductNumber: 1}
            ];
            this.state.AddServiceInfo.map(it => {
                if (it.ProductId !== '') {
                    const obj = {
                        ProductId: it.ProductId,
                        ProductNumber: 1
                    };
                    ProductIds.push(obj)
                }
            })
             
            const {
                ResultInfo: info,
                ResultCode: code,
                Data: data,
            } = await Http.post(Url.baseUrl + `/app/user/shopping`, {
                GoodsSeriesCode: this.state.goods.GoodsSeriesCode,
                ProductIds: ProductIds,
                GoodsNumber: this.state.OrderQty,
                StoreId: '1', // # 店铺ID
                IsInvoice: '1', // # 是否开票 1 开票 0 不开票
                SuperGroupDetailId: '', // # 超级团ID
                OrderNow: '1', // # 是否立即订购 1 立即订购 不传非立即订购
            });
            if (code !== Http.ok) {
                return message.error(info);
            }
            let goods = this.state.Selected[0];
            let params = '';
            this.state.MenuList.map(it => {
                goods.Specs.index.map(item => {
                    if (goods.Specs[item].ParamId === it.ParamId) {
                        goods.Specs[item].ParamName = it.ParamName
                    }
                })
            });
            goods.Specs.index.map(it => {
                params += goods.Specs[it].ParamName+goods.Specs[it].ParamOptionalName + ' ';
            });
            const addServiceList = this.state.AddServiceInfo.filter(it => {
                return it.ProductId !== '';
            });
            let order = {
                GoodsSeriesTitle: goods.GoodsTitle,
                GoodsSeriesIcon: this.state.GoodsSeriesPhotos[0],
                CategoryId: this.state.goods.CategoryId,
                GoodsAddValue: this.state.goods.GoodsAddValue,
                GoodsAddValue2: this.state.goods.GoodsAddValue2,
                IsStandard: this.state.goods.IsStandard,
                GoodsNumber: this.state.OrderQty,
                GoodsParams: params,
                GoodsPrice: goods.GoodsPrice,
                AddServiceInfo: addServiceList
            };
            sessionStorage.setItem('Order', JSON.stringify(order));
            const str = '/mallConfirmOrder/'+ data;
            console.log(str);
            this.props.history.push(str);
        }
        
    }
    makeOrder = async() => {
        if (this.state.AddServiceInfo.length === 0) {
            if (this.state.Selected.length > 1 || this.state.Selected.length == 0) {
                return message.error('请先选择商品！');
            }
            this.getAddService();
        }   else {
            const ProductIds = [
                {ProductId: this.state.Selected[0].ProductId, ProductNumber: 1}
            ];
            this.state.AddServiceInfo.map(it => {
                if (it.ProductId !== '') {
                    const obj = {
                        ProductId: it.ProductId,
                        ProductNumber: 1
                    };
                    ProductIds.push(obj)
                }
            })
             
            const {
                ResultInfo: info,
                ResultCode: code,
                Data: data,
            } = await Http.post(Url.baseUrl + `/app/user/shopping`, {
                GoodsSeriesCode: this.state.goods.GoodsSeriesCode,
                ProductIds: ProductIds,
                GoodsNumber: this.state.OrderQty,
                StoreId: '1', // # 店铺ID
                IsInvoice: '1', // # 是否开票 1 开票 0 不开票
                SuperGroupDetailId: '', // # 超级团ID
                OrderNow: '1', // # 是否立即订购 1 立即订购 不传非立即订购
            });
            if (code !== Http.ok) {
                return message.error(info);
            }
            let goods = this.state.Selected[0];
            let params = '';
            this.state.MenuList.map(it => {
                goods.Specs.index.map(item => {
                    if (goods.Specs[item].ParamId === it.ParamId) {
                        goods.Specs[item].ParamName = it.ParamName
                    }
                })
            });
            goods.Specs.index.map(it => {
                params += goods.Specs[it].ParamName+goods.Specs[it].ParamOptionalName + ' ';
            });
            const addServiceList = this.state.AddServiceInfo.filter(it => {
                return it.ProductId !== '';
            });
            let order = {
                GoodsSeriesTitle: goods.GoodsTitle,
                GoodsSeriesIcon: this.state.GoodsSeriesPhotos[0],
                CategoryBId: this.state.goods.CategoryBId,
                CategoryId: this.state.goods.CategoryId,
                GoodsAddValue: this.state.goods.GoodsAddValue,
                GoodsAddValue2: this.state.goods.GoodsAddValue2,
                IsStandard: this.state.goods.IsStandard,
                GoodsNumber: this.state.OrderQty,
                GoodsParams: params,
                GoodsPrice: goods.GoodsPrice,
                AddServiceInfo: addServiceList
            };
            sessionStorage.setItem('Order', JSON.stringify(order));
            console.log(this.state.goods);
            const str = '/mallConfirmOrder/'+ data;
            console.log(str);
            this.props.history.push(str);
         }
        
     }

    attachGoodsEle = ref => this.goodsEle = ref;

    attachDetailEle = ref => this.detailEle = ref;

    attachInsurance = ref => this.insuranceEle = ref;
    
    attachAfterSale = ref => this.insuranceEle = ref;

    render() {
        return (
            <div style={{ display: this.display, backgroundColor: "#f5f5f5" }} className='mall_goods'>
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
                <div style={{ paddingBottom: "10px", paddingLeft: "10px", borderTop: '1px solid #F2F2F2', backgroundColor: "#ffffff" }}>
                    {/* <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom' }}><span className={this.state.goods.IsStandard == '1' ? 'Standard' : 'notStandard'}>{this.state.goods.IsStandard == '1' ? '标准品' : '设计品'}</span>{this.state.goods.GoodsSeriesTitle}</p> */}
                    <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom' }}>{this.state.goods.GoodsSeriesTitle}</p>
                    <div style={{ color: "#5ebecd", fontSize: "20px", margin: "0" }}>
                        ￥{this.state.goods.GoodsPriceMin}<span className="GoodsSeriesUnit">{this.state.goods.GoodsSeriesUnit ? '/' + this.state.goods.GoodsSeriesUnit : ''}</span> <span className="from">起</span>
                        {/* <span style={{ float: "right", marginRight: "10px", fontSize: "13px", color: "#999999" }}>
                            月销量：{this.state.goods.GoodsSale}笔</span> */}
                            {/* <span className="vipTip" onClick={this.toVip}>
                                <Row>
                                    <Col span={4}><img className="vipIcon" src={huiyuan} /></Col>
                                    <Col span={20}><span>开通会员<br/>下单最高享<span style={{color: 'red'}}>9.7折</span>优惠</span></Col>
                                </Row>
                            </span> */}
                    </div>
                    {/* <p>
                        <img src={huiyuan} />开通会员<br/>下单最高享9.7折优惠
                    </p> */}
                    <p style={{ color: "#ffc358", fontSize: "12px", margin: "0" }}>{
                        this.getVal()
                    }</p>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: 0 }}><span className="GoodsSeriesSetNum">{this.state.goods.GoodsSeriesSetNum}{this.state.goods.GoodsSeriesUnit ? this.state.goods.GoodsSeriesUnit : ''}起订</span></p>
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
                    <Card className="GoodsParams" title="规格" onClick={this.showParamsDrawer} extra={<span style={{ color: '#999' }}>更多<Icon type="right" /></span>}>
                        <ul>
                            {this.state.GoodsSeriesParams.map((item, index) => (
                                <li key={index}><span className="ParamName">{item.ParamName}</span><span>{item.ParamValue}</span></li>
                            ))}
                        </ul>
                    </Card>
                ) : null}
                {this.state.GoodsInsurance.length > 0 || this.state.GoodsAfterSale.length > 0 ? <div className="serviceContainer" onClick={this.showServiceDrawer}>
                    <span style={{ color: '#999' }}>服务</span>
                    <p style={{ display: 'inline-block' }}>
                        {this.state.GoodsInsurance.length > 0 ? <span className="serviceItem" style={{ marginRight: '20px' }}>质量保障</span> : null}
                        {this.state.GoodsAfterSale.length > 0 ? <span className="serviceItem">售后服务</span> : null}
                    </p>
                    <Icon type="right" />
                </div> : null}
                {this.state.goods.GoodsSeriesMatch !== '' ? <div className="serviceContainer" onClick={this.showMatchDrawer}>
                    <span style={{ color: '#999', }}>配套</span><p className="match">{this.state.goods.GoodsSeriesMatch}</p><Icon type="right" />
                </div> : null}
                <p style={{ color: '#999', marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}><Icon type="down" />上拉查看图文详情</p>
                <div>
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
                <div style={{position: 'fixed', bottom: 0, width: '100%'}}>
                    <Row>
                        <Col span={12} className="kefu" onClick={this.sendGoods}>联系客服</Col>
                        <Col span={12} className="order" onClick={this.showGoodsAll}>我要下单</Col>
                    </Row>
                </div>
                <Drawer
                    title="商品规格"
                    visible={this.state.showParams}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height={this.state.height}
                    className="Params"
                    style={{
                        height: this.state.showParams?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: '45px', width: '100%' }}>
                        {this.state.GoodsSeriesParams.map((item, index) => (
                            <p key={index} className="ParamsList"><span className="ParamName">{item.ParamName}</span><span>{item.ParamValue}</span></p>
                        ))}
                    </div>
                    <Button type="primary" style={{border: 'none', color: '#FFF'}} className="close" onClick={this.close}>关闭</Button>
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
                        height: this.state.showGoodsSeriesService?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ position: 'absolute', bottom: '45px', width: '100%' }}>
                        {this.state.GoodsInsurance.length > 0 ? <div ref={this.attachInsurance} style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
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
                        {this.state.GoodsAfterSale.length > 0 ? <div ref={this.attachAfterSale} style={{ paddingLeft: "10px", borderBottom: "1px solid #F2F2F2", color: "#000000" }}>
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
                    <Button type="primary" style={{border: 'none', color: '#FFF'}} className="close" onClick={this.close}>关闭</Button>
                </Drawer>
                <Drawer
                    title="商品配套"
                    visible={this.state.showGoodsSeriesMatch}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    className="Params"
                    style={{
                        height: this.state.showGoodsSeriesMatch?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <div style={{ textAlign: 'left', marginTop: '20px', padding: '10px 15px' }}>
                        <p>{this.state.goods.GoodsSeriesMatch !== '' ? this.state.goods.GoodsSeriesMatch : '无'}</p>
                    </div>
                    <Button type="primary" style={{border: 'none', color: '#FFF'}} className="close" onClick={this.close}>关闭</Button>
                </Drawer>
                <Drawer
                    title=""
                    visible={this.state.showGoodsAll}
                    maskClosable={true}
                    onClose={this.close}
                    placement='bottom'
                    height={this.state.GoodsAllHeight}
                    className="GoodsAll"
                    style={{
                        height: this.state.showGoodsAll?'100%':'auto',
                        overflow: 'auto',
                    }}
                >
                    <p className="bg"/>
                    <Row className="title_container">
                        <Col span={10}>
                            <div className="icon_container" style={{width: this.state.IconWidth+'px', height: this.state.IconWidth+'px', lineHeight: this.state.IconWidth+'px', top: (70-this.state.IconWidth)+'px'}}><img src={this.state.GoodsSeriesPhotos[0]} /></div>
                        </Col>
                        <Col span={14}>
                        {/* <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom', paddingRight: '20px' }}><span className={this.state.goods.IsStandard == '1' ? 'Standard' : 'notStandard'}>{this.state.goods.IsStandard == '1' ? '标准品' : '设计品'}</span>{this.state.goods.GoodsSeriesTitle}</p> */}
                            <p style={{ color: "#000000", fontSize: "14px", margin: "10px 0 0", verticalAlign:'bottom', paddingRight: '20px' }}>{this.state.goods.GoodsSeriesTitle}</p>
                            <p style={{ color: "#ffc358", fontSize: "12px", margin: '0' }}>{this.getVal()}</p>
                        </Col>
                    </Row>
                    <div className="main_container" style={{height: this.state.MainHeight + 'px'}}>
                        <p className="price" style={{fontSize: '18px', color: '#4DBECD', padding: '0 15px'}}>{this.state.Selected.length === 1 ? this.getTotalPrice(): this.state.goods.PriceRange}</p>
                        {/* <p className="price"  style={{fontSize: '14px', padding: '0 15px'}}>{this.state.Selected.length === 1 ? this.getTotalVipPrice():this.state.goods.VipPriceRange}<span style={{color: 'red',marginLeft: '10px'}}>会员价</span></p> */}
                        {/* <p className='vipinfo' onClick={this.toVip}><img src={huiyuan} style={{width:26,margin:'-2px 10px 0px'}}/>开通会员，下单享会员价<span style={{color:'#F8695D',float:'right',marginRight:20}}>></span></p> */}
                        <div className="Params_container" style={{height: this.state.ParamsHeight + 'px'}} >
                            {this.state.ShowAddService? (
                                <div>
                                    {this.state.AddService.map((it, index) => (
                                        <div key={index}>
                                            <p className="price" style={{marginBottom: '5px'}}>{it.GoodsTypeName + (it.GoodsType === '2'? '(可多选)': '')}</p>
                                            <ul className="addService">
                                                {it.GoodsList.map((oItem,idx) => (
                                                    <Button onClick={this.selectAddService.bind(this, it.GoodsList, it.GoodsType, oItem)} className={'addServiceBtn'} value={oItem.ProductId} key={idx}>{oItem.GoodsTitle}</Button>
                                                ))
                                                }
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ): (<div>
                                {this.state.MenuList.map((it, index) => (
                                    <div key={index}>
                                        <p className="price" style={{marginBottom: '5px'}}>{it.ParamName}</p>
                                        <ul className="price">
                                        {it.ParamOptionalMap.map((oItem,idx) => (
                                            <Button onClick={this.selectGoods.bind(this, oItem)} className={oItem.Active ? 'selectBtn active': (oItem.Disabled ? 'selectBtn disabled':'selectBtn')} value={oItem.ParamOptionalId} key={idx}>{oItem.ParamOptionalName}</Button>
                                        ))
                                        }
                                        </ul>
                                    </div>
                                    )
                                )}
                                {this.state.AddServiceInfo.map((it, index) => (
                                    <div key={index} className="appendix_container" onClick={this.showAddService}>
                                        <p><span style={{color: '#4DBECD'}}>{it.GoodsType==='2' ? '附件：': '品牌：'}</span>{it.GoodsTitle}<span style={{float: 'right'}}>￥{it.GoodsType === '2' ? it.GoodsPrice: this.getBrandPrice(this.state.Selected[0].GoodsPrice,it.GoodsPrice)}</span></p>
                                    </div>
                                ))}
                            </div>
                                
                            )}
                            
                            <p style={{lineHeight: '28px'}} className="number">数量<span className='setNum' style={{ backgroundImage: `url(${orderQty})`,}}><Button onClick={this.qtyPlus} className="plus"/>{this.state.OrderQty}<Button onClick={this.qtyAdd} className="add"/></span></p>
                        </div>
                        {this.state.ShowAddService? <div style={{position:'absolute', bottom: '0', width: '100%'}}>
                            <Row style={{width: '100%'}}>
                                <Col span={12} className="kefu" onClick={this.backTo}>上一步</Col>
                                <Col span={12} className="order" onClick={this.MakeSure}>确定</Col>
                            </Row>
                        </div>:<p style={{width: '100%', position: 'absolute', bottom: '0'}} className="Order_btn"><Button type="primary" style={{width: '100%', height: '40px', fontSize: '16px'}} onClick={this.makeOrder}>确认</Button></p>}
                    </div>
                </Drawer>
                {/* <p onClick={this.downloadApp}>
                    <img style={{ width: "100%" }} alt="share" src={share} />
                </p> */}
            </div >
        );
    }
}
export default withRouter(MallGoodsDetail);
