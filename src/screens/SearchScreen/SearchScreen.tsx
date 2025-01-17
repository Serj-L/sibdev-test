import { FC, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Input, Form, Button, Row, Col, Modal, Tooltip, Typography, notification, Spin, Empty } from 'antd';
import { HeartOutlined, HeartFilled, LoadingOutlined } from '@ant-design/icons';
import { v4 as uuidV4 } from 'uuid';

import { RootState } from '../../store';
import { searchVideos, searchVideosStats, setQuery, setIsQueryInFavorites, setQueryParams } from '../../store/youtubeSearchSlice';
import { setFavorites } from '../../store/favoritesSlice';
import { setSearchScreenYOffset } from '../../store/screenParamsSlice';

import { IFavoritesInput } from '../../api/types';

import { SearchResults, FavoritesForm } from '../../components';

import styles from './SearchScreen.module.css';

interface SearchScreenProps {}

const isInFavorites = (searchQuery: string, favorites: IFavoritesInput[] ): boolean => {
  return favorites.filter(el => el.query === searchQuery.toLowerCase().trim()).length ? true : false;
};

const openNotificationWithIcon = (type: 'success' | 'info' | 'warning' | 'error',
  message: string,
  description: string,
  placement: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight') => {
  notification[type]({
    message,
    description,
    placement,
  });
};

const SearchScreen: FC<SearchScreenProps> = () => {
  const reduxDispatch = useDispatch();
  const search = useSelector((state: RootState) => state.youtubeSearch);
  const { favorites } = useSelector((state: RootState) => state.favorites);
  const { isMobile, searchScreenYOffset } = useSelector((state: RootState) => state.screenParams);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect (() => {
    if (search.queryStatus !== 'fulfilled' || !isMobile) return;

    window.scrollTo(0, searchScreenYOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.pageYOffset]);

  useLayoutEffect (() => {
    if (!isMobile) return;

    return () => {
      if (searchScreenYOffset === window.pageYOffset) return;
      reduxDispatch(setSearchScreenYOffset(window.pageYOffset));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, reduxDispatch]);

  useEffect (() => {
    const checkIsQueryInFavorite = isInFavorites(search.query, favorites);

    if (checkIsQueryInFavorite === search.isQueryInFavorites) return;
    reduxDispatch(setIsQueryInFavorites({ value: checkIsQueryInFavorite }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect (() => {
    if (!search.errorMessage) return;
    openNotificationWithIcon('error', 'Ошибка загрузки данных', search.errorMessage, 'topRight');
  }, [search.errorMessage]);

  useEffect (() => {
    setSearchQuery(search.query);
  }, [search.query]);

  useEffect (() => {
    if (search.statsQueryStatus !== 'getStats') return;
    reduxDispatch(searchVideosStats(search.videoIdList));
  }, [reduxDispatch, search.statsQueryStatus, search.videoIdList]);

  const makeSearch = () => {
    if (!searchQuery) {
      openNotificationWithIcon('warning', 'Поиск не может быть осуществлен.', 'Введите, пожалуйста, поисковый запрос.', 'topRight');
      return;
    }
    if (searchQuery.toLowerCase().trim() === search.query) {
      openNotificationWithIcon('warning', 'Поиск по данному запросу уже осуществлен.', 'Введите, пожалуйста, новый поисковый запрос.', 'topRight');
      return;
    }

    reduxDispatch(setQuery({ query: searchQuery.toLowerCase().trim() }));
    reduxDispatch(searchVideos({ q: searchQuery.toLowerCase().trim() }));
    if (search.queryParams.resultsPerPage !== 12 || search.queryParams.order !== 'relevance') {
      reduxDispatch(setQueryParams({
        resultsPerPage: 12,
        order: 'relevance' }));
    }

    const checkIsQueryInFavorite = isInFavorites(searchQuery, favorites);
    if (checkIsQueryInFavorite !== search.isQueryInFavorites) reduxDispatch(setIsQueryInFavorites({ value: checkIsQueryInFavorite }));
  };

  const saveToFavorites = (values: IFavoritesInput) => {
    reduxDispatch(setFavorites({ ...values, id: uuidV4() }));
    setIsModalVisible(false);
    reduxDispatch(setIsQueryInFavorites({ value: true }));
  };

  return (
    <>
      <Row
        justify='center'
        align={search.queryStatus !== 'fulfilled' && !search.videos.length ? 'middle' : 'top'}
        style={{ minHeight: '80vh' }}

      >
        <Col
          xs={{ span: 23 }}
          sm={{ span: 22 }}
          md={{ span: 22 }}
          lg={{ span: 20 }}
          xxl={{ span: 16 }}
        >
          {
            search.queryStatus !== 'fulfilled' && !search.videos.length ?
              <h1 className={styles.searchTitle}>Поиск видео</h1> :
              <h2 className={styles.searchResultTitle}>Поиск видео</h2>
          }
          <Form
            layout="vertical"
            className={styles.form}
            onFinish={makeSearch}
          >
            <Form.Item
              style={{
                flex: 1,
                maxWidth: search.queryStatus !== 'fulfilled' && !search.videos.length ? 535 : 'unset',
                marginBottom: 0,
              }}
            >
              <div className={styles.inputWrapper}>
                <Tooltip
                  className={styles.toolTipWrapper}
                  placement='bottom'
                  color='#ffffff'
                  trigger={isMobile ? ['click'] : ['hover']}
                  title={
                    <>
                      <Typography.Text
                        strong
                        style={{
                          display: 'block',
                          marginBottom: 15,
                        }}
                      >
                        Запрос уже сохранён в разделе «Избранное»
                      </Typography.Text>
                      <NavLink
                        style={{ marginTop: 15, fontWeight: 600 }}
                        to={'/favorites'}
                      >
                        Перейти в «Избранное»
                      </NavLink>
                    </>
                  }
                  zIndex={search.isQueryInFavorites? 1 : -1}
                >
                  {search.isQueryInFavorites ?
                    <HeartFilled
                      className={styles.icon}
                      style={{
                        color: '#1890FF',
                        visibility: search.videos.length ? 'visible' : 'hidden',
                      }}
                    /> :
                    <HeartOutlined
                      className={styles.icon}
                      style={{
                        color: '#1890FF',
                        visibility: search.videos.length ? 'visible' : 'hidden',
                      }}
                      onClick={() => setIsModalVisible(true)}
                    />
                  }
                </Tooltip>
                <Input
                  className={styles.input}
                  style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: 20,
                    lineHeight: 0,
                    width: '100%',
                    borderRadius: '5px 0px 0px 5px',
                    padding: '12px 35px 12px 15px',
                  }}
                  placeholder="Что хотите посмотреть?"
                  defaultValue={search.query}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const checkIsQueryInFavorite = isInFavorites(e.target.value, favorites);
                    if (checkIsQueryInFavorite !== search.isQueryInFavorites) reduxDispatch(setIsQueryInFavorites({ value: checkIsQueryInFavorite }));
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                className={styles.searchBtn}
                type='primary'
                htmlType="submit"
                style={{
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: 20,
                  lineHeight: '100%',
                  height: 50,
                  borderRadius: '0px 5px 5px 0px',
                }}
              >
                <Spin
                  spinning={search.isLoading}
                  indicator={
                    <LoadingOutlined
                      style={{
                        position: 'absolute',
                        fontSize: 24,
                        color: '#ffffff',
                        top: '25%',
                        left: '7%',
                      }}
                    />
                  }
                />
                Найти
              </Button>
            </Form.Item>
          </Form>
          {(search.queryStatus === 'fulfilled' || search.queryStatus === 'rejected') && !search.videos.length
            ?
            <Row
              justify="center"
              style={{ marginTop: 30 }}
            >
              <Col flex='auto'>
                <Empty description={search.queryStatus === 'fulfilled' ? 'По Вашему запросу видео не найдены.' : 'Ошибка загрузки данных.'}/>
              </Col>
            </Row>
            :
            <SearchResults />
          }
        </Col>
      </Row>

      <Modal
        title={null}
        visible={isModalVisible}
        closable={false}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <h3
          style={{
            fontFamily: 'Roboto, sans-serif',
            textAlign: 'center', fontSize: 18,
            margin: 0,
            padding: '15px 0 35px',
          }}
        >
          Сохранить запрос
        </h3>
        <FavoritesForm
          initialValues={{
            id: '',
            title: '',
            query: searchQuery.toLowerCase().trim(),
            order: 'relevance',
            resultsPerPage: 1,
          }}
          onSubmit={saveToFavorites}
          onCancel={() => setIsModalVisible(false)}
        />
      </Modal>
    </>
  );
};

export default SearchScreen;
