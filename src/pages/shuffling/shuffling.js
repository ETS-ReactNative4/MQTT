import * as React from 'react';
import './shuffling.css';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
}
type State = {
    type: 0,
}
class Shuffling extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 0,
        };
    }
    componentWillMount() {
        this.setState({ type: this.props.match.params.id });
    }
    render() {
        const url = "./image/shuff" + this.state.type + ".jpg";
        return (
            <div>
                <img src={url}
                    style={{ width: "100%" }}
                    alt="" />
            </div>
        );
    }
}
export default withRouter(Shuffling);