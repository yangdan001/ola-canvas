import { FC, PropsWithChildren } from 'react';
import './ContextMenuItem.scss';
import classNames from 'classnames';

interface IProps extends PropsWithChildren {
  disabled?: boolean;
  onClick(): void;
}

const ContextMenuItem: FC<IProps> = ({ children, disabled, onClick }) => {
  return (
    <div
      className={classNames('ola-context-menu-item', {
        'ola-is-disable': disabled,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ContextMenuItem;
