import * as React from 'react';
import './today.css';
import { message, Input, Table, Col, Row } from 'antd';
import { withRouter } from 'react-router-dom';
import Http from '../../service/Http';
import Url from '../../service/Url';
// import { ColumnProps } from 'antd/lib/table';
type Props = {
    match: { params: any },
}
type State = {
    tableData: any;
    tabtitle: any;
    tableDatas: any;
    isShow: boolean;
    Price: any;
}
const Search = Input.Search;

class Today extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            tableData: [],
            tabtitle: [],
            tableDatas: [],
            isShow: true,
            Price: {
                TongPrice: "",
                LvPrice: "",
                TongPriceChange: "",
                LvPriceChange: "",
            },
        };
    }
    async componentWillMount() {
        // console.log(Url.baseUrl);
        const scode = this.props.match.params.code;
        const type = this.props.match.params.id;
        const secode = this.props.match.params.secode;
        const cid = this.props.match.params.cid;
        const title = this.props.match.params.title;
        // console.log(secode);
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/web/make/price?GoodsSeriesCode=` + scode + `&GoodsType=` + type);
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.product_list && data.product_list.length) {
            data.product_list.forEach((dps: any) => {
                dps.GoodsPrice = dps.GoodsPrice.toFixed(2);
            });
        }
        if (secode === "001") {
            if (type === '1') {
                this.setState({ isShow: true });
                switch (cid) {
                    case "001-002-001":
                        this.ProcessData_S(data);
                        break;
                    case "001-002-002":
                        this.DataReorganization(data, ["InstantaneousTrip", "RatedCurrent",
                            "Poles", "Material", 'RatedShortCircuitCapacity', 'RatedResiduOperatingCurrent']);
                        break;
                    case "001-002-003":
                        // console.log(data);
                        this.DataReorganization(data, ['ShellRatingCurrent', 'UltimateShortCircuitCapacity'
                            , "RatedCurrent", "Poles", "Material"]);
                        break;
                    case "001-002-004":
                        // console.log(data);
                        this.DataReorganization(data, ["RatedCurrent", "Poles",
                            "TripperType", 'InstallMode', 'ShellRatingCurrent']);
                        break;
                    case "001-002-005":
                        // console.log(data);
                        this.DataReorganization(data, ["RatedCurrent", "Poles", 'ShellRatingCurrent',
                            'Material', 'ConventionalHeatingCurrent', 'OperateMethod',
                            'RepaireMethod']);
                        break;
                    case "001-002-006":
                        // console.log(data);
                        this.DataReorganization(data, ["FusingCurrent", "ConventionalHeatingCurrent",
                            "Poles", "Material", "SignalDevice", 'OperateMethod']);
                        break;
                    case "001-002-007":
                        // console.log(data);
                        this.DataReorganization(data, ["CurrentSpecification", "InstallMethod",
                            "ShellRackRatedCurrent", "Type&RatedCurrent"]);
                        break;
                    case "001-002-008":
                        // console.log(data);
                        this.DataReorganization(data, ["CoilControlVoltage", "ContactNumber", "Frequency", "Material", "RatedCurrent"]);
                        break;
                    case "001-002-009":
                        // console.log(data);
                        this.DataReorganization(data, ['ProductSeries', 'MaximumDischargeCurrent', 'NominalDischargeCurrent', 'Poles', 'MaximumCVoltage']);
                        break;
                    case "001-002-010":
                        // console.log(data);
                        this.DataReorganization(data, ["ProductSeries", "Poles", "RatedVoltage", "RatedCurrent", "Frequency"]);
                        break;
                    case "001-002-011":
                        // console.log(data);
                        this.DataReorganization(data, ["ConnectionMode", "MeasuringRange", "ProductSeries", "Type"]);
                        break;
                    case "001-002-012":
                        // console.log(data);
                        this.DataReorganization(data, ['ConnectionMode', 'ProductSeries', 'CurrentShellFrame', 'ElectricalLevel', 'ConventionalHeatingCurrent', 'Poles',
                            'ConversionMethod', 'ExecuteComponent', 'BreakCapacity', 'Type', 'Display', 'Controller', 'Tripper', 'OperatingMode']);
                        break;
                    case "001-002-013":
                        // console.log(data);
                        this.DataReorganization(data, ["CompensationMode", "RatedVoltage", "Phase", 'Code', 'ReteCapacity']);
                        break;
                    default:
                        this.DataReorganization(data, [""]);
                        break;
                }
            } else {
                if (cid === '001-002-001') {
                    this.setState({ isShow: false });
                    const datas = await Http.get(Url.baseUrl + `/web/make/price?GoodsSeriesCode=0001&GoodsType=2`);
                    const datasi = await Http.get(Url.baseUrl + `/web/make/price?GoodsSeriesCode=0002&GoodsType=2`);
                    // console.log(datas, datasi)
                    let SCB10Arr = {
                        title: '',
                        Data: []
                    };
                    let SCB10Brr = {
                        title: '',
                        Data: []
                    };
                    if (!datas.ResultCode) {
                        // datas.Data.product_list.forEach((dps: any) => {
                        //     dps.GoodsPrice = dps.GoodsPrice.toFixed(2);
                        // });
                        SCB10Arr = this.ProcessAccessories_2(datas.Data);
                    }
                    if (!datasi.ResultCode) {
                        // datasi.Data.product_list.forEach((dps: any) => {
                        //     dps.GoodsPrice = dps.GoodsPrice.toFixed(2);
                        // });
                        SCB10Brr = this.ProcessAccessories_2(datasi.Data);
                    }
                    this.setState({
                        tableData: [SCB10Arr, SCB10Brr],
                        tableDatas: [SCB10Arr, SCB10Brr],
                        tabtitle: [
                            {
                                title: '容量',
                                dataIndex: 'Capacity',
                                key: "Capacity",
                                align: "center",
                            },
                        ]
                    });
                } else {
                    this.setState({ isShow: true });
                    this.ProcessAccessories(data, title);
                }
            }
        } else {
            this.setState({ isShow: true });
            this.ProcessData_X(data);
        }
        this.getPriceTonglv();
    }
    async getPriceTonglv() {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/web/tonglv/price`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        // console.log(data);
        this.setState({
            Price: {
                TongPrice: data.TongPrice || '0',
                LvPrice: data.LvPrice || '0',
                TongPriceChange: data.TongPriceChange || '0',
                LvPriceChange: data.LvPriceChange || '0',
            }
        })
    }
    ProcessAccessories_2 = (d: any) => {
        d.product_list.map((it: any, index: number) => (
            it.key = index
        ));
        const tarA = this.getData_2(d, '铝合金', '标高', '加高2.2米');
        const tarB = this.getData_2(d, '不锈钢', '标高', '加高2.2米');
        const tarC = this.getData_2(d, '冷轧钢板', '标高', '加高2.2米');
        const data = {
            title: d.GoodsSeriesName + "外壳价格(含税价格，不含运费)",
            Data: [tarA, tarB, tarC]
        }
        data.Data.forEach((is: any, id: any) => {
            if (!is.length) {
                data.Data.splice(id, 1);
            }
        });
        return data;
        // console.log(tarA, tarB, tarC);
        // this.setState({
        //     tableData: [{
        //         title: '干式变压器外壳',
        //         Data: [tarA, tarB, tarC],
        //     }],
        //     tableDatas: [{
        //         title: '干式变压器外壳',
        //         Data: [tarA, tarB, tarC],
        //     }],
        //     tabtitle: [
        //         {
        //             title: '容量KVA',
        //             dataIndex: 'Capacity',
        //             key: "Capacity",
        //             align: "center",
        //         },
        //     ]
        // });
    }
    getData_2 = (d: any, str: string, str2: string, str3: string) => {
        const arr = d.product_list.filter((ds: any) => ds.GoodsTitle.indexOf(str) !== -1);
        const tarA = arr.filter((ds: any) => ds.GoodsTitle.indexOf(str2) !== -1);
        const tarB = arr.filter((ds: any) => ds.GoodsTitle.indexOf(str3) !== -1);
        tarA.forEach((as: any) => {
            as.prices = [];
            as.prices[0] = as.GoodsPrice;
            tarB.forEach((bs: any) => {
                if (bs.Capacity === as.Capacity) {
                    as.prices.push(bs.GoodsPrice);
                }
            });
        });
        this.SortBy(tarA, 'Capacity');
        this.GetImpedance(tarA);
        return tarA;
    }
    ProcessAccessories = (d: any, ti: any) => {
        d.product_list.map((it: any, index: number) => (
            it.key = index
        ));
        const arr = d.product_list.filter((ds: any) => ds.GoodsTitle === ti);
        arr.forEach((it: any) => {
            it.Total = '';
            const i = it.GoodsTitle ? it.GoodsTitle + "   " : '';
            const r = it.Capacity ? it.Capacity + "   " : '';
            it.Total = i + r;
        });
        if (arr[0].Capacity) {
            this.SortBy(arr, "Capacity");
        }
        this.setState({
            tableData: [{
                title: d.GoodsSeriesName,
                Data: arr,
            }],
            tableDatas: [{
                title: d.GoodsSeriesName,
                Data: arr,
            }],
            tabtitle: [
                {
                    title: '技术参数',
                    dataIndex: 'Total',
                    key: "Total",
                    align: "center",
                },
                {
                    title: '价格',
                    dataIndex: "GoodsPrice",
                    key: "GoodsPrice",
                    align: "center",
                },
            ]
        });
    }
    DataReorganization = (d: any, arr: any) => {
        // console.log(d);
        this.setState({
            tabtitle: [
                {
                    title: '技术参数',
                    dataIndex: 'Total',
                    key: "Total",
                    align: "center",
                },
                {
                    title: '价格',
                    dataIndex: "GoodsPrice",
                    key: "GoodsPrice",
                    align: "center",
                },
            ]
        });
        if (d.product_list && d.product_list.length) {
            d.product_list.map((it: any, index: number) => (
                it.key = index
            ));
            d.product_list.forEach((it: any) => {
                it.Total = '';
                it.ProductParams.forEach((ais: any) => {
                    for (let key in ais) {
                        it.Total += (" " + ais[key]);
                    }
                });
            });
            this.GetImpedance(d.product_list);
            this.setState({
                tableData: [{
                    title: d.GoodsSeriesName + '(含税价格，不含运费)',
                    Data: d.product_list,
                }],
                tableDatas: [{
                    title: d.GoodsSeriesName + '(含税价格，不含运费)',
                    Data: d.product_list,
                }]
            })
        } else {
            this.setState({
                tableData: [{
                    title: '',
                    Data: [],
                }],
                tableDatas: [{
                    title: '',
                    Data: [],
                }]
            })
        }
    }
    ProcessData_S = (d: any) => {
        switch (d.GoodsSeriesName) {
            case "SCB10硅钢干式变压器":
                this.Gettables(d, "全铜", "全铝", "Material", 1);
                // this.Gettable(d, "全铜", "全铝", "国标 100K", "国标 115-120K", "TemperatureRise", "Material");
                break;
            case "SCBH15非晶干式变压器":
                this.Gettables(d, "全铜", "全铝", "Material", 1);
                // this.Gettable(d, "全铜", "全铝", "国标 100K", "国标 115-120K", "TemperatureRise", "Material");
                break;
            case "S11硅钢油浸式变压器":
                this.Gettable(d, "全铜", "全铝", "25#油", "45#油", "OilType", "Material");
                break;
            case "SBH15非晶油浸式变压器":
                this.Gettable(d, "国标", "国网", "25#油", "45#油", "OilType", "Standard");
                break;
            case "SCB11光伏专用变压器":
                this.setState({
                    tabtitle: [
                        {
                            title: '容量',
                            dataIndex: 'Capacity',
                            key: "Capacity",
                            align: "center",
                        },
                        {
                            title: '售价(含税价格，不含运费)',
                            dataIndex: "GoodsPrice",
                            key: "GoodsPrice",
                            align: "center",
                        },
                    ]
                });
                if (d.product_list && d.product_list.length) {
                    d.product_list.map((it: any, index: number) => (it.key = index));
                    this.SortBy(d.product_list, "Capacity");
                    this.GetImpedance(d.product_list);
                    this.setState({
                        tableData: [{
                            title: d.GoodsSeriesName,
                            Data: d.product_list,
                        }],
                        tableDatas: [{
                            title: d.GoodsSeriesName,
                            Data: d.product_list,
                        }],
                    })
                } else {
                    this.setState({
                        tableData: [{
                            title: '',
                            Data: [],
                        }],
                        tableDatas: [{
                            title: '',
                            Data: [],
                        }]
                    })
                }

                break;
            default:
                break;
        }
    }
    ProcessSCBs = (d: any, s: string, fileds: string, n?: number) => {
        let arrOne: any[] = [];
        if (d.product_list && d.product_list.length) {
            arrOne = d.product_list.filter((ds: any) => ds[fileds] === s);
            if (n && n === 1) {
                // const A = arrOne.find(is => is.Capacity === '630kVA(6%)');
                arrOne.forEach((is, index) => {
                    if (is.Capacity === '630kVA' && is.Impedance === '6%') {
                        const A = is;
                        arrOne.splice(index, 1);
                        arrOne.splice(index + 1, 0, A);
                    }
                });
            }
            this.setState({
                tabtitle: [
                    {
                        title: '容量',
                        dataIndex: 'Capacity',
                        key: "Capacity",
                        align: "center",
                    },
                    {
                        title: '售价(含税价格，不含运费)',
                        key: "ProductPrice",
                        align: "center",
                        dataIndex: "GoodsPrices[0]",
                    },
                ]
            })
        }
        return arrOne;
    }
    // 无温
    Gettables = (d: any, s1: string, s2: string, fileds: string, n: number) => {
        const tarA: any[] = this.ProcessSCBs(d, s1, fileds);
        const tarB: any[] = this.ProcessSCBs(d, s2, fileds, n);
        tarA.map((it: any, index: number) => (it.key = s1 + index));
        this.SortBy(tarA, "Capacity");
        this.GetImpedance(tarA);
        tarB.map((it: any, index: number) => (it.key = s2 + index));
        this.SortBy(tarB, "Capacity");
        this.GetImpedance(tarB);
        this.setState({
            tableData: [{
                title: d.GoodsSeriesName + '-' + s1,
                Data: tarA,
            }, {
                title: d.GoodsSeriesName + '-' + s2,
                Data: tarB,
            }],
            tableDatas: [{
                title: d.GoodsSeriesName + '-' + s1,
                Data: tarA,
            }, {
                title: d.GoodsSeriesName + '-' + s2,
                Data: tarB,
            }]
        });
    }
    // 有温
    Gettable = (d: any, s1: string, s2: string, s3: string, s4: string, filed: string, fileds: string) => {
        const tarA: any[] = this.ProcessSCB(d, s1, s3, s4, filed, fileds);
        const tarB: any[] = this.ProcessSCB(d, s2, s3, s4, filed, fileds);
        tarA.map((it: any, index: number) => (it.key = s1 + index));
        this.SortBy(tarA, "Capacity");
        this.GetImpedance(tarA);
        tarB.map((it: any, index: number) => (it.key = s2 + index));
        this.SortBy(tarB, "Capacity");
        this.GetImpedance(tarB);
        this.setState({
            tableData: [{
                title: d.GoodsSeriesName + '-' + s1,
                Data: tarA,
            }, {
                title: d.GoodsSeriesName + '-' + s2,
                Data: tarB,
            }],
            tableDatas: [{
                title: d.GoodsSeriesName + '-' + s1,
                Data: tarA,
            }, {
                title: d.GoodsSeriesName + '-' + s2,
                Data: tarB,
            }]
        });
    }
    ProcessSCB = (d: any, s: string, s1: string, s2: string, filed: string, fileds: string) => {
        let arrOne: any[] = [];
        let oneNationalO: any[] = [];
        let oneNationalT: any[] = [];
        if (d.product_list && d.product_list.length) {
            arrOne = d.product_list.filter((ds: any) => ds[fileds] === s);
            oneNationalO = arrOne.filter((ds: any) => ds[filed] === s1);
            oneNationalT = arrOne.filter((ds: any) => ds[filed] === s2);
            if (oneNationalT.length) {
                oneNationalO.forEach((is: any) => {
                    oneNationalT.forEach((cis: any) => {
                        if (cis.Capacity === is.Capacity &&
                            cis.Standard === is.Standard &&
                            cis.Impedance === is.Impedance) {
                            is.GoodsPrices = [];
                            is.GoodsPrices[0] = is.GoodsPrice;
                            is.GoodsPrices.push(cis.GoodsPrice);
                        }
                    });
                });
                this.setState({
                    tabtitle: [
                        {
                            title: '容量',
                            dataIndex: 'Capacity',
                            key: "Capacity",
                            align: "center",
                        },
                        {
                            title: '售价(含税价格，不含运费)',
                            key: "ProductPrice",
                            align: "center",
                            children: [
                                {
                                    title: s1,
                                    dataIndex: "GoodsPrices[0]",
                                    key: "TemperatureRiseO",
                                    align: "center",
                                },
                                {
                                    title: s2,
                                    dataIndex: "GoodsPrices[1]",
                                    key: "TemperatureRiseT",
                                    align: "center",
                                }
                            ]
                        },
                    ]
                })
            } else {
                oneNationalO.forEach((is: any) => {
                    is.GoodsPrices = [];
                    is.GoodsPrices[0] = is.GoodsPrice;
                });
                this.setState({
                    tabtitle: [
                        {
                            title: '容量',
                            dataIndex: 'Capacity',
                            key: "Capacity",
                            align: "center",
                        },
                        {
                            title: '售价(含税价格，不含运费)',
                            key: "ProductPrice",
                            align: "center",
                            children: [
                                {
                                    title: s1,
                                    dataIndex: "GoodsPrices[0]",
                                    key: "TemperatureRiseO",
                                    align: "center",
                                }
                            ]
                        },
                    ]
                })
            }
        }
        return oneNationalO;
    }
    ProcessData_X = (d: any) => {
        // console.log(d);
        this.setState({
            tabtitle: [
                {
                    title: '规格型号',
                    dataIndex: 'Total',
                    key: "Total",
                    align: "center",
                    // backgroundColor: "#E1F2F9",
                    // onHeaderRow:
                },
                {
                    title: '价格',
                    dataIndex: "GoodsPrice",
                    key: "GoodsPrice",
                    align: "center",
                },
            ]
        })
        if (d.product_list && d.product_list.length) {
            d.product_list.map((it: any, index: number) => (
                it.key = index
            ));
            d.product_list.forEach((it: any) => {
                it.Total = '';
                if (it.ProductParams.length) {
                    it.ProductParams.forEach((pis: any) => {
                        for (const field in pis) {
                            it.Total += pis[field]
                        }
                    });
                } else {
                    const v = it.Variety ? it.Variety + "   " : '';
                    const i = it.Specification ? it.Specification + "   " : '';
                    const r = it.Weight ? it.Weight : '';
                    it.Total = v + i + r;
                }
            });
            this.SortBy(d.product_list, "GoodsPrice");
            this.GetImpedance(d.product_list);
            this.setState({
                tableData: [{
                    title: d.GoodsSeriesName,
                    Data: d.product_list,
                }],
                tableDatas: [{
                    title: d.GoodsSeriesName,
                    Data: d.product_list,
                }]
            });
        } else {
            this.setState({
                tableData: [{
                    title: '',
                    Data: [],
                }],
                tableDatas: [{
                    title: '',
                    Data: [],
                }]
            });
        }
    }
    SortBy = (arr: any[], str: string) => {
        arr.sort((a: any, b: any) => {
            let tarA: any;
            let tarB: any;
            if (str === "Capacity") {
                tarA = Number(a[str].slice(0, a[str].length - 3));
                tarB = Number(b[str].slice(0, b[str].length - 3));
            } else if (str === "RatedCurrent") {
                tarA = Number(a[str].slice(0, a[str].length - 1));
                tarB = Number(b[str].slice(0, b[str].length - 1));
            } else {
                tarA = a[str];
                tarB = b[str];
            }
            return tarA - tarB;
        });
    }
    GetImpedance = (d: any) => {
        d.forEach((ds: any) => {
            if (ds.Impedance !== '4%') {
                ds.Capacity = ds.Capacity + "(" + ds.Impedance + ")";
            }
        });
    }
    onSearch = (val: any) => {
        if (!val) {
            this.componentWillMount();
        } else {
            if (this.state.tableDatas.length === 1) {
                let tarA = [];
                const arr = this.state.tableDatas[0].Data.filter((ds: any) => ds.Total.indexOf(val) != -1 || ds.GoodsPrice.indexOf(val) != -1);
                const name = this.state.tableDatas[0].title;
                if (!arr.length) {
                    tarA = this.state.tableDatas[0].Data.filter((ds: any) => ds.Capacity.indexOf(val) != -1 || ds.GoodsPrice.indexOf(val) != -1);
                    this.setState({
                        tableData: [{
                            Data: tarA,
                            title: name,
                        }
                        ]
                    })
                } else {
                    this.setState({
                        tableData: [{
                            Data: arr,
                            title: name,
                        }
                        ]
                    })
                }
            } else if (this.state.tableDatas.length > 1) {
                let tarB = [];
                if (!Array.isArray(this.state.tableDatas[0].Data[0])) {
                    this.state.tableDatas.forEach((ts: any) => {
                        const arr = ts.Data.filter((ds: any) => ds.Capacity.indexOf(val) != -1 || ds.GoodsPrice.indexOf(val) != -1);
                        const name = ts.title;
                        tarB.push({
                            Data: arr,
                            title: name,
                        })
                    });
                } else {
                    this.state.tableDatas.forEach((ts: any) => {
                        let tarC = [];
                        ts.Data.forEach((ds: any) => {
                            const arr = ds.filter((dis: any) => dis.Capacity.indexOf(val) != -1 || ds.GoodsPrice.indexOf(val) != -1);
                            tarC.push(arr);
                        });
                        const name = ts.title;
                        tarB.push({
                            Data: tarC,
                            title: name,
                        });
                    });
                }
                this.setState({
                    tableData: tarB
                });
            }
        }
    }
    render() {
        // const time = new Date().getFullYear() + "年" + (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
        const time = (new Date().getMonth() + 1) + "月" + new Date().getDate() + "日";
        // console.log(JSON.stringify(this.state.tableData));
        // console.log(JSON.stringify(this.state.tabtitle));
        return (
            < div style={{ padding: "25px 5px" }
            }>
                <Search
                    placeholder="请输入搜索内容"
                    onSearch={this.onSearch}
                    // onChange={this.Change}
                    style={{ width: "100%" }}
                />
                <Row style={{ padding: "5px 0" }}>
                    <Col span={12}><p className='tips'>标准品</p></Col>
                    <Col span={12} style={{ textAlign: "right" }}><strong>{time}</strong></Col>
                </Row>
                {
                    this.state.tabtitle && this.state.tabtitle.length && this.state.tabtitle[0].title !== "技术参数" && this.state.tabtitle[0].title !== '规格型号' ? (
                        <Row style={{ padding: "5px 0", backgroundColor: '#F2F2F2' }}>
                            <Col span={16} style={{ padding: '1px 0' }}><span>铜价：{this.state.Price.TongPrice}元/吨</span></Col>
                            <Col span={8} style={{ textAlign: "right", padding: '1px 0' }}>
                                {Number(this.state.Price.TongPriceChange) > 0 ? (
                                    <span className='rose'>+{this.state.Price.TongPriceChange}元/吨</span>
                                ) : (
                                        <span className='fall'>{this.state.Price.TongPriceChange}元/吨</span>
                                    )}
                            </Col>
                            <Col span={16} style={{ padding: '1px 0' }}><span>铝价：{this.state.Price.LvPrice}元/吨</span></Col>
                            <Col span={8} style={{ textAlign: "right", padding: '1px 0' }}>
                                {Number(this.state.Price.LvPriceChange) > 0 ? (
                                    <span className='rose'>+{this.state.Price.LvPriceChange}元/吨</span>
                                ) : (
                                        <span className='fall'>{this.state.Price.LvPriceChange}元/吨</span>
                                    )}
                            </Col>
                        </Row>
                    ) : null
                }
                {
                    this.state.tableData.map((tis: any, tic: number) => (
                        <div key={"tableData" + tic}>

                            <strong>
                                {tis.title.split("(")[0]}
                                {
                                    tis.title.split("(")[1] ? (
                                        <small>({tis.title.split("(")[1]}</small>
                                    ) : null
                                }
                            </strong>
                            {
                                this.state.isShow ? (
                                    < table
                                        border="0" width="100%" align="center"
                                        style={{ margin: "16px 0", wordWrap: "break-word", wordBreak: "break-all" }}>
                                        {
                                            this.state.tabtitle[0].title === "技术参数" ? (
                                                <thead style={{ borderBottom: "1px solid #4dbecd" }}>
                                                    <tr className="header-tab linestyle">
                                                        <th style={{ width: "75%", textAlign: "left", paddingLeft: "1em" }} className="header-line">{this.state.tabtitle[0].title}</th>
                                                        <th style={{ width: "25%" }} >
                                                            <table
                                                                border="0"
                                                                width="100%"
                                                                align="center"
                                                            >
                                                                <thead>
                                                                    <tr className="linestyle header-tab-two">
                                                                        <th className="linh">{this.state.tabtitle[1].title.split("(")[0]}
                                                                            {
                                                                                this.state.tabtitle[1].title.split("(")[1] ? (
                                                                                    <small>({this.state.tabtitle[1].title.split("(")[1]}</small>
                                                                                ) : null
                                                                            }
                                                                        </th>
                                                                    </tr>
                                                                    {
                                                                        this.state.tabtitle[1].children ? (
                                                                            <tr className="header-tab-two">
                                                                                <th className="linh">
                                                                                    <table
                                                                                        border="0"
                                                                                        width="100%"
                                                                                        align="center"
                                                                                    >
                                                                                        <thead>
                                                                                            {
                                                                                                this.state.tabtitle[1].children[1] ? (
                                                                                                    <tr>
                                                                                                        <th className={"width-50"} style={{ color: "#4dbecd" }}>{this.state.tabtitle[1].children[0].title}</th>
                                                                                                        <th className={"width-50"} style={{ color: "#ffb717" }}>{this.state.tabtitle[1].children[1].title}</th>
                                                                                                    </tr>
                                                                                                ) : (
                                                                                                        <tr>
                                                                                                            <th style={{ color: "#4dbecd" }}>{this.state.tabtitle[1].children[0].title}</th>
                                                                                                        </tr>
                                                                                                    )
                                                                                            }
                                                                                        </thead>
                                                                                    </table>
                                                                                </th>
                                                                            </tr>
                                                                        ) : null
                                                                    }

                                                                </thead>
                                                            </table>
                                                        </th>
                                                    </tr>
                                                </thead>
                                            ) : (
                                                    <thead style={{ borderBottom: "1px solid #4dbecd" }}>
                                                        <tr className="header-tab linestyle">
                                                            <th className="header-line">{this.state.tabtitle[0].title}</th>
                                                            <th >
                                                                <table
                                                                    border="0"
                                                                    width="100%"
                                                                    align="center"
                                                                >
                                                                    <thead>
                                                                        <tr className="linestyle header-tab-two">
                                                                            <th className="linh">{this.state.tabtitle[1].title.split("(")[0]}
                                                                                {
                                                                                    this.state.tabtitle[1].title.split("(")[1] ? (
                                                                                        <small>({this.state.tabtitle[1].title.split("(")[1]}</small>
                                                                                    ) : null
                                                                                }
                                                                            </th>
                                                                        </tr>
                                                                        {
                                                                            this.state.tabtitle[1].children ? (
                                                                                <tr className="header-tab-two">
                                                                                    <th className="linh">
                                                                                        <table
                                                                                            border="0"
                                                                                            width="100%"
                                                                                            align="center"
                                                                                        >
                                                                                            <thead>
                                                                                                {
                                                                                                    this.state.tabtitle[1].children[1] ? (
                                                                                                        <tr>
                                                                                                            <th className={"width-50"} style={{ color: "#4dbecd" }}>{this.state.tabtitle[1].children[0].title}</th>
                                                                                                            <th className={"width-50"} style={{ color: "#ffb717" }}>{this.state.tabtitle[1].children[1].title}</th>
                                                                                                        </tr>
                                                                                                    ) : (
                                                                                                            <tr>
                                                                                                                <th style={{ color: "#4dbecd" }}>{this.state.tabtitle[1].children[0].title}</th>
                                                                                                            </tr>
                                                                                                        )
                                                                                                }
                                                                                            </thead>
                                                                                        </table>
                                                                                    </th>
                                                                                </tr>
                                                                            ) : null
                                                                        }

                                                                    </thead>
                                                                </table>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                )
                                        }
                                        {
                                            this.state.tabtitle[0].title === "技术参数" ? (
                                                <tbody>
                                                    {
                                                        tis.Data.map((tds: any, i: number) => (
                                                            <tr key={"tis" + i} className="linestyle  bodyLine">
                                                                <td style={{ width: "75%", textAlign: "left", paddingLeft: "1em" }}>{tds.Total ? tds.Total : (tds.Capacity ? tds.Capacity : '')}</td>
                                                                <td style={{ width: "25%" }}>
                                                                    <table
                                                                        border="0"
                                                                        width="100%"
                                                                        align="center"
                                                                    >
                                                                        <thead>
                                                                            <tr>
                                                                                <td>
                                                                                    <table
                                                                                        border="0"
                                                                                        width="100%"
                                                                                        align="center"
                                                                                    >
                                                                                        <thead>
                                                                                            {
                                                                                                tds.GoodsPrices ? (
                                                                                                    <tr>
                                                                                                        {
                                                                                                            tds.GoodsPrices.map((tps: any, i: number) => (
                                                                                                                <td className={"width-50"} key={"tps" + i}>{tps}</td>
                                                                                                            ))
                                                                                                        }
                                                                                                    </tr>
                                                                                                ) : (
                                                                                                        <tr>
                                                                                                            <td style={{ color: "#ffb717" }}>{tds.GoodsPrice}</td>
                                                                                                        </tr>
                                                                                                    )
                                                                                            }
                                                                                        </thead>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </thead>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            ) : (
                                                    <tbody>
                                                        {
                                                            tis.Data.map((tds: any, i: number) => (
                                                                <tr key={"tis" + i} className="linestyle  bodyLine">
                                                                    <td>{tds.Total ? tds.Total : (tds.Capacity ? tds.Capacity : '')}</td>
                                                                    <td>
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            align="center"
                                                                        >
                                                                            <thead>
                                                                                <tr>
                                                                                    <td>
                                                                                        <table
                                                                                            border="0"
                                                                                            width="100%"
                                                                                            align="center"
                                                                                        >
                                                                                            <thead>
                                                                                                {
                                                                                                    tds.GoodsPrices ? (
                                                                                                        <tr>
                                                                                                            {
                                                                                                                tds.GoodsPrices.map((tps: any, i: number) => (
                                                                                                                    <td className={"width-50"} key={"tps" + i}>{tps}</td>
                                                                                                                ))
                                                                                                            }
                                                                                                        </tr>
                                                                                                    ) : (
                                                                                                            <tr>
                                                                                                                <td style={{ color: "#ffb717" }}>{tds.GoodsPrice}</td>
                                                                                                            </tr>
                                                                                                        )
                                                                                                }
                                                                                            </thead>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </thead>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }
                                                    </tbody>
                                                )
                                        }
                                    </table>
                                ) : (
                                        < table
                                            border="0"
                                            width="100%"
                                            align="center"
                                            style={{ margin: "16px 0", fontSize: "12px" }}>
                                            <thead style={{ borderBottom: "1px solid #4dbecd" }}>
                                                <tr className="header-tab linestyle">
                                                    <th className="header-line">{this.state.tabtitle[0].title}</th>
                                                    {
                                                        this.state.tableData[tic].Data.map((ts: any, i: number) => (
                                                            <th key={"tableData" + i}>
                                                                <table
                                                                    border="0"
                                                                    width="100%"
                                                                    align="center"
                                                                >
                                                                    <thead
                                                                        style={{ tableLayout: "fixed" }}>
                                                                        <tr className="linestyle header-tab-two">
                                                                            <th className="linh">{ts && ts[0] && ts[0].GoodsTitle ? ts[0].GoodsTitle.slice(0, 4) : ''}</th>
                                                                        </tr>
                                                                        <tr className="header-tab-two">
                                                                            <th className="linh">
                                                                                <table
                                                                                    border="0"
                                                                                    width="100%"
                                                                                    align="center"
                                                                                >
                                                                                    <thead>
                                                                                        <tr>
                                                                                            <th className={"width-50"} style={{ color: "#4dbecd" }}>{"标高"}</th>
                                                                                            <th className={"width-50"} style={{ color: "#ffb717" }}>{"+2.2m"}</th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                </table>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </th>
                                                        ))
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    this.state.tableData[tic].Data[0].map((tds: any, i: number) => (
                                                        <tr key={"tis" + i} className="linestyle  bodyLine">
                                                            <td>{tds.Capacity}</td>
                                                            {
                                                                this.state.tableData[tic].Data.map((ts: any, is: number) => (
                                                                    <td key={"catpicy" + is}>
                                                                        <table
                                                                            border="0"
                                                                            width="100%"
                                                                            align="center"
                                                                        >
                                                                            <thead>
                                                                                <tr>
                                                                                    <td>
                                                                                        <table
                                                                                            border="0"
                                                                                            width="100%"
                                                                                            align="center"
                                                                                        >
                                                                                            <thead>
                                                                                                <tr>
                                                                                                    <td className={"width-50"} style={{ color: "#4dbecd" }} >{ts && ts[i] && ts[i].prices.length ? ts[i].prices[0] : ''}</td>
                                                                                                    <td className={"width-50"} style={{ color: "#ffb717" }} >{ts && ts[i] && ts[i].prices.length ? ts[i].prices[1] : ''}</td>
                                                                                                </tr>
                                                                                            </thead>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </thead>
                                                                        </table>
                                                                    </td>
                                                                ))
                                                            }
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    )
                            }
                        </div>
                    ))
                }
                {
                    this.state.tableData.length && !this.state.tableData[0].Data.length ? (
                        <div style={{ paddingTop: "3em", width: '100%', verticalAlign: 'middle', textAlign: 'center' }}>
                            <img src="./image/tuzi02.png" style={{ width: "45%" }} />
                            <p style={{ color: "#4dbecd" }}>商家努力备货中，谢谢您的关注，商品更新小兔会第一时间通知您哦！</p>
                        </div>
                    ) : null
                }
            </div >
        );
    }
}
export default withRouter(Today);