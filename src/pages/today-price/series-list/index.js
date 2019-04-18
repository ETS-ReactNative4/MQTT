import "./style.css";
import * as React from "react";
import Http from "../../../service/Http";
import { message, Icon } from "antd";
import { Link } from "react-router-dom";
import Url from '../../../service/Url';

export default class SeriesList extends React.Component {

    constructor(props) {
        super(props);
        const path = this.props.location.pathname;
        const id = path.split("/")[2];
        this.state = {
            firstCateId: id,
            thCateList: [],                 // 三级分类列表
            goodsSeriesList: [],            // 商品系列列表
            curFirstCate: {},               // 当前选中一级分类
            curThCate: {},                  // 当前选中三级分类
        }
    }

    async componentWillMount() {
        await this.getThCate(this.state.firstCateId);
        const list = this.state.thCateList;
        if (list.length > 0) {
            this.setState({
                ...this.state,
                curThCate: list[0]
            });
            this.getGoodsSeries(this.state.curThCate.CategoryId);
            return;
        }
        message.warn("三级分类列表为空！");
    }

    // 获取三级分类列表
    getThCate = async (id) => {
        const res = await Http.get(Url.baseUrl+`/web/make/price/category?CategoryId=${id}`);
        if (res.ResultCode === 0) {
            this.setState({
                ...this.state,
                thCateList: res.Data
            })
            return;
        }
        message.error("获取三级分类列表失败！");
    }

    // 获取商品系列列表
    getGoodsSeries = async (id) => {
        const res = await Http.get(Url.baseUrl+`/web/make/price/series?CategoryId=${id}`);
        if (res.ResultCode === 0) {
            this.setState({
                ...this.state,
                goodsSeriesList: res.Data
            })
            return;
        }
        message.error("获取商品系列列表失败！");
    }

    // 三级分类点击
    onCateClick = (it) => async () => {
        await this.getGoodsSeries(it.CategoryId);
        this.setState({
            ...this.state,
            curThCate: it
        });
    }

    render() {
        return <div className="today-price-page-series">
            <div className="select-list">
                <ul className="cateList">
                    {
                        this.state.thCateList.map(it => <li key={it.CategoryId} onClick={this.onCateClick(it)}
                            style={this.state.curThCate.CategoryId === it.CategoryId ? { backgroundColor: '#fff', color: '#4bbdcc' } : null}
                        >{it.CategoryName}</li>)
                    }
                </ul>
            </div>
            <div className="series-list">
                <ul className="series">
                    {
                        this.state.goodsSeriesList.map((it, idx) => <Link key={it.GoodsSeriesCode + idx} to={`/pricetable/${it.GoodsSeriesCode}/${it.GoodsSeriesTitle}/${it.GoodsType}`}><li>
                            <span className="warpper">
                                <span style={{ color: '#4bbdcc' }}>{it.GoodsSeriesName}</span>
                                <span>{it.GoodsSeriesTitle}</span>
                            </span>
                            <Icon type="right" className="icon-right" />
                        </li></Link>)
                    }
                </ul>
            </div>
        </div>
    }



}