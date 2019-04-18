import './statistical.css';
import * as React from 'react';
import { Row, Col } from 'antd';

// props: list

export class Slide extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      s: 0
    }
  }
  change = () => {
    const list = this.props.list;
    const s = this.state;
    if(s.s > list.length - 4){
      this.setState({s: 0})
      return
    }
    this.setState({s: s+2})
  }
  render() {
    const p = this.props;
    const s = this.state;
    const arr = p.list.length > 2 ? p.list.slice(s.s, s.s+2) : p.list;
    console.log(p.list.length)
    return (
      <div className="slide_comp">
        <div className="slide">
          {
            arr.map((it, i) => (
              <div key={i}>
                <Row><Col span={12}>{it[0].FactoryName}</Col><Col span={4}>{it[0].OrderQ}</Col><Col span={8}>{it[0].AmountMon}</Col></Row>
                <Row><Col span={12}>{it[1].FactoryName}</Col><Col span={4}>{it[1].OrderQ}</Col><Col span={8}>{it[1].AmountMon}</Col></Row>
                <Row><Col span={12}>{it[2].FactoryName}</Col><Col span={4}>{it[2].OrderQ}</Col><Col span={8}>{it[2].AmountMon}</Col></Row>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

}