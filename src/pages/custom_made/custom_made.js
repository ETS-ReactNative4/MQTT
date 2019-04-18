import * as React from 'react';
import {withRouter} from 'react-router-dom';
import './custom_made.css'
import {message, Tabs} from 'antd';
import Http from '../../service/Http';
import Url from '../../service/Url';
import ImageZoom from 'react-medium-image-zoom';
const TabPane = Tabs.TabPane;


class CustomMade extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            listData: [],
            keyData: {},
            activeKey: '1'
        };
    }

    async componentWillMount() {
        const {
            ResultInfo: info,
            ResultCode: code,
            Data: data,
        } = await Http.get(Url.baseUrl + `/web/customer/made`);
        if (code !== Http.ok) {
            return message.error(info)
        }
        data.sort((a, b) => {
            return a.OrderTag - b.OrderTag
        })
        data.forEach(it => {
            try {
                it.Videos = JSON.parse(it.Videos)
            } catch (e) {
                it.Videos = []
            }
            try {
                it.Photos = JSON.parse(it.Photos)
            } catch (e) {
                it.Photos = []
            }
        })
        console.log(data);
        const keyData = data.filter(it => it.OrderTag === 1)[0];
        console.log(keyData);
        this.setState({listData: data, keyData: keyData})
    }
    callback = (key) => {
        const keyData = this.state.listData.filter(it => it.OrderTag === Number(key))[0];
        this.setState({ activeKey: key, keyData: keyData});
    }

    render() {
        const {Content, Videos, Photos} = this.state.keyData;
        return (
            <div className='custom_made'>
                <Tabs activeKey={this.state.activeKey} size="default" onChange={this.callback}>
                    <TabPane tab="外观定制" key="1" />
                    <TabPane tab="轻定制" key="2" />
                    <TabPane tab="新品开发" key="3" />
                </Tabs>
                <div className="made_container">
                    <p>{Content}</p>
                    <ul className="custom_made_list">
                        {
                            Videos && Videos.map((ele, i) =>
                                <li key={i} className="custom_made_li">
                                    <video controls={true} src={ele}/>
                                </li>
                            )
                        }
                        {
                            Photos && Photos.map((ele, i) =>
                                <li key={i} className="custom_made_li">
                                    <ImageZoom
                                        image={{
                                            src: ele,
                                            width: '114px'
                                        }}
                                        zoomImage={{
                                            src: ele,
                                        }}
                                    />

                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default withRouter(CustomMade);