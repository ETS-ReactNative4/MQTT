import "./style.css";
import * as React from "react";
import Http from "../../service/Http";
import { message } from "antd";
import price from "../../assets/img/price.png";
import spd from "../../assets/img/shupeidian.jpg";
import xxsp from "../../assets/img/xiuxianshipin.jpg";
import { Link } from "react-router-dom";

export default class TodayPrice extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            firstCateList: [],              // 一级分类列表
        }
    }

    // 获取一级分类
    getFirstCate = async () => {
        const res = await Http.get("web/category_a");
        if(res.ResultCode === 0){
            this.setState({
                ...this.state,
                firstCateList: res.Data
            })
            return;
        }
        message.error("获取一级分类列表失败！");
    }


    render(){
        return <div className="today-price-page">
            <div className="header">
                <img src={price} alt="log"/>
                <div className="txt">
                    <h4>易智造</h4>
                    <p>链接天下产能</p>
                    <p>构建未来智造生态</p>
                </div>
            </div>
            <div className="imgs">
                <Link to={`/series/001-001`}>
                    <img src={spd} alt="输配电图片"/>
                </Link>
                <Link to={`/series/002-003`}>
                    <img src={xxsp} alt="休闲食品图片"/>
                </Link>
            </div>
        </div>
    }

}