import { CaretDownOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import classNames from 'classnames';
import update from 'immutability-helper';
import { each, findIndex, isEmpty, map, toLower } from 'lodash-es';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import styles from './linked.module.scss';
import { convertToTree, doPaintLine } from './utils';

enum LEVEL_DESC {
  LEVEL_1 = '国家级',
  LEVEL_2 = '省级',
  LEVEL_3 = '市级',
  LEVEL_4 = '区县',
  LEVEL_5 = '乡镇',
}

enum LEVEL_COLOR {
  LEVEL_1 = '#fa4848',
  LEVEL_2 = '#4ac04f',
  LEVEL_3 = '#33a8fe',
  LEVEL_4 = '#1bccf3',
  LEVEL_5 = 'orange',
}

interface TreeStructureProps {
  data: any[];
  currentId: string;
}

export default function Linked(props: TreeStructureProps) {
  const { data, currentId } = props;
  const animationFrame = useRef(null);
  const canvasFullRef = useRef(null);
  const cardRefs = useRef({});
  const rowRefs = useRef({});
  const treeDataObj = convertToTree(data);
  const { dataRelations, levelList } = treeDataObj;

  // 渲染数据，方便更改开闭状态
  const [renderData, setRenderData] = useState(treeDataObj?.renderData);

  const beginPaintLine = (relation: any, level: string, context: any) => {
    each(relation, item => {
      const fromId = item.from;
      const toIds = item.to;
      const toLevel = item.toLevel;

      each(toIds, toId => {
        doPaintLine(
          cardRefs.current[`${level}_${fromId}`],
          cardRefs.current[`${toLevel}_${toId}`],

          rowRefs.current[`${level}`],
          rowRefs.current[`${toLevel}`],
          context,
        );
      });
    });
  };

  const handlePaintLine = (canvas: any) => {
    const context = canvas.getContext('2d');

    // //  计算画布的宽度
    // const canvasWidth = containerRef?.current.offsetWidth;
    // //  计算画布的高度
    // const canvasHeight = containerRef?.current.offsetHeight;

    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    //  设置宽高
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    context.lineWidth = 2;
    // 虚线
    context.setLineDash([6, 4]);

    // 调用画线
    each(dataRelations, (relation, level) => {
      context.strokeStyle = LEVEL_COLOR[`LEVEL_${level}`];
      beginPaintLine(relation, level, context);
    });
  };
  useEffect(() => {
    const canvas = canvasFullRef.current;
    handlePaintLine(canvas);

    // 窗口尺寸变化
    const handleResize = () => {
      animationFrame.current = requestAnimationFrame(() => {
        handlePaintLine(canvas);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // 清除动画帧
      cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  const handlePolicyBtnClick = (cardData: any) => {
    const { policyLevel, id } = cardData;
    const matchedLevelDataArr = renderData[policyLevel];
    const idx = findIndex(matchedLevelDataArr, (item: any) => {
      return item.id === id;
    });

    const currentStatus = matchedLevelDataArr[idx].isOpen;

    const newData = update(renderData, {
      [policyLevel]: {
        [idx]: {
          isOpen: {
            $set: !currentStatus,
          },
        },
      },
    });
    setRenderData(newData);

    requestAnimationFrame(() => {
      const canvas = canvasFullRef.current;
      handlePaintLine(canvas);
    });
  };

  /**
   * 渲染卡片
   * @param cardData 数据
   * @param level 当前level
   * @param prevLevel 上一level，为了渲染三角形
   */
  const renderCard = (cardData: any, level: number, prevLevel: number) => {
    return (
      <div
        key={cardData.id}
        ref={el => {
          cardRefs.current[`${level}_${cardData.id}`] = el;
        }}
        className={classNames({
          [styles.treeCard]: true,
          [styles.current]: cardData.id === currentId,
        })}
      >
        {/* @NOTICE nextIds负责画线，preIds负责呈现三角形 */}
        {prevLevel > 0 && !isEmpty(cardData.preIDs) && (
          <CaretDownOutlined
            className={classNames({
              [styles.triangle]: true,
              [styles[`level${prevLevel}`]]: true,
            })}
          />
        )}

        <a
          className={styles.cardHead}
          onClick={ev => {
            ev.preventDefault();
            window.open(`/zczd/customer/policy-file/${cardData.id}`, '_blank');
          }}
        >
          <span
            className={classNames({
              [styles.tag]: true,
              [styles[`level${cardData.policyLevel}`]]: true,
            })}
          >
            <span>{LEVEL_DESC[`LEVEL_${cardData.policyLevel}`]}</span>
            {cardData.policyLevel === 4 && (
              <>
                <Divider type="vertical" style={{ borderColor: '#fff' }} />
                <span className={styles.area}>{cardData.area}</span>
              </>
            )}
          </span>

          <h1 className={styles.title}>{`${cardData.name}`}</h1>
          {!isEmpty(cardData.policyList) && (
            <span
              className={classNames({
                [styles.policyBoxBtn]: true,
                [styles[`level${cardData.policyLevel}`]]: true,
              })}
              onClick={ev => {
                ev.stopPropagation();
                handlePolicyBtnClick(cardData);
              }}
            >
              事项清单
              {cardData?.isOpen && <DownOutlined />}
              {!cardData?.isOpen && <UpOutlined />}
            </span>
          )}
        </a>

        <div
          className={classNames({
            [styles.policyBox]: true,
            [styles.hide]: false,
          })}
        >
          <div
            className={classNames({
              [styles.policyList]: true,
            })}
            style={{
              display: cardData?.isOpen ? 'block' : 'none',
            }}
          >
            {isEmpty(cardData.policyList) ? (
              <span>暂无</span>
            ) : (
              cardData.policyList?.map((item: any, idx: number) => {
                return (
                  <p key={idx} className={styles.policyItem}>
                    <span className={styles.circle}>{idx + 1}</span>
                    <a
                      href={`/zczd/customer/policy/${item.policyID}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {' '}
                      {item.policyName}
                    </a>
                  </p>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染树
   * @param treeData
   */
  const renderTree = (treeData: any) => {
    return map(levelList, (level, idx) => {
      const dataArr = treeData[level];
      let preLevel = 0;
      if (idx > 0) {
        preLevel = levelList[idx - 1];
      }
      return (
        <Fragment key={level}>
          <div
            className={classNames({
              [styles.levelRow]: true,
            })}
            ref={el => {
              rowRefs.current[`${level}`] = el;
            }}
          >
            {map(dataArr, item => {
              return (
                <Fragment key={item.id}>
                  {renderCard(item, level, preLevel)}
                </Fragment>
              );
            })}
          </div>
        </Fragment>
      );
    });
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.levelRow}
        style={{ paddingBottom: '5px', paddingTop: '20px' }}
      >
        <div className={styles.headIcon}>政策图谱示意图</div>
      </div>
      <div className={styles.levelDescBox}>
        {map(LEVEL_DESC, (name, key) => {
          return (
            <p className={styles.levelDesc} key={key}>
              <span
                className={classNames({
                  [styles.square]: true,
                  [styles[toLower(key)]]: true,
                })}
              />
              {name}
            </p>
          );
        })}
        <p className={styles.levelDesc} style={{ marginTop: '20px' }}>
          <span
            className={classNames({
              [styles.square]: true,
              [styles.level_current]: true,
            })}
          />
          当前市级
        </p>
      </div>
      {renderTree(renderData)}
      <canvas
        ref={canvasFullRef}
        className={classNames({
          [styles.canvasFull]: true,
        })}
      />
    </div>
  );
}
