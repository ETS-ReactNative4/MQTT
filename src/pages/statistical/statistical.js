import * as React from 'react';
import './statistical.css';
import { Col, Row, message, Carousel } from 'antd';
import { withRouter } from 'react-router-dom';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/map';
import 'echarts/map/js/china';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/map/js/china';
// import './show/china.js';
import { connect } from 'mqtt';
import Url from '../../service/Url';
import Http from '../../service/Http';

class Statistical extends React.Component {
    client = null;
    colorList = ['#87CEFA', '#1ef01b', '#fbb03b', '#c527ff', '#ff473e', '#66f7ef', '#FF34B3', '#8B0000', '#68228B'];
    showColor = '#275590';
    time = null;
    idx = 0;
    start = 0;
    arr = [];
    constructor(props) {
        super(props);
        this.state = {
            CategoryList: [],
            rollingfaclist: [],
            ShowData: {},
            ShowList: [],
            factList: [],
            si: [],
            arr: [{ Show: [] }, { Show: [] }, { Show: [] }],
            list1: [],
            list2: [],
            list3: []
        };
    }
    componentWillMount() {
        this.mqttConnect();
    }
    // componentDidMount() {
    //     this.GetUserlist();
    // }
    componentWillUnmount() {
        localStorage.setItem('ShowData', JSON.stringify(this.state.ShowData));
        clearInterval(this.time);
    }
    // 二级分类
    async GetCategory() {
        // const {
        //     ResultInfo: info,
        //     ResultCode: code,
        //     Data: data,
        // } = await Http.get(Url.baseUrl + `/web/category_b`);
        // if (code !== Http.ok) {
        //     return message.error(info);
        // }
        // if (data.length) {
        //     this.setState({ CategoryList: data });
        //     const pros = []
        //     data.forEach((ds) => {
        //         pros.push(this.Gethengshuirollingfaclist(ds))
        //     })
        //     Promise.all(pros).then(it => {
        //         this.setState({ rollingfaclist: this.arr }, () => {
        //             this.initMap();
        //             this.GetShowList();
        //         });
        //     })
        // }
        this.arr = [];
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/console/hengshuivirshowconfignew`);
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.length) {
            this.setState({ CategoryList: data });
            const pros = []
            data.filter(ds => ds.DataType === '0').forEach((ds) => {
                pros.push(this.Gethengshuirollingfaclist(ds));
            });
            Promise.all(pros).then(it => {
                this.setState({ rollingfaclist: this.arr }, () => {
                    this.initMap();
                    this.GetShowList();
                });
            })
        }
    }
    // 用户信息
    // async GetUserlist() {
    //     const {
    //         ResultInfo: info,
    //         ResultCode: code,
    //         Data: data,
    //     } = await Http.get(Url.baseUrl + `/console/hengshuivirshowconfig`);
    //     if (code !== Http.ok) {
    //         const s = localStorage.getItem('ShowData');
    //         if (s) {
    //             const ss = JSON.parse(s)
    //             this.GetPie(ss);
    //         }
    //         return message.error(info);
    //     }
    //     localStorage.setItem('ShowData', JSON.stringify(data));
    //     this.GetPie(data);
    // }
    // 工厂信息
    async Gethengshuirollingfaclist(id) {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/console/hengshuirollingfaclist`, {
            pageIndex: 1,
            pageSize: 100,
            CategoryBId: id.CategoryBId,
            SearchContent: ''
        });
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.ResultList.length) {
            this.arr.push({
                CategoryName: id.CategoryBName,
                list: data.ResultList,
            });
        }
    }
    // mqtt链接
    mqttConnect() {
        const op = {
            clientId: "report/002",
            port: 8884,
            host: Url.mqttUrl,
            protocol: 'ws',
            clean: false,
            keepalive: 60,
        };
        const client = connect(op);
        client.on('connect', () => {
            client.subscribe("report/user", { qos: 0 },
                (err) => {
                    if (err) {
                        // this.mqttConnect();
                        message.warn('Please reconnect')
                    }
                }
            );
        });
        client.on('message', (topic, msg) => {
            const data = JSON.parse(msg.toString());
            // console.log(data);
            if (data.ShowData && data.ShowData.SaleroomStatistics) {
                // console.log(data.ShowData);
                this.GetPie(data.ShowData);
            }
        });
        this.client = client;
    }
    cates = () => {
        if (!this.state.ShowData.SaleroomStatistics || !this.state.ShowData.SaleroomStatistics.length) {
            return []
        }
        const arr = [];
        this.state.ShowData.SaleroomStatistics.forEach((s, i) => {
            arr.push({
                name: s.CategoryBName,
                color: this.colorList[i]
            });
        });
        return arr
    }
    GetPie(cur) {
        // const arr = [];
        // const Brr = [];
        // cur.SaleroomStatistics.forEach((us, i) => {
        //     arr.push({
        //         value: us.VipSum,
        //         name: us.CategoryBName + '会员用户',
        //         itemStyle: {
        //             normal: {
        //                 color: this.colorList[i],
        //             }
        //         }
        //     });
        //     Brr.push(us.CategoryBName + '会员用户');
        // });
        // let myChart = echarts.init(document.getElementById('pie'));
        // this.initPieChart(myChart, '', arr, {
        //     orient: 'vertical',
        //     align: 'left',
        //     x: 'right',
        //     data: Brr,
        //     textStyle: {
        //         color: '#fffdff',
        //     }
        // });
        this.GetLists(cur)
    }
    GetShowList() {
        const l = this.state.rollingfaclist;
        const tar = [];
        l.forEach((ls) => {
            const arr = [];
            ls.list.forEach((fs, fd) => {
                if (fd < ls.list.length - 2) {
                    arr.push([fs, ls.list[fd + 1], ls.list[fd + 2]]);
                } else {
                    if (fd === ls.list.length - 2) {
                        arr.push([fs, ls.list[fd + 1], ls.list[0]]);
                    } else if (fd === ls.list.length - 1) {
                        arr.push([fs, ls.list[0], ls.list[1]]);
                    }
                }
            });
            tar.push({ Bn: ls.CategoryName, Show: arr });
        });
        tar.forEach(it => {
            it.idx = 0
        })
        this.setState({ factList: tar });
    }

    sp = (tip) => {
        let arr = [];
        this.state.factList.forEach(it => {
            if (it.Bn === tip) {
                arr = it.Show.length <= 6 ? it.Show : it.Show.slice(it.idx, it.idx + 6)
            }
        })
        return arr
    }

    changeIdx = (tip) => () => {
        this.state.factList.forEach(it => {
            if (it.Bn === tip) {
                if (it.idx + 6 > it.Show.length) {
                    it.idx = 0
                    return
                }
                it.idx = it.idx + 6;
            }
        })
    }

    toThousands(num) {
        var result = [], counter = 0;
        num = (num || 0).toString().split('');
        for (var i = num.length - 1; i >= 0; i--) {
            counter++;
            result.unshift(num[i]);
            if (!(counter % 3) && i != 0) { result.unshift(','); }
        }
        return result.join('');
    }

    GetList() {
        const s = this.state;
        const t = s.ShowData.SaleroomStatistics;
        const arr = [];
        s.ShowData.SaleroomStatistics.forEach((is, it) => {
            if (it < t.length - 2) {
                arr.push(
                    [
                        { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                        { Bid: t[it + 1].CategoryBId, Cn: t[it + 1].CategoryBName, Sa: t[it + 1].SaleSum, Sn: t[it + 1].SaleCurMonAdd, R: t[it + 1].SaleRate, i: it + 1 },
                        { Bid: t[it + 2].CategoryBId, Cn: t[it + 2].CategoryBName, Sa: t[it + 2].SaleSum, Sn: t[it + 2].SaleCurMonAdd, R: t[it + 2].SaleRate, i: it + 2 },
                    ]
                );
            } else {
                if (it === t.length - 2) {
                    arr.push(
                        [
                            { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                            { Bid: t[it + 1].CategoryBId, Cn: t[it + 1].CategoryBName, Sa: t[it + 1].SaleSum, Sn: t[it + 1].SaleCurMonAdd, R: t[it + 1].SaleRate, i: it + 1 },
                            { Bid: t[0].CategoryBId, Cn: t[0].CategoryBName, Sa: t[0].SaleSum, Sn: t[0].SaleCurMonAdd, R: t[0].SaleRate, i: 0 },
                        ]
                    );
                } else if (it === t.length - 1) {
                    arr.push(
                        [
                            { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                            { Bid: t[0].CategoryBId, Cn: t[0].CategoryBName, Sa: t[0].SaleSum, Sn: t[0].SaleCurMonAdd, R: t[0].SaleRate, i: 0 },
                            { Bid: t[1].CategoryBId, Cn: t[1].CategoryBName, Sa: t[1].SaleSum, Sn: t[1].SaleCurMonAdd, R: t[1].SaleRate, i: 1 },
                        ]
                    );
                }
            }
        });
        this.setState({ ShowList: arr }, () => {
            arr.forEach((si, it) => {
                this.creatDiv(si, 'pie' + it.toString() + si[0].i.toString(), 0);
                this.creatDiv(si, 'pie' + it.toString() + si[1].i.toString(), 1);
                this.creatDiv(si, 'pie' + it.toString() + si[2].i.toString(), 2);
            });
        });
    }
    GetLists(cur) {
        const t = cur.SaleroomStatistics.filter(cs => cs.CategoryBName !== '设计师用户数' && cs.CategoryBName !== '工厂数');
        const arr = [];
        this.idx = 0;
        t.forEach((is, it) => {
            if (it < t.length - 2) {
                arr.push(
                    [
                        { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                        { Bid: t[it + 1].CategoryBId, Cn: t[it + 1].CategoryBName, Sa: t[it + 1].SaleSum, Sn: t[it + 1].SaleCurMonAdd, R: t[it + 1].SaleRate, i: it + 1 },
                        { Bid: t[it + 2].CategoryBId, Cn: t[it + 2].CategoryBName, Sa: t[it + 2].SaleSum, Sn: t[it + 2].SaleCurMonAdd, R: t[it + 2].SaleRate, i: it + 2 },
                    ]
                );
            } else {
                if (it === t.length - 2) {
                    arr.push(
                        [
                            { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                            { Bid: t[it + 1].CategoryBId, Cn: t[it + 1].CategoryBName, Sa: t[it + 1].SaleSum, Sn: t[it + 1].SaleCurMonAdd, R: t[it + 1].SaleRate, i: it + 1 },
                            { Bid: t[0].CategoryBId, Cn: t[0].CategoryBName, Sa: t[0].SaleSum, Sn: t[0].SaleCurMonAdd, R: t[0].SaleRate, i: 0 },
                        ]
                    );
                } else if (it === t.length - 1) {
                    arr.push(
                        [
                            { Bid: is.CategoryBId, Cn: is.CategoryBName, Sa: is.SaleSum, Sn: is.SaleCurMonAdd, R: is.SaleRate, i: it },
                            { Bid: t[0].CategoryBId, Cn: t[0].CategoryBName, Sa: t[0].SaleSum, Sn: t[0].SaleCurMonAdd, R: t[0].SaleRate, i: 0 },
                            { Bid: t[1].CategoryBId, Cn: t[1].CategoryBName, Sa: t[1].SaleSum, Sn: t[1].SaleCurMonAdd, R: t[1].SaleRate, i: 1 },
                        ]
                    );
                }
            }
        });
        this.setState({ ShowList: arr, ShowData: cur },
            // () => {
            //     if (!this.state.factList.length) {
            //         this.GetCategory()
            //     }
            //     if (!this.time) {
            //         this.getShowPie(arr, this.idx)
            //     }
            //     if (this.time) {
            //         clearInterval(this.time)
            //     }
            //     this.time = setInterval(() => {
            //         this.getShowPie(arr, this.idx);
            //         if (this.idx === arr.length - 1) {
            //             this.idx = 0;
            //         } else {
            //             this.idx++;
            //         }
            //     }, 6500);
            // }
        );
        setTimeout(() => {
            if (!this.state.factList.length) {
                this.GetCategory()
            }
            if (!this.time) {
                this.getShowPie(arr, this.idx)
            }
            if (this.time) {
                clearInterval(this.time)
            }
            this.time = setInterval(() => {
                this.getShowPie(arr, this.idx);
                if (this.idx === arr.length - 1) {
                    this.idx = 0;
                } else {
                    this.idx++;
                }
            }, 6500);
        }, 0)
    }
    getShowPie(arr, l) {
        this.setState({ si: arr[l] }, () => {
            this.creatDiv(this.state.si, 'pie1', 0);
            this.creatDiv(this.state.si, 'pie2', 1);
            this.creatDiv(this.state.si, 'pie3', 2);
        });
    }
    creatDiv(arr, id, it) {
        if (document.getElementById(id)) {
            let myChartO = echarts.init(document.getElementById(id));
            const Oarr = [
                {
                    value: arr[it].R,
                    name: '',
                    itemStyle: {
                        normal: {
                            color: this.colorList[arr[it].i],
                        }
                    }
                },
                {
                    value: 1 - arr[it].R,
                    name: '',
                    itemStyle: {
                        normal: {
                            color: this.showColor,
                        }
                    }
                },
            ];
            this.initPieChart(myChartO, '环比增长', Oarr);
        }
    }
    // pie 图
    initPieChart(tar, ShowName, datalist, l) {
        tar.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a}{b}: {d}%"
            },
            legend: l,
            series: [
                {
                    name: ShowName,
                    type: 'pie',
                    radius: ['70%', '100%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: datalist,
                }
            ]
        });
    }
    initMap() {
        let map = echarts.init(document.getElementById('map'));
        const allData = [];
        this.state.rollingfaclist.forEach((fs, ft) => {
            fs.list.forEach((fis) => {
                allData.push({
                    name: fis.FactoryName,
                    value: [fis.Longitude, fis.Latitude],
                    symbolSize: 2,
                    itemStyle: {
                        normal: {
                            color: this.colorList[ft],
                        }
                    }
                });
            });
        });
        // console.log(allData);
        map.setOption({
            backgroundColor: 'transparent',
            title: {
                text: '',
                left: 'center',
                textStyle: {
                    color: 'transparent'
                }
            },
            legend: {
                show: false,
                orient: 'vertical',
                top: 'bottom',
                left: 'right',
                data: ['地点', '线路'],
                textStyle: {
                    color: 'transparent'
                }
            },
            geo: {
                zoom: 1.4,
                map: 'china',
                center: [101.971685, 32.481341],
                label: {
                    emphasis: {
                        show: false
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: 'transparent',
                        borderColor: '#007aff',
                    },
                    emphasis: {
                        areaColor: 'transparent',
                    }
                },

            },
            series: [{
                name: '地点',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    emphasis: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: 2,
                showEffectOn: 'render',
                itemStyle: {
                    normal: {
                        color: '#46bee9'
                    }
                },
                data: allData
            },
                // {
                //     name: '线路',
                //     type: 'lines',
                //     coordinateSystem: 'geo',
                //     zlevel: 2,
                //     large: true,
                //     effect: {
                //         show: true,
                //         constantSpeed: 30,
                //         symbol: 'pin',
                //         symbolSize: 3,
                //         trailLength: 0,
                //     },
                //     lineStyle: {
                //         normal: {
                //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                //                 offset: 0, color: 'red'
                //             }, {
                //                 offset: 1, color: 'blue'
                //             }], false),
                //             width: 1,
                //             opacity: 0.2,
                //             curveness: 0.1
                //         }
                //     },
                //     data: allData.moveLines
                // }
            ]
        });
    }
    componentWillUnmount() {
        document.documentElement.style.height = 'auto'
        document.body.style.height = 'auto'
    }
    clear = () => {
        localStorage.clear();
        window.location.reload();
    }
    render() {
        const s = this.state;
        // console.log(s.ShowData);
        return (
            <div className='bg' style={{ display: 'flex', flexDirection: 'column' }}>
                <Row>
                    <Col onDoubleClick={this.clear}><img src='./image/show/6.png' style={{ width: '100%' }} /></Col>
                </Row>
                <div style={{ width: '100%', height: '90px', marginTop: '-36px', position: 'relative' }}>
                    <div>
                        <div style={{ display: 'inline-block', width: '37.5%', position: 'absolute', bottom: '-8px', left: '1%' }}>
                            <div className='text' style={{ marginRight: '10px', position: 'relative' }}>
                                <img src='./image/show/1.png' style={{ width: '100%', height: '60px' }} />
                                <div style={{ position: 'absolute', bottom: '0', left: '5%' }}>
                                    <p className='text'>设计师数量</p>
                                    {/* cur.SaleroomStatistics.filter(cs => cs.CategoryBName !== '设计师用户数' && cs.CategoryBName !== '工厂数') */}
                                    <p className='show'>{this.toThousands(s.ShowData && s.ShowData.SaleroomStatistics && s.ShowData.SaleroomStatistics.length &&
                                        s.ShowData.SaleroomStatistics.filter(cs => cs.CategoryBName === '设计师用户数').length ?
                                        s.ShowData.SaleroomStatistics.filter(cs => cs.CategoryBName === '设计师用户数')[0].VipSum : 0)}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', left: '40.5%' }}>
                                    <p className='text'>工厂数量</p>
                                    <p className='show'>{this.toThousands(s.ShowData && s.ShowData.SaleroomStatistics && s.ShowData.SaleroomStatistics.length &&
                                        s.ShowData.SaleroomStatistics.filter(cs => cs.CategoryBName === '工厂数').length ?
                                        s.ShowData.SaleroomStatistics.filter(cs => cs.CategoryBName === '工厂数')[0].VipSum : 0)}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', left: '76%' }}>
                                    <p className='text'>APP用户数</p>
                                    <p className='show'>{this.toThousands(s.ShowData.UserStatistics ? s.ShowData.UserStatistics.UserSum : 0)}</p>
                                </div>
                            </div>
                        </div>
                        {/* <div style={{ display: 'inline-block', width: '60%', position: 'absolute', right: '0', top: '8px' }}>
                            <div style={{ paddingRight: '1.5%', position: 'relative' }}>
                                <img src='./image/show/2.png' style={{ width: '100%', height: '90px' }} />
                                <div style={{ position: 'absolute', bottom: '0', left: '1%' }}>
                                    <p className='hui'>会员用户</p>
                                    <p className='show'>{this.toThousands(s.ShowData.UserStatistics ? s.ShowData.UserStatistics.AllVipSum : 0)}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', left: '18%' }}>
                                    <p className='hui'>当月会员</p>
                                    <p className='show'>{this.toThousands(s.ShowData.UserStatistics ? s.ShowData.UserStatistics.AllVipCurMonAdd : 0)}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', left: '37%' }}>
                                    <p className='hui'>环比增长率</p>
                                    <p className='show'>{s.ShowData.UserStatistics ? (Number(s.ShowData.UserStatistics.VipRate) * 100).toString() + '%' : '0%'}</p>
                                </div>
                                <div style={{ position: 'absolute', bottom: '0', right: '24px', bottom: '0', textAlign: 'right' }}>
                                    <div style={{ width: '258px', padding: '8px', height: '90px', textAlign: 'left' }}>
                                        {
                                            (this.cates()).map((c, i) => (
                                                <span key={i} style={{ textAlign: 'left', display: 'inline-block', height: '16px', lineHeight: '16px', fontSize: '10px', color: '#fff', width: '80px' }}>
                                                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: c.color, verticalAlign: 'middle', borderRadius: '3px' }} />
                                                    &nbsp;
                                                    {c.name}
                                                </span>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>

                <div style={{ width: '100%', flex: '1' }}>
                    <Row style={{ height: '100%' }}>
                        <Col span={9} style={{ height: '96%' }}>
                            {
                                s.si.length ? (
                                    <div style={{ width: '100%', margin: '3vh 0 0 3%', height: '100%' }}>
                                        <Row style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }} >
                                            <Col span={24} style={{ paddingBottom: '2vh' }}>
                                                <div className='tips'>
                                                    <Row >
                                                        <Col span={12} className="tiptopOne" style={{ color: this.colorList[s.si[0].i] }}>{s.si[0].Cn}</Col>
                                                        <Col span={11} style={{ textAlign: 'right', marginTop: '4px' }}>
                                                            <span className="tiptopTwo">环比增长率</span>
                                                            <span className="tiptopTwos">{(Number(s.si[0].R) * 100).toString() + '%'}</span>
                                                        </Col>
                                                        <Col span={24}><div className="fenge" /></Col>
                                                        <Col span={12} >
                                                            <div style={{ padding: '1vh', marginTop: '8px' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[0].i] }} className='tipbottomOne' span={11}>销售总额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[0].Sa)}</Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{ padding: '1vh' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[0].i] }} className='tipbottomOne' span={11}>当月销售额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[0].Sn)}</Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: 'right', position: 'relative', minHeight: '70px' }}>
                                                            <div id={'pie1'} style={{ width: "172px", height: "70px", position: 'absolute', right: '-10px' }} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col span={24} style={{ paddingBottom: '1vh' }}>
                                                <div className='tips'>
                                                    <Row >
                                                        <Col span={12} className="tiptopOne" style={{ color: this.colorList[s.si[1].i] }}>{s.si[1].Cn}</Col>
                                                        <Col span={11} style={{ textAlign: 'right', marginTop: '4px' }}>
                                                            <span className="tiptopTwo">环比增长率</span>
                                                            <span className="tiptopTwos">{(Number(s.si[1].R) * 100).toString() + '%'}</span>
                                                        </Col>
                                                        <Col span={24}><div className="fenge" /></Col>
                                                        <Col span={12} >
                                                            <div style={{ padding: '1vh', marginTop: '8px' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[1].i] }} className='tipbottomOne' span={11}>销售总额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[1].Sa)}</Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{ padding: '1vh' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[1].i] }} className='tipbottomOne' span={11}>当月销售额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[1].Sn)}</Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: 'right', position: 'relative', minHeight: '70px' }}>
                                                            <div id={'pie2'} style={{ width: "172px", height: "70px", position: 'absolute', right: '-10px' }} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                            <Col span={24} style={{ paddingBottom: '2vh' }}>
                                                <div className='tips'>
                                                    <Row >
                                                        <Col span={12} style={{ color: this.colorList[s.si[2].i] }} className="tiptopOne">{s.si[2].Cn}</Col>
                                                        <Col span={11} style={{ textAlign: 'right', marginTop: '4px' }}>
                                                            <span className="tiptopTwo">环比增长率</span>
                                                            <span className="tiptopTwos">{(Number(s.si[2].R) * 100).toString() + '%'}</span>
                                                        </Col>
                                                        <Col span={24}><div className="fenge" /></Col>
                                                        <Col span={12} >
                                                            <div style={{ padding: '1vh', marginTop: '8px' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[2].i] }} className='tipbottomOne' span={11}>销售总额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[2].Sa)}</Col>
                                                                </Row>
                                                            </div>
                                                            <div style={{ padding: '1vh' }}>
                                                                <Row >
                                                                    <Col style={{ color: this.colorList[s.si[2].i] }} className='tipbottomOne' span={11}>当月销售额</Col>
                                                                    <Col span={13} className='tipbottomTwo'>¥{this.toThousands(s.si[2].Sn)}</Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                        <Col span={12} style={{ textAlign: 'right', position: 'relative', minHeight: '70px' }}>
                                                            <div id={'pie3'} style={{ width: "172px", height: "70px", position: 'absolute', right: '-10px' }} />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : null
                            }
                        </Col>
                        <Col span={14} align='right' style={{ position: 'absolute', bottom: '4%', right: '8px', overflow: 'hidden' }}>
                            <div className='bt' style={{ padding: '16px 24px' }} >
                                <Carousel dots={false} autoplay={true} autoplaySpeed={5000} style={{ overflow: 'hidden' }}>
                                    {
                                        s.ShowList.map((si, it) => (
                                            <div key={'bt' + si[0].Bid + it}>
                                                <Row type="flex" gutter={16}>
                                                    <Col span={8}>
                                                        <div>
                                                            <Row className='bg' style={{ height: '3vh', lineHeight: '3vh' }}>
                                                                <Col span={16} style={{ color: this.colorList[si[0].i] }} className='bs'>{si[0].Cn + '工厂'}</Col>
                                                                <Col span={8} style={{ textAlign: 'right', color: '#fffdff', paddingRight: '1vh' }}>{
                                                                    s.ShowData.SaleroomStatistics.filter((fts) => fts.CategoryBId === si[0].Bid)[0].Region
                                                                }</Col>
                                                            </Row>
                                                            <Row style={{ padding: '1vh 0 2vh 0' }}>
                                                                <Col span={24}>
                                                                    <Row style={{ color: '#57becf' }} >
                                                                        <Col span={10} style={{ textAlign: 'left', textIndent: '1vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            工厂名称
                                                                    </Col>
                                                                        <Col span={6} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            接单量
                                                                    </Col>
                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            累计金额
                                                                    </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Carousel dots={false} vertical={true} autoplay={true} autoplaySpeed={4000} afterChange={this.changeIdx(si[0].Cn)}>
                                                                    {
                                                                        this.sp(si[0].Cn).map((fis, fies) => (
                                                                            <Row key={'fact' + fies}>

                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        ))
                                                                    }
                                                                </Carousel>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div>
                                                            <Row className='bg' style={{ height: '3vh', lineHeight: '3vh' }}>
                                                                <Col span={16} style={{ color: this.colorList[si[1].i] }} className='bs'>{si[1].Cn + '工厂'}</Col>
                                                                <Col span={8} style={{ textAlign: 'right', color: '#fffdff', paddingRight: '1vh' }}>{
                                                                    s.ShowData.SaleroomStatistics.filter(fts => fts.CategoryBId === si[1].Bid)[0].Region
                                                                }</Col>
                                                            </Row>
                                                            <Row style={{ padding: '1vh 0 2vh 0' }}>
                                                                <Col span={24}>
                                                                    <Row style={{ color: '#57becf' }} >
                                                                        <Col span={10} style={{ textAlign: 'left', textIndent: '1vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            工厂名称
                                                                    </Col>
                                                                        <Col span={6} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            接单量
                                                                    </Col>
                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            累计金额
                                                                    </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Carousel dots={false} vertical={true} autoplay={true} autoplaySpeed={4000} afterChange={this.changeIdx(si[1].Cn)}>
                                                                    {
                                                                        this.sp(si[1].Cn).map((fis, fies) => (
                                                                            <Row key={'fact' + fies}>

                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        ))
                                                                    }
                                                                </Carousel>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div>
                                                            <Row className='bg' style={{ height: '3vh', lineHeight: '3vh' }}>
                                                                <Col span={16} style={{ color: this.colorList[si[2].i] }} className='bs'>{si[2].Cn + '工厂'}</Col>
                                                                <Col span={8} style={{ textAlign: 'right', color: '#fffdff', paddingRight: '1vh' }}>{
                                                                    s.ShowData.SaleroomStatistics.filter(fts => fts.CategoryBId === si[2].Bid)[0].Region
                                                                }</Col>
                                                            </Row>
                                                            <Row style={{ padding: '1vh 0 2vh 0' }}>
                                                                <Col span={24}>
                                                                    <Row style={{ color: '#57becf' }} >
                                                                        <Col span={10} style={{
                                                                            textAlign: 'left', textIndent: '1vh', overflow: 'hidden',
                                                                            whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px'
                                                                        }}>
                                                                            工厂名称
                                                                    </Col>
                                                                        <Col span={6} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            接单量
                                                                    </Col>
                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                            累计金额
                                                                    </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                            <Row>
                                                                <Carousel dots={false} vertical={true} autoplay={true} autoplaySpeed={4000} afterChange={this.changeIdx(si[2].Cn)}>
                                                                    {
                                                                        this.sp(si[2].Cn).map((fis, fies) => (
                                                                            <Row key={'fact' + fies}>

                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[0].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[1].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={24}>
                                                                                    <Row style={{ color: '#fffdff' }} >
                                                                                        <Col span={12} style={{ textAlign: 'left', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].FactoryName}
                                                                                        </Col>
                                                                                        <Col span={4} style={{ textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].OrderQ}
                                                                                        </Col>
                                                                                        <Col span={8} style={{ textAlign: 'right', paddingRight: '1.5vh', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '10px' }}>
                                                                                            {fis[2].AmountMon}
                                                                                        </Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Row>
                                                                        ))
                                                                    }
                                                                </Carousel>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        ))
                                    }
                                </Carousel>
                            </div>
                        </Col>
                        <Col span={14} align="right">
                            <Row style={{ marginLeft: '2vh' }}>
                                <Col span={24}>
                                    <div id='map' style={{ width: "100%", height: "52vh", margin: '0 auto' }} />
                                </Col>
                            </Row>
                            {/* <div style={{ paddingRight: '1.5%' }}>
                                <img src='./image/show/4.png' style={{ width: '100%' }} />
                            </div> */}
                        </Col>
                    </Row>
                </div >
            </div >
        )
    }
}
export default withRouter(Statistical);