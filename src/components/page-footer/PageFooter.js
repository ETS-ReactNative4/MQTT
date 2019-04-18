// @flow
import * as React from 'react';
import gongan from '../../assets/img/guanwang_gonganju.png';
import './PageFooter.css';

type Props = {
  reverse: boolean,
}

type State = {}

class PageFooter extends React.Component<Props, State> {
  static defaultProps = {
    reverse: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <footer className={this.props.reverse ? 'reverse' : 'normal'}>
        <div>© 2017 Emake 易虎网科技南京有限公司 All Rights Reserved</div>
        <span><img src={gongan} alt="" /> 苏ICP备17015123号  &nbsp;&nbsp;&nbsp;&nbsp;增值电信业务经营许可证：苏B2-20180007</span>
      </footer>
    );
  }
}

export default PageFooter;