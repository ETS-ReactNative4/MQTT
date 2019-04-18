// @flow
import * as React from 'react';
import { Upload, Icon, message } from 'antd';
import './Avatar.css';
import Http from '../../service/Http';

type Props = {
  avatar: ?string,
  hint: ?string,
  onDelete: ?() => void,
  onChange: ?(string) => void;
  square?: boolean,
}

type State = {
  loading: boolean,
  imageUrl: ?string,
  localUrl: ?string,
  hint: string,
}

function beforeUpload(file) {
  // const isJPG = file.type === 'image/jpeg';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片必须小于 2MB!');
  }
  return isLt2M;
}

class Avatar extends React.Component<Props, State> {
  static defaultProps = {
    avatar: null,
    hint: '选择图片',
    onDelete: null,
    onChange: null,
    square: true,
  };

  constructor(props: Props) {
    super(props);
    const { avatar, hint } = props;
    this.state = {
      loading: false,
      imageUrl: avatar,
      localUrl: null,
      hint: hint || '',
    };
  }

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
    }
  };

  deleteAvatar = () => {
    this.setState({ localUrl: null });
    const { onDelete: deleteCallback } = this.props;
    deleteCallback && deleteCallback();
  };

  customRequest = ({ file }: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async file => {
      const pic = file.target.result;
      const {
        ResultCode: code,
        ResultInfo: info,
        Data: data,
      } = await Http.post('image', { Image: pic.split('base64,')[1] });
      if (code !== Http.ok) {
        this.setState({ loading: false });
        message.error(info);
        return;
      }
      this.setState({ loading: false, localUrl: pic });
      const { onChange } = this.props;
      onChange && onChange(data.ImageUrl);
    }
  };

  componentWillReceiveProps(nextProps: Props) {
    const { avatar } = nextProps;
    if (typeof avatar !== 'undefined') {
      this.setState({ imageUrl: avatar });
    }
  }

  render() {
    const { loading, imageUrl, localUrl, hint } = this.state;
    const actualUrl = localUrl || imageUrl;
    const uploadButton = (
      <div style={{ margin: '8px' }}>
        <Icon type={loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{hint}</div>
      </div>
    );
    const deleteButton = (
      <div className="delete-container" onClick={this.deleteAvatar}>
        <Icon className="delete-icon" type="delete" />
      </div>
    );
    return (
      <div className={`component-avatar square-${this.props.square ? 'true' : 'false'}`}>
        <Upload
          accept="image/*"
          name="avatar"
          listType="picture-card"
          className={`avatar-uploader`}
          showUploadList={false}
          action={`${process.env.REACT_APP_URL || ''}/image`}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          disabled={!!actualUrl || loading}
          customRequest={this.customRequest}
        >
          {actualUrl ? <img src={actualUrl} alt="" /> : uploadButton}
        </Upload>
        {actualUrl ? deleteButton : null}
      </div>
    );
  }
}

export default Avatar;