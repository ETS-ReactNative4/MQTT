import * as React from 'react';
import './style.css';
import { withRouter } from 'react-router-dom';

class PresellRules extends React.Component {

  render() {
    return (
      <div class='presell-rules'>
        <ul>
          <li>用户在易智造APP中预定预售商品并成功支付订金后，可在“我的—我的预售”中查看预售进度；</li>
          <li>商品预售成功后，预售订单自动转入常规订单，预售订金自动成为常规订单的已付金额，用户可与易智造客服沟通有关商品交货期等事项，同时需支付订单金额的10%作为订单预付款（含预付订金），可在“我的—订单管理—待付款”中查看具体订单详情；</li>
          <li>商品预售未达成目标，易智造平台将在此商品预售结束后的5个工作内退还用户支付的预售订金，请用户耐心等待；</li>
          <li>预售商品不支持易智造会员享受的价格权益；</li>
        </ul>

        <footer>
          <span class='hint'>如有疑问请联系易智造在线客服或拨打电话</span>
          <span class='hotline'>客服热线：400-867-0211</span>
        </footer>
      </div>
    )
  }
}

export default withRouter(PresellRules);
