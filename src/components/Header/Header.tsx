import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Menu, Row, Col } from 'antd';

import { RootState } from '../../store';
import { setIsLoggedIn, setUserId } from '../../store/userSlice';
import { logOut } from '../../store/youtubeSearchSlice';
import { setCurrentRoute } from '../../store/routeSlice';

import { LogoIcon } from '../Logo';

import styles from './Header.module.css';

interface HeaderProps {}

const Header: FC<HeaderProps> = () => {
  const reduxDispatch = useDispatch();
  const { currentRoute } = useSelector((state: RootState) => state.route);
  const history = useHistory();

  useEffect(() => {
    console.log(history.location.pathname);
    reduxDispatch(setCurrentRoute(history.location.pathname));
  });

  return (
    <Row align="middle" >
      <Col flex='none'>
        <div className={styles.logoWrapper}>
          <LogoIcon
            width={44}
            height={44}
          />
        </div>
      </Col>
      <Col flex='auto'>
        <Menu
          mode='horizontal'
          selectedKeys={[currentRoute]}
          style={{ borderColor: 'transparent' }}
        >
          <Menu.Item key='/'>
            <NavLink
              to={'/'}
              className={styles.navlink}
              onClick={() => reduxDispatch(setCurrentRoute('/'))}
            >
                Поиск
            </NavLink>
          </Menu.Item>
          <Menu.Item key='/favorites'>
            <NavLink
              to={'/favorites'}
              className={styles.navlink}
              onClick={() => reduxDispatch(setCurrentRoute('/favorites'))}
            >
                Избранное
            </NavLink>
          </Menu.Item>
        </Menu>
      </Col>
      <Col flex='none'>
        <Menu
          mode='horizontal'
          style={{ borderColor: 'transparent' }}
        >
          <Menu.Item key='logout'>
            <NavLink
              className={styles.navlink}
              to={'/login'}
              onClick={() => {
                localStorage.removeItem('authToken');
                reduxDispatch(setIsLoggedIn(false));
                reduxDispatch(setUserId(''));
                reduxDispatch(logOut());
              }}>
                  Выйти
            </NavLink>
          </Menu.Item>
        </Menu>
      </Col>
    </Row>
  );
};

export default Header;
