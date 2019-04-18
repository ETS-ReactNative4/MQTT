// @flow
import * as React from 'react';
import { Button, message, Row, Col } from 'antd';
import Big from 'big.js';
import './SeriesItem.css';

type Props = {
  series: any,
  key: any,
  history: { push: (string) => void },
}

type State = {}

const unpaid = '0';
// const producing = '1';
// const inWare = '2';
// const sent = '3';

class SeriesItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
 toDetails = (GoodsSeriesCode) => {
    this.props.history.push('/mallGoodsDetail/'+ GoodsSeriesCode);
 }

//   renderGoods({ GoodsName, GoodsExplain, GoodsNumber, GoodsImage, AddService }: any, key: any) {
//     return (
//       <div className="series-item" key={key}>
//         <div className="pic">
//           <img src={GoodsImage} alt="" />
//         </div>
//         <div className="col-1">
//           <div className="name">{GoodsName}</div>
//           <div className="desc">{GoodsExplain}</div>
//         </div>
//         <div className="col-2">x{GoodsNumber}</div>
//         <div className="col-3">
//           {AddService.map((item, index) => (
//             <div key={index} className="desc">
//               {item.AddSeriesName + item.ProductName}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

  render() {
    const {
      IsStandard,
      GoodsSeriesPhotos,
      GoodsSeriesTitle,
      GoodsSeriesCode,
      GoodsPriceMin,
    } = this.props.series;
    return (
      <div className="component-series-item" onClick={this.toDetails.bind(this, GoodsSeriesCode)}>
        <Row>
            <Col span={10}>
                <img style={{width: '126px', maxHeight: '120px'}} src={GoodsSeriesPhotos && GoodsSeriesPhotos!==''? JSON.parse(GoodsSeriesPhotos)[0]:''}/>
            </Col>
            <Col span={14}>
                {/* <p><Button className={IsStandard === '0'? 'design': 'standard'}>{IsStandard === '0' ? '设计品': '标准品'}</Button></p> */}
                <p className="title">{GoodsSeriesTitle}</p>
                <p style={{color: '#33CCCC', fontSize: '22px', marginBottom: '26px'}}>{'￥'+ GoodsPriceMin}</p>
            </Col>
        </Row>
        {/* <div className="title">
          {InDate}&nbsp;&nbsp;订单编号：{OrderNo}
        </div>
        <div className="detail">
          <div className="goods">
            {Goods.map((item, index) => this.renderGoods(item, index))}
          </div>
          <div className="separator" />
          <div className="info">
            <span>小计：{Goods.reduce((acc, cur) => Big(acc).plus(cur.TotalGoodsPrice).toFixed(2), 0)}</span>
            <span>{GoodsAddValue}</span>
            <span>合计：{Big(ContractAmount).toFixed(2)}</span>
          </div>
          <div className="separator" />
          <div className="operation">{OrderState === unpaid
            ? (
              [
                <Button key={0} type="primary" size="small" onClick={this.payClick}>支付</Button>,
                <span key={1} onClick={this.cancelClick} className="btn-cancel">取消订单</span>
              ]
            )
            : '　已支付　'
          }</div>
        </div> */}
      </div>
    );
  }
}

export default SeriesItem;