import { CaretDownOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { isEmpty, isNil } from 'lodash-es';
import React from 'react';

import styles from './index.module.scss';

enum LEVEL_DESC {
  LEVEL_1 = '国家级',
  LEVEL_2 = '省级',
  LEVEL_3 = '市级',
  LEVEL_4 = '区县级',
  LEVEL_5 = '乡镇级',
}

export default function Tree() {
  const currentPolicyId = '1818194267869413376';
  const data = {
    id: '31',
    name: '关于印发成都市促进工业企业“新上规”激励措施的通知',
    policyLevel: 1,
    area: '',
    parentList: '',
    policyList: [],
    preIDs: [],
    nextIDs: ['35'],
    children: [
      {
        id: '29',
        name: '关于加强就业帮扶巩固拓展脱贫攻坚成果推进乡村振兴的实施意见的通知',
        policyLevel: 2,
        area: '',
        parentList: '13',
        policyList: [
          {
            policyID: '287',
            policyName:
              '【四川省成都市】农村生产经营主体吸纳当地脱贫劳动力就业补贴',
          },
          {
            policyID: '197',
            policyName:
              '【四川省成都市】新获得国家级、省级农业信息示范基地称号企业补助',
          },
        ],
        preIDs: [],
        nextIDs: ['1818194108238397440'],
        children: [
          {
            id: '1818194108238397440',
            name: '测试文件1',
            policyLevel: 3,
            area: '',
            parentList: '35,29',
            policyList: [
              {
                policyID: '1818198883633856512',
                policyName: '【成都市】测试政策易申快享线下支付0010',
              },
            ],
            preIDs: ['29', '35'],
            nextIDs: ['1818194267869413376', '1818194404217847808'],
          },
        ],
      },
      {
        id: '35',
        name: '成都市人民政府关于加快总部经济发展做强国家中心城市核心功能支撑的意见',
        policyLevel: 2,
        area: '',
        parentList: '31',
        policyList: [
          {
            policyID: '279',
            policyName: '【四川省成都市】总部经济发展——海外布局支持',
          },
          {
            policyID: '277',
            policyName: '【四川省成都市】总部经济——办公用房补贴',
          },
        ],
        preIDs: ['31'],
        nextIDs: ['1818194108238397440'],
        children: [
          {
            id: '1818194108238397440',
            name: '测试文件1',
            policyLevel: 3,
            area: '',
            parentList: '35,29',
            policyList: [
              {
                policyID: '1818198883633856512',
                policyName: '【成都市】测试政策易申快享线下支付0010',
              },
            ],
            preIDs: ['29', '35'],
            nextIDs: ['1818194267869413376', '1818194404217847808'],
            children: [
              {
                id: '1818194267869413376',
                name: '测试文件2',
                policyLevel: 4,
                area: '青羊区',
                parentList: '1818194108238397440',
                policyList: [
                  {
                    policyID: '285',
                    policyName:
                      '【四川省成都市】 2021年支持新上规企业奖励项目（贡献奖）',
                  },
                ],
                preIDs: ['1818194108238397440'],
                nextIDs: [],
              },
              {
                id: '1818194404217847808',
                name: '测试文件3',
                policyLevel: 4,
                area: '青羊区',
                parentList: '1818194108238397440',
                policyList: [
                  {
                    policyID: '276',
                    policyName: '【四川省成都市】总部经济——规模经济奖',
                  },
                  {
                    policyID: '275',
                    policyName: '【四川省成都市】总部经济——效益贡献奖',
                  },
                ],
                preIDs: ['1818194108238397440'],
                nextIDs: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const handlePolicyListBtnClick = (cardData: any) => {
    console.log('####cardData', cardData);
  };

  /**
   * 渲染卡片
   */
  const renderCard = (cardData: any, preLevel: number) => {
    return (
      <div
        className={classNames({
          [styles.treeCard]: true,
          [styles.current]: cardData.id === currentPolicyId,
        })}
      >
        <span
          className={classNames({
            [styles.tag]: true,
            [styles[`level${cardData.policyLevel}`]]: true,
          })}
        >
          {LEVEL_DESC[`LEVEL_${cardData.policyLevel}`]}
        </span>
        {preLevel && (
          <CaretDownOutlined
            className={classNames({
              [styles.triangle]: true,
              [styles[`level${preLevel}`]]: true,
            })}
          />
        )}

        <h1 className={styles.title}>{cardData.name}</h1>
        <div
          className={classNames({
            [styles.policyBox]: true,
            [styles.hide]: false,
          })}
        >
          <span
            className={classNames({
              [styles.policyBoxBtn]: true,
              [styles[`level${cardData.policyLevel}`]]: true,
            })}
            onClick={() => {
              handlePolicyListBtnClick(cardData);
            }}
          >
            事项清单
            {(isNil(cardData?.policyListOpenStatus) ||
              cardData?.policyListOpenStatus === 0) && <DownOutlined />}
            {cardData?.policyListOpenStatus === 1 && <UpOutlined />}
          </span>
          <div
            className={classNames({
              [styles.policyList]: true,
            })}
            style={{
              display: cardData?.policyListOpenStatus === 1 ? 'block' : 'block',
            }}
          >
            {isEmpty(cardData.policyList) ? (
              <span>暂无</span>
            ) : (
              cardData.policyList?.map((item: any, idx: number) => {
                return <p key={idx}>{item.policyName}</p>;
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染树节点
   * @param children
   * @param preLevel
   */
  const renderNode = (children: any[], preLevel: number) => {
    if (isEmpty(children)) {
      return null;
    }
    return (
      <ul
        className={classNames({
          [styles[`level${preLevel}`]]: true,
        })}
      >
        {children.map((item: any) => {
          const nextLevel = item.policyLevel;

          return (
            <li
              key={item.id}
              className={classNames({
                [styles[`level${preLevel}`]]: true,
              })}
            >
              {renderCard(item, preLevel)}
              {renderNode(item.children, nextLevel)}
            </li>
          );
        })}
      </ul>
    );
  };
  /**
   * 渲染树根
   * @param data
   */
  const renderTree = (data: any) => {
    return (
      <ul>
        <li
          className={classNames({
            [styles[`level${data.policyLevel}`]]: true,
          })}
        >
          {renderCard(data, null)}
          {renderNode(data.children, data.policyLevel)}
        </li>
      </ul>
    );
  };

  return <div className={styles.tree}>{renderTree(data)}</div>;
}
