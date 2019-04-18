import * as React from 'react';
import './shop-details.css';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class ShopDetails extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    downLoad = () => {
        this.props.history.push('/download');
    }
    // componentWillMount() {
    //     this.setState({ type: this.props.match.params.id });
    // }
    render() {
        return (
            <div>
                11111
            </div>
        );
    }
}
export default withRouter(ShopDetails);