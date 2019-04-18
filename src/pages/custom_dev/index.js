import * as React from 'react';
import {withRouter} from 'react-router-dom';
import './style.css'
import {message} from 'antd';
import Http from '../../service/Http';
import Url from '../../service/Url';
import ImageZoom from 'react-medium-image-zoom';


class List extends React.Component {
    render() {
        const {data} = this.props;
        return (
            <div className={"custom_dev_page"}>
                <p style={
                    {
                        color: '#4dbecd',
                        marginBottom: 0,
                        marginLeft: 10,
                    }
                }>{data.Title}</p>
                <p
                    style={
                        {
                        color: '#000000',
                        marginBottom: 0,
                        marginLeft: 10,
                    }
                }>{data.Content}</p>
                <ul className="custom_dev_list">
                    {
                        data.Videos.map((ele, i) =>
                            <li key={i} className="custom_dev_li">
                                <video controls={true} src={ele}/>
                            </li>
                        )
                    }
                    {
                        data.Photos.map((ele, i) =>
                            <li key={i} className="custom_dev_li">
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
        )
    }
}

class CustomDev extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            listData: []
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
        console.log(data)
        this.setState({listData: data})
    }

    render() {
        return (
            <div>
                {
                    this.state.listData.map((it, i) => <List data={it} key={i}/>)
                }
            </div>
        );
    }
}

export default withRouter(CustomDev);