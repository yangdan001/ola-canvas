import { FC } from 'react';
import './style.scss';
import { GithubOutlined } from '@ola/icons';

const Title: FC = () => {
  return (
    <div className="ola-header-title">
      <GithubOutlined />
    </div>
  );
};

export default Title;
