import * as React from 'react';
import './style.css';
import Http from "../../service/Http";
import { message } from 'antd';
import img from '../../assets/img/fenxiang copy.png';
import Url from '../../service/Url';

export default class ShopDetails extends React.Component {

    constructor(props) {
        super(props);
        const path = this.props.location.pathname;
        const id = path.split("/")[2];
        this.state = {
            details: {},
            id: id,
            curCate: null
        }
    }

    componentWillMount() {
        this.getDetails();
    }

    getDetails = async () => {
        const res = await Http.get(Url.baseUrl+`/app/store/detail?StoreId=${this.state.id}`);
        if (res.ResultCode === 0) {
            this.setState({
                ...this.state,
                details: res.Data,
                curCate: res.Data.CategoryList.length > 0 ? res.Data.CategoryList[0] : null
            });
            return;
        }
        message.error(`获取商品详情出错：${res.ResultInfo}`);
    }

    selectCate = (it) => () => {
        this.setState({
            ...this.state,
            curCate: it
        })
    }

    download() {
        window.open('http://www.emake.cn/download/');
    }


    render() {
        const s = this.state.details;
        if (!s) {
            return ''
        }
        const h = window.innerHeight;
        return <div className="shop-details-page" style={{ height: (h - 44) + 'px', overflow: 'hidden', paddingBottom: '44px' }}>
            <div style={{ backgroundColor: '#7ebfdc', marginBottom: '8px', height: '154px' }}>
                <h3>{s.StoreName}</h3>
                <div style={{ padding: '8px', overflow: 'hidden', paddingBottom: '14px' }}>
                    <img src={s.StorePhoto} alt="店铺图片" style={{ width: '88px', height: '88px', borderRadius: '5px', float: 'left' }} />
                    <div style={{ marginLeft: '96px', }} className="shop-sum">
                        <p>销售额：{'￥' + s.StoreSales}</p>
                        <p>暂无评价</p>
                        <p className="category">主营品类：{s.StoreCategoryList ? s.StoreCategoryList.join("，") : ''}</p>
                    </div>
                </div>
            </div>
            <div className="list" style={{ height: '100%', width: '100%', overflow: 'hidden', height: (h - 206) + 'px' }}>
                <ul>
                    {
                        !s.CategoryList ? '' :
                            s.CategoryList.map((it, idx) => <li onTouchStart={this.selectCate(it)} key={it.CategoryId + idx} style={{ backgroundColor: this.state.curCate.CategoryName === it.CategoryName ? '#fff' : 'rgb(224, 224, 224)' }}>
                                {it.CategoryName}
                            </li>)
                    }
                </ul>
                <div className="cards" style={{ paddingLeft: '2%', width: '72%', height: '100%', overflowY: 'scroll', textAlign: 'center', float: 'right' }}>
                    {
                        !this.state.curCate ? '' :
                            this.state.curCate.CategorySeries.map((it, idx) => <div key={idx} style={{ textAlign: 'left', display: 'inline-block', margin: '16px 2% 0 0', width: '48%', float: 'left' }}>
                                <div style={{ display: 'inline-block', width: '60px', height: '60px', border: '1px solid #ccc', padding: '8px' }}>
                                    <img src={it.GoodsSeriesIcon} alt="系列图片" style={{ width: '44px', height: '44px' }} />
                                </div>
                                <p style={{ fontWeight: 'bold' }}>{it.GoodsSeriesName}</p>
                                <p style={{ color: '#7ebfdc' }} className="qweqer21e1qwq">{it.PriceRange}</p>
                                <p>{"销量：" + it.GoodsSale}</p>
                            </div>)
                    }
                </div>
            </div>
            <img src={img} alt="adver" style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '44px'
            }}
                onClick={this.download}
            />
        </div>
    }




}