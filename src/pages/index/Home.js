// @flow
import * as React from 'react';
import { Button, Carousel, Form, Input, message as Message ,Icon} from 'antd';
import './Home.css';
import { PageFooter, UserState } from '../../components';
import webLogo from '../../assets/img/logo_blue.png';
import iphone1 from '../../assets/img/iphone1.png';
import iphone2 from '../../assets/img/iphone2_nopolitics.png';
import iphone3 from '../../assets/img/iphone3_nopolitics2.png';
import download from '../../assets/img/download.png'
import page1 from '../../assets/img/page_1.png';
import slide1 from '../../assets/img/slide/a-1-min.jpg';
import slide2 from '../../assets/img/slide/a-2-min.jpg';
import slide3 from '../../assets/img/slide/a-3-min.jpg';
import Url from '../../service/Url';

type Props = {
  history: { push: (string) => void }
}

type State = {
  telephone: string,
  email: string,
  message: string,
  smsg: string,
  slogIn: boolean,
  secondIn: boolean,
  secondImgIn:boolean,
  thirdIn: boolean,
  thirdImgIn:boolean,
  forthIn: boolean,
  forthImgIn:boolean,
  showMenu:boolean;
  height:number;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 19 },
    sm: { span: 12 },
  },
};

class Home extends React.Component<Props, State> {

  sectionRefs: { [string]: HTMLElement } = {};

  constructor(props: Props) {
    super(props);
    this.state = {
      telephone: '',
      email: '',
      message: '',
      smsg: '两个工作日内我们的工作人员将会联系您，请耐心等待。',
      slogIn: false,
      secondIn: false,
      secondImgIn: false,
      thirdIn: false,
      thirdImgIn:false,
      forthIn: false,
      forthImgIn:false,
      showMenu:false,
      height:0
    };
  }

  onSubmitContract = (event: Event) => {
    event.preventDefault();
    const { telephone, email, message } = this.state;

    if (!telephone) return Message.error('请输入手机号');
    if (!/^1\d{10}/.test(telephone)) return Message.error('请输入正确的手机号');
    if (!email) return Message.error('请输入邮箱地址');
    if (!/^.+@.+\..+/.test(email)) return Message.error('请输入正确的邮箱地址');
    if (!message) return Message.error('请输入留言');

    fetch(Url.baseUrl+'/user/mail', {
      method: 'POST',
      body: JSON.stringify({
        'phone': telephone,
        'email': email,
        'msg': message
      }),
    }).then(() => this.setState({ smsg: '感谢您的意见反馈！' }))
      .catch(console.log);
  };

  handleTelephone = (event: SyntheticInputEvent<>) => this.setState({ telephone: event.target.value });

  handleEmail = (event: SyntheticInputEvent<>) => this.setState({ email: event.target.value });

  handleMessage = (event: SyntheticInputEvent<>) => this.setState({ message: event.target.value });

  scrollTo = (key: string) => {
    this.sectionRefs[key].scrollIntoView({
      behavior: "smooth"
    });
  };

  scrollListener = () => {
    const scrollTop = window.pageYOffset || window.document.documentElement.scrollTop || window.document.body.scrollTop || 0;
    const viewHeight = window.document.body.clientHeight;
    // const viewWidth=window.document.body.clientWidth;
    // console.log("1111==",viewHeight);
    // console.log("222==",viewWidth);
    const eleHandler = key => {
      const eleTopOffset = this.sectionRefs[key].offsetTop - scrollTop;

      if (eleTopOffset < viewHeight * 2 / 3) {
        if (!this.state[`${key}In`]) this.setState({ [`${key}In`]: true });
      }
    };
    eleHandler('secondImg');
    eleHandler('second');
   
    eleHandler('third');
    eleHandler('thirdImg');

    eleHandler('forth');
    eleHandler('forthImg');
  };

  componentDidMount() {
    setTimeout(() => {
      const imgHeight=  window.document.getElementById("mytest").clientHeight/2;
      const txtHeight=  window.document.getElementById("txt").clientHeight/2;
      const ht=Math.round(imgHeight-txtHeight);
      this.setState({ slogIn: true,height:ht});
    },200);
    setTimeout(() => {
      this.setState({secondImgIn:true });
    },900);

    window.onscroll = this.scrollListener;
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  renderFirstSection() {
    const { slogIn,height } = this.state;
    const viewWidth=window.document.body.clientWidth;
    const backAndTextColor = {
        transform: 'translateY(-100px)'
    }
    const backAndTextColor1 = {
      opacity: 1,
      fontSize:'2em',
      transform: 'translateY('+height+'px)'
    }
    return (
      <div>
        <section ref={(ref: any) => this.sectionRefs['first'] = ref} className="screen first-screen">
        {viewWidth<=768?
          <div className="slog" style={{height:"auto"}}>
            <span id="txt" className="line-1" style={slogIn ?backAndTextColor1:backAndTextColor}   >链接天下产能</span>
            <span className="line-2" style={slogIn ?backAndTextColor1:backAndTextColor} >构建未来智造生态</span>
          </div>:
         <div className="slog">
            <span id="txt" className={`line-1 ${slogIn ? 'in' : ''}`}>链接天下产能</span>
            <span className={`line-2 ${slogIn ? 'in' : ''}`}>构建未来智造生态</span>
         </div>
        }
          
          <Carousel
            autoplay={true}
            dots={false}
            effect="fade">
            <img id="mytest" src={slide1} alt="" />
            <img src={slide2} alt="" />
            <img src={slide3} alt="" />
          </Carousel>
        </section>
      </div>
    )
  }

  renderSecondSection() {
    const { secondIn,secondImgIn } = this.state;
    const viewWidth=window.document.body.clientWidth;
    return (
      <section  className="screen second-screen">
        {viewWidth<=768?
           <img ref={(ref: any) => this.sectionRefs['secondImg'] = ref} className={`phone phone1 anim-left1 ${secondImgIn ? 'anim-in' : ''}`} src={iphone1} alt="" />:
           <img ref={(ref: any) => this.sectionRefs['secondImg'] = ref} className={`phone phone1 anim-left1 ${secondIn ? 'anim-in' : ''}`} src={iphone1} alt="" />
         }
        

        <article ref={(ref: any) => this.sectionRefs['second'] = ref} className={`anim-right ${secondIn ? 'anim-in' : ''}`}>
          <header>
            <h2>易智造APP</h2>
            <img className="download" src={download} alt="" />
          </header>
          <section className="content section-content">
            <p>易智造APP是共享经济进入实体制造业的共享工厂平台，采用新一代AI、大数据分析及物联网技术，链接线下智能工厂，构建各行业在线“云工厂”。用户下载易智造APP，获得平台订单补贴！即刻拥有行业最优成本工厂！</p>
            <p>平台已上线“输配电云工厂”、“休闲食品云工厂”，电机、灯具、家具……云工厂正在上线中。 易智造APP已在Android各大应用商店和APP STORE上线，搜索“易智造”或扫描二维码立即下载。</p>
          </section>
        </article>
      </section>
    );
  }

  renderThirdSection() {
    const { thirdIn,thirdImgIn } = this.state;
    return (
      <section  className="screen third-screen">
        <article ref={(ref: any) => this.sectionRefs['third'] = ref} className={`anim-left ${thirdIn ? 'anim-in' : ''}`}>
          <header><h2>易智造微信公众号</h2></header>
          <section className="content section-content">
            <p>小易和大家问好啦！以下发布一条消息，电气小伙伴们要擦亮眼睛看好哦！</p>
            <p><span className="strong">“emake_china”</span>,易智造官方唯一指定的公众号，只有一个！只有一个！只有一个！微信搜索后就能添加关注！</p>
            <p>小易会在官方微信公众号给大家推送活动资讯、发布会视频、每日笑话！更重要的是，经常会推送各种奖金活动噢！您也可以通过微信公众号与我们实时互动。</p>
            <p>亲的销售梦，小易帮您实现，快快加入我们吧!</p>
          </section>
        </article>
        <img ref={(ref: any) => this.sectionRefs['thirdImg'] = ref} className={`phone phone2 anim-right ${thirdImgIn ? 'anim-in' : ''}`} src={iphone2} alt="" />
      </section>
    );
  }

  renderForthSection() {
    const { forthIn,forthImgIn } = this.state;
    return (
      <section  className="screen forth-screen">
        <img ref={(ref: any) => this.sectionRefs['forthImg'] = ref} className={`phone phone3 anim-left ${forthImgIn ? 'anim-in' : ''}`} src={iphone3} alt="" />
        <article ref={(ref: any) => this.sectionRefs['forth'] = ref} className={`anim-right ${forthIn ? 'anim-in' : ''}`}>
          <header><h2>公司简介</h2></header>
          <section className="content section-content">
            <p>易虎网于2016年在南京市创立，公司创始人曾在制造业经营长达22年。我们创办本公司是为了帮助广大传统工厂升级为智能工厂，通过“易智造”平台接入“云工厂”，构建未来的智造生态体系。 我们从输配电行业起步，正快速进入休闲食品、电机、家具、灯具……行业。易虎网期待和您一起见证制造业的神奇改变！</p>
          </section>
          <br />
          <header><h2>公司愿景</h2></header>
          <section className="content section-content">
            <p>易虎网的使命——链接天下产能，构建未来智造生态</p>
            <p>我们旨在赋能工厂与渠道商，采用“易智造”系统获得制造与经销环节的更多盈利，并持续推动新制造模式的实现。</p>
          </section>
        </article>
      </section>
    );
  }

  renderFifthSection() {
    const {
      telephone,
      email,
      message,
      smsg,
    } = this.state;
    return (
      <section ref={(ref: any) => this.sectionRefs['fifth'] = ref} className="screen fifth-screen">
        <article>
          <header><h2>联系我们</h2></header>
          <section className="content section-content">
            <p>公司地址：江苏省南京市江宁区水阁路8号3#楼</p>
            <p>公司热线：400-867-0211</p>
          </section>

          <br style={{ margin: '20px 0' }} />

          <Form onSubmit={this.onSubmitContract}>
            <Form.Item {...formItemLayout} label="联系方式" className="input-content">
              <Input value={telephone} onChange={this.handleTelephone} type="phone" placeholder="请输入您的电话号码" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="邮箱地址" className="input-content">
              <Input value={email} onChange={this.handleEmail} type="email" placeholder="请输入您的邮箱地址" />
            </Form.Item>
            <Form.Item {...formItemLayout} label="您的留言">
              <Input.TextArea value={message} onChange={this.handleMessage} rows={7} style={{ resize: 'none' }} type="phone" placeholder="请输入留言" />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 17 }}>
              <p style={{ fontSize: '.8em', fontWeight: 'bold', textAlign: 'right', whiteSpace: 'nowrap' }}>{smsg}</p>
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset:5 }} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{lineHeight:"32px"}} htmlType="submit">发送</Button>
            </Form.Item>
          </Form>
        </article>

        <img src={page1} alt="" />
      </section>
    );
  }
  showMainMenu=()=>{
    const {showMenu}=this.state;
    this.setState({showMenu:!showMenu});
  }
  renderContent() {
    return (
      <section className="content">
        {this.renderFirstSection()}

        {this.renderSecondSection()}

        {this.renderThirdSection()}

        {this.renderForthSection()}

        {this.renderFifthSection()}
      </section>
    )
  }

  render() {
   
    return (
      <div className="index-container">
        <header className="header clearfix">
          <div className="bg"></div>
          <img src={webLogo} alt="emake.cn" />
          <Icon type="bars" className='home-icon' onClick={this.showMainMenu} />
          <ul className={`index-menu mobile-menu ${this.state.showMenu ? 'show-menu' : ''}`}>
            <li onClick={() => this.scrollTo('first')}>首页</li>
            <li onClick={() => this.scrollTo('second')}>产品介绍</li>
            <li onClick={() => this.scrollTo('forth')}>关于我们</li>
            <li onClick={() => this.scrollTo('fifth')}>联系我们</li>
            <li><a href="http://win.emake.cn" target="_blank">易智造工厂端</a></li>
            {/* <li onClick={() => this.scrollTo('first')}>首页</li>
            <li onClick={() => this.scrollTo('second')}>产品介绍</li>
            <li onClick={() => this.scrollTo('third')}>关于我们</li>
            <li onClick={() => this.scrollTo('forth')}>联系我们</li>
            <li onClick={() => this.scrollTo('fifth')}>云工厂</li> */}
          </ul>
          <UserState history={this.props.history} />
        </header>

        {this.renderContent()}

        <PageFooter />
      </div>
    );
  }
}

export default Home;
