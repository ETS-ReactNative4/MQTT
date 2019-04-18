import * as React from 'react';
import './download.css';
import { withRouter } from 'react-router-dom';
type State = {
    height: 0,
    heights: 0,
}
class Shuffling extends React.Component<{}, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            height: 0,
            heights: 0,
        };
    }
    componentWillMount() {
        window.onscroll = this.scrollListener;
    }
    scrollListener = () => {
        let img = document.getElementById('img');
        if (img && img.height && img.height > 0) {
            this.setState({ height: img.height * 0.835 });
            this.setState({ heights: img.height * 0.05 });
        }
    }
    Change = (num: number) => {
        if (num === 0) {
            window.location.href = "//itunes.apple.com/cn/app/易智造/id1260429389?mt=8";
        } else {
            window.location.href = "//api.emake.cn/static/emake.apk";
        }
    }
    render() {
        return (
            <div>
                <img
                    id="img"
                    src={"./image/download.png"}
                    style={{ width: "100%", height: "100%" }}
                    alt="" />
                {
                    this.state.height ? (
                        <div className="fly" style={{ top: this.state.height }}>
                            <a className="link" onClick={this.Change.bind(Shuffling, 0)}>
                                <span className="stone" style={{ height: this.state.heights }} />
                            </a>
                            <a className="link" onClick={this.Change.bind(Shuffling, 1)}>
                                <span className="stone" style={{ height: this.state.heights }} />
                            </a>
                        </div>
                    ) : (
                            <div className="fly">
                                <a className="link" onClick={this.Change.bind(Shuffling, 0)} >
                                    <span className="stone" />
                                </a>
                                <a className="link" onClick={this.Change.bind(Shuffling, 1)} >
                                    <span className="stone" />
                                </a>
                            </div>
                        )
                }

            </div>
        );
    }
}
export default withRouter(Shuffling);