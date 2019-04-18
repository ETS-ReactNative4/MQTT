import * as React from 'react';
import bg from '../../assets/gift-img/tbg2.png';

export default class Rules extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div style={{
                height: document.documentElement.clientHeight + 'px',
                overflowY: 'scroll',
                fontFamily: 'PingFangSC-Regular',
                fontSize: '13px',
                color: '#000',
                letterSpacing: '0',
                lineHeight: '26px',
                padding: '24px 5%',
                backgroundImage: `url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPositio: '0 0',
            }}>
                1、下载易智造APP并在线下单后，向客服出示优惠券，由客服进行减免金额使用；
                <br/>2、本优惠券不予任何形式兑换现金，找零，不与平台其他优惠政策同享；
                <br/>3、优惠劵请在有效期内使用，超过有效期将无法使用；
                <br/>4、订单中包含特价商品时不能使用优惠券，优惠券不能与其他优惠（如促销活动）同时使用；
                <br/>5、优惠券只能抵扣订单金额，订单金额满足优惠劵条件才能使用，优惠金额超出订单金额部分不能再次使用，不能兑换现金；
                <br/>6、每个订单只能使用一张优惠券；
                <br/>7、使用优惠券支付的订单，如果退货，优惠券抵扣金额不能退还，只能退还实际支付商品金额，优惠劵不返还；如果部分退货，将按照订单实际成交商品的金额进行结算；退货后订单金额不满足优惠券使用条件时，优惠券失效。退款金额＝退货商品价格-优惠金额；
                <br/>8、优惠券抵扣金额不能开具发票；
                <br/>9、易智造平台在法律范围内保留对优惠券使用细则的最终解释权；
                <br/>10、如有疑问请咨询易智造客服，400-867-0211。
            </div>
        )
    }




}