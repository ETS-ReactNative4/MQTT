import * as React from 'react';
import { withRouter } from 'react-router-dom';
import './city-agent-rule.css';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class CityAgentRule extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    componentWillMount() {
        
    }
    render() {
        return (
            <div className='city-agent-rule'>
                <p>1、和易虎网（易智造平台）签订城市代理协议后，可以通过此页面邀请用户成为易智造会员，邀请越多，奖励越多；</p>
                <p>2、获得奖励标准、优惠码优惠额度、代理城市、代理品类等以城市代理协议为准；</p>
                <p>3、现金奖励即时到账，可随时提现，请至“我的—我的账户”中操作；</p>
                <p>4、根据国家政策提现产生的20%的偶然所得个税，由易智造平台补贴；</p>
                <p>5、如有疑问，请联系易虎网（易智造平台）招商经理。</p>
                <div className='container'>
                    <p className='call'>如有疑问，请联系易虎网（易智造平台）招商经理。</p>
                    <p className='hotLine'>热线电话：025-86123899-8206（芮先生）</p>
                </div>
            </div>
        );
    }
}
export default withRouter(CityAgentRule);