import * as React from 'react';
import './service-pact.css';
// Tabs, Card, Divider,
import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import Http from '../../service/Http';
import Url from '../../service/Url';
type Props = {
    match: { params: any },
}
type State = {
    Content: any,
}
class Servicepact extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            type: 1,
        };
    }
    async componentWillMount() {
        const id = this.props.match.params.code;
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl+`/user/article/` + id);
        if (code !== Http.ok) {
            return message.error(info);
        }
        if (data.Content) {
            data.Content = data.Content.replace(/&gg/g, "\"");//替换半角单引号为全角单引号
            data.Content = data.Content.replace(/&tt/g, "\'");
            data.Content = data.Content.replace(/\"/g, "”");//替换半角双引号为全角双引号
            data.Content = data.Content.replace(/&lg/g, "<").replace(/&tg/g, ">");//
            this.setState({ Content: data.Content });
        }
    }
    render() {
        // console.log(this.state.Content);
        return (
            <div dangerouslySetInnerHTML={{ __html: this.state.Content }} />
        )
    }
}
export default withRouter(Servicepact);