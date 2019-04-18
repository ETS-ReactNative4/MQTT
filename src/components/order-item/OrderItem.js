// @flow
import * as React from 'react';
import { Button, message } from 'antd';
import Big from 'big.js';
import './OrderItem.css';

type Props = {
  order: any,
}

type State = {}

const unpaid = '0';
// const producing = '1';
// const inWare = '2';
// const sent = '3';

class OrderItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  payClick = () => {
    message.warn('暂未支持支付');
  };

  cancelClick = () => {

  };

  renderGoods({ GoodsName, GoodsExplain, GoodsNumber, GoodsImage, AddService }: any, key: any) {
    return (
      <div className="goods-item" key={key}>
        <div className="pic">
          <img src={GoodsImage} alt="" />
        </div>
        <div className="col-1">
          <div className="name">{GoodsName}</div>
          <div className="desc">{GoodsExplain}</div>
        </div>
        <div className="col-2">x{GoodsNumber}</div>
        <div className="col-3">
          {AddService.map((item, index) => (
            <div key={index} className="desc">
              {item.AddSeriesName + item.ProductName}
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const {
      InDate,
      OrderNo,
      Goods,
      ContractAmount,
      GoodsAddValue,
      OrderState,
    } = this.props.order;
    return (
      <div className="component-order-item">
        <div className="title">
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
        </div>
      </div>
    );
  }
}

export default OrderItem;