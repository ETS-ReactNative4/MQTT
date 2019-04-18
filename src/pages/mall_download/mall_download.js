import * as React from 'react';
import { withRouter } from 'react-router-dom';
type Props = {
    match: { params: any },
    history: { push: (string) => void },
}
type State = {
}
class MallDownload extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
    }
    render() {
        return (
            <div className='mall_download' style={{height: '100%', overflowY: 'scroll'}}>
                <iframe src={'http://www.emake.cn/download/'} frameBorder="0" width="100%" height="100%" scrolling={true}></iframe>
            </div>
        );
    }
}
export default withRouter(MallDownload);