import * as React from 'react';
import './serieslist.css';
import { message, Tabs } from 'antd';
import { withRouter } from 'react-router-dom';
import Http from '../../service/Http';
import Url from '../../service/Url';

const TabPane = Tabs.TabPane;

type Props = {
    match: { params: any },
}
type State = {
    seriesList: any;
    series: any;
    goods: any;
    CategoryList: any;
    CurCategory: any;
}
class SeriesList extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            seriesList: [],
            series: {},
            goods: [],
            CategoryList: [],
            CurCategory: {},
        };
    }
    async componentWillMount() {
        const id = this.props.match.params.code;
        this.getCategory(id);

    }
    async getCategoryPrice(id: any) {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/web/category_c?CategoryBId=` + id);
        // await Http.get(Url.baseUrl + `/web/make/price/category?CategoryId=` + id);
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.length) {
            this.getGood(data[0], data, data[0]);
        }
    }


    async getCategory(id: any) {
        const {
            ResultInfo: ifo,
            ResultCode: cde,
            Data: ds,
        } = await Http.get(Url.baseUrl + `/web/category_b`);
        if (cde !== Http.ok) {
            return message.error(ifo);
        }
        if (ds.length) {
            console.log(ds);
            this.setState({
                CategoryList: ds.filter((dis: any) => dis.CategoryAId === id && dis.OnSale === '1'),
                CurCategory: ds.filter((dis: any) => dis.CategoryAId === id && dis.OnSale === '1')[0] || {}
            }, () => {
                this.getCategoryPrice(this.state.CurCategory.CategoryId);
            });
        }
    }

    async getGood(d: any, l: any, c: any) {
        // console.log(l);
        // console.log(d,c);
        const {
            ResultInfo: ifo,
            ResultCode: cde,
            Data: ds,
        } = await Http.get(Url.baseUrl + `/web/make/price/series?CategoryId=` + d.CategoryId);
        if (cde !== Http.ok) {
            return message.error(ifo);
        }
        if (ds.length) {
            this.setState({
                goods: ds.filter((des: any) => des.IsStandard !== '0'),
                series: c,
                seriesList: l
            });
        }
    }

    seriesChange = (val: any, e: any) => {
        this.setState({ goods: [] });
        const arr = e.target.parentNode.childNodes;
        arr.forEach((ais: any) => {
            ais.style.color = "black";
            ais.style.backgroundColor = "rgb(243, 243, 243)";
        });
        e.target.style.color = '#4bbdcc';
        e.target.style.backgroundColor = "#fff";
        this.getGood(val, this.state.seriesList, val);
    }
    link = (val: any) => {
        this.props.history.push('/today/' + val.GoodsSeriesCode + "/" + val.GoodsType +
            "/" + this.props.match.params.code + "/" + this.state.series.CategoryId + "/" + val.GoodsSeriesTitle);
    }
    callback = (e: any) => {
        const s = this.state;
        this.setState({
            CurCategory: s.CategoryList.filter((cs: any) => cs.CategoryId === e)[0],
            seriesList: [], goods: [],
        }, () => {
            this.getCategoryPrice(this.state.CurCategory.CategoryId);
        });
    }
    render() {
        return (
            <div >
                <Tabs style={{ textAlign: 'center' }} onChange={this.callback}>
                    {
                        this.state.CategoryList.map((cs: any) => (
                            < TabPane tab={cs.CategoryName} key={cs.CategoryId}>
                                <div>
                                    <div style={{
                                        display: "inline-block",
                                        width: "35%",
                                        overflow: "scroll",
                                        height: "700px"
                                    }}>
                                        <ul
                                            style={{ listStyle: "none", height: "100%" }}
                                            className={"bor"}>
                                            {
                                                this.state.seriesList.map((si: any, i: number) => (
                                                    {
                                                        ...si.CategoryId === this.state.series.CategoryId ? (
                                                            < li key={"seriesList" + i}
                                                                style={{
                                                                    fontSize: "11px",
                                                                    lineHeight: "40px",
                                                                    textAlign: "center"
                                                                }}
                                                                className={"one"}
                                                                onClick={this.seriesChange.bind(SeriesList, si)}
                                                            >
                                                                {si.CategoryName}
                                                            </li>
                                                        ) : (
                                                                < li key={"seriesList" + i}
                                                                    style={{
                                                                        fontSize: "11px",
                                                                        lineHeight: "40px",
                                                                        textAlign: "center"
                                                                    }}
                                                                    onClick={this.seriesChange.bind(SeriesList, si)}
                                                                >
                                                                    {si.CategoryName}
                                                                </li>
                                                            )
                                                    }
                                                ))
                                            }
                                        </ul>
                                    </div>
                                    <div style={{
                                        display: "inline-block",
                                        width: "65%",
                                        overflow: "scroll",
                                        height: "700px"
                                    }}>
                                        <ul style={{ listStyle: "none", height: "100%" }}>
                                            {
                                                this.state.series.CategoryId === "001-002-001" ? (
                                                    this.state.goods.map((gi: any, i: number) => (
                                                        gi.GoodsType === '1' ? (
                                                            < li key={"goods" + i}
                                                                style={{
                                                                    fontSize: "11px",
                                                                    lineHeight: "40px",
                                                                    textAlign: "left",
                                                                    textIndent: "20px"
                                                                }}
                                                                className={"bor-tom"}
                                                                onClick={this.link.bind(SeriesList, gi)}
                                                            >
                                                                {gi.GoodsSeriesTitle}
                                                            </li>
                                                        ) : null
                                                    ))
                                                ) : (
                                                        this.state.goods.map((gi: any, i: number) => (
                                                            < li key={"goods" + i}
                                                                style={{
                                                                    fontSize: "11px",
                                                                    lineHeight: "40px",
                                                                    textAlign: "left",
                                                                    textIndent: "20px"
                                                                }}
                                                                className={"bor-tom"}
                                                                onClick={this.link.bind(SeriesList, gi)}
                                                            >
                                                                {gi.GoodsSeriesTitle}
                                                            </li>
                                                        ))
                                                    )
                                            }
                                            {
                                                this.state.series.CategoryId === "001-002-001" ? (
                                                    < li
                                                        key={"goods" + [...this.state.goods].length - 1}
                                                        style={{
                                                            fontSize: "11px",
                                                            lineHeight: "40px",
                                                            textAlign: "left",
                                                            textIndent: "20px"
                                                        }}
                                                        className={"bor-tom"}
                                                        onClick={this.link.bind(SeriesList, this.state.goods[this.state.goods.length - 1])}
                                                    >
                                                        {"干式变压器外壳"}
                                                    </li>
                                                ) : null
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </TabPane>
                        ))
                    }
                </Tabs>
            </div >
        );
    }
}
export default withRouter(SeriesList);