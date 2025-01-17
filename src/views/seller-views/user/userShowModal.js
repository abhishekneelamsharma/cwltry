import React, { useEffect, useState } from 'react';
import { Button, Col, Descriptions, Image, Modal, Row } from 'antd';
import userService from 'services/seller/user';
import { useTranslation } from 'react-i18next';
import Loading from 'components/loading';
import { shallowEqual, useSelector } from 'react-redux';
import numberToPrice from 'helpers/numberToPrice';
import getAvatar from 'helpers/getAvatar';
import moment from 'moment';

export default function UserShowModal({ uuid, handleCancel }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { defaultCurrency } = useSelector(
    (state) => state.currency,
    shallowEqual,
  );

  useEffect(() => {
    fetchUser(uuid);
  }, [uuid]);

  const fetchUser = (uuid) => {
    setLoading(true);
    userService
      .getById(uuid)
      .then((res) => setData(res.data))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal
      visible={!!uuid}
      title={t('user')}
      onCancel={handleCancel}
      footer={[
        <Button type='default' onClick={handleCancel}>
          {t('cancel')}
        </Button>,
      ]}
      className={data?.shop ? 'large-modal' : ''}
    >
      {!loading ? (
        <Row gutter={24}>
          <Col span={data?.shop ? 12 : 24}>
            <Descriptions bordered>
              <Descriptions.Item span={3} label={t('avatar')}>
                <Image
                  src={getAvatar(data?.img)}
                  alt={data?.firstname}
                  width={80}
                  className='rounded'
                />
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('user.id')}>
                {data?.id}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('name')}>
                {data?.firstname} {data?.lastname || ''}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('gender')}>
                {data?.gender}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('birthday')}>
                {data?.birthday && moment(data?.birthday).format('YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('email')}>
                {data?.email}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('phone')}>
                {data?.phone}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('role')}>
                {data?.role}
              </Descriptions.Item>
              <Descriptions.Item span={3} label={t('wallet')}>
                {numberToPrice(data?.wallet?.price, defaultCurrency?.symbol)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          {!!data?.shop && (
            <Col span={12}>
              <Descriptions bordered>
                <Descriptions.Item span={3} label={t('shop.id')}>
                  {data?.shop?.id}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t('shop.name')}>
                  {data?.shop?.translation?.title}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t('shop.logo')}>
                  <img
                    src={getAvatar(data?.shop?.logo_img)}
                    alt={data?.shop?.translation?.title}
                    width={100}
                    className='rounded'
                  />
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t('shop.phone')}>
                  {data?.shop?.phone}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t('shop.open_close.time')}>
                  {data?.shop?.open_time} - {data?.shop?.close_time}
                </Descriptions.Item>
                <Descriptions.Item span={3} label={t('delivery.range')}>
                  {data?.shop?.delivery_range}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}
        </Row>
      ) : (
        <Loading />
      )}
    </Modal>
  );
}
