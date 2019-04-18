import "./style.css";
import * as React from "react";
import Http from "../../../service/Http";
import { message, Table, Input } from "antd";
import Url from '../../../service/Url';


const cols = (page) => [
    {
        title: '商品名称',
        align: 'center',
        key: 'name',
        render() {
            return page.state.curPrice.GoodsSeriesTitle
        }
    },
    {
        title: '参数',
        className: 'td-params',
        align: 'center',
        key: 'params',
        render(_, row) {
            const ps = row.ProductParams;
            let str = "";
            for (let k in ps) {
                str += k + ":" + ps[k] + ";";
            }
            return str;
        }
    },
    {
        title: '售价',
        align: 'center',
        dataIndex: 'GoodsPrice'
    }
];

export default class PriceList extends React.Component {

    constructor(props) {
        super(props);
        const path = this.props.location.pathname;
        const code = path.split("/")[2];
        const title = path.split("/")[3];
        const type = path.split("/")[4];
        this.state = {
            code: code,
            title: title,
            goodsType: type,
            curPrice: {},                  // 当前价格
            backup: [],
            keyword: ""
        }
    }

    componentWillMount() {
        this.getPrice();
    }

    // 获取价格列表
    getPrice = async () => {
        const res = await Http.get(Url.baseUrl+`/web/make/price?GoodsSeriesCode=${this.state.code}&GoodsType=${this.state.goodsType}&GoodsSeriesTitle=${this.state.title}`);
        if (res.ResultCode === 0) {
            this.setState({
                ...this.state,
                curPrice: res.Data,
                backup: res.Data.Products
            })
            return;
        }
        message.error("获取商品价格列表失败！");
    }

    // 搜索框输入
    onChange = (e) => {
        if (!this.state.curPrice.Products) {
            return;
        }
        if (e.target.value === "") {
            this.state.curPrice.Products = this.state.backup;
        }
        this.setState({
            ...this.state,
            keyword: e.target.value
        });
    }

    search = () => {
        const key = this.state.keyword;
        this.state.curPrice.Products = this.state.backup.filter(it => {
            let r = false;
            for (let idx in it.ProductParams) {
                if (idx.indexOf(key) !== -1 || it.ProductParams[idx].indexOf(key) !== -1) {
                    r = true;
                    return r
                }
            }
            return r;
        });
        this.setState({
            ...this.state,
        });
    }

    getToday() {
        const date = new Date;
        return date.getFullYear() + "年" + "-" + (date.getMonth() + 1) + "月" + "-" + date.getDate() + "日";
    }

    render() {
        return <div className="today-price-page-price">
            <div className="search">
                <Input.Search placeholder="输入参数搜索" value={this.state.keyword} onChange={this.onChange} onSearch={this.search} />
                <span
                    style={{
                        display: 'inline-block',
                        marginTop: '8px'
                    }}
                >{this.getToday()}</span>
            </div>
            <Table dataSource={this.state.curPrice.Products ? this.state.curPrice.Products.map((it, idx) => ({ ...it, key: it.GoodsPrice + idx })) : []} columns={cols(this)} />
        </div>
    }



}