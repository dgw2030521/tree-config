import classNames from 'classnames';
import update from 'immutability-helper';
import { map } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';
import { getMonthData, getMonthRenderDays } from './utils';

interface SliderDatePickerProps {
  dateValue: string;
  onChangeCallback: (value: moment.Moment) => void;
  children: React.ReactNode | React.ReactElement;
}

// 一行展示12个
const SHOW_COUNT = 12;
// 每次左右移动1天
const STEP = 1;

export default function SliderDatePicker(props: SliderDatePickerProps) {
  const { dateValue, onChangeCallback, children } = props;
  const cardRefs = useRef({});
  const cardBoxRef = useRef(null);
  // 指定的当前日期
  const $currentDate = dateValue ? moment(dateValue) : moment();

  const monthsPadding = $currentDate.diff(moment(), 'months');
  if (Math.abs(monthsPadding) > 12) {
    return <span>默认日期不能超出当前时间12个月</span>;
  }

  const [currentDate, setCurrentDate] = useState($currentDate);

  const $monthData = getMonthData(currentDate);
  // month picker的数据
  const [monthPickerData, setMonthPickerData] =
    useState<[number, number]>($monthData);

  const $renderDates = getMonthRenderDays($monthData);
  // 所有用来渲染的日期
  const [renderDates, setRenderDates] = useState($renderDates);
  // 记录被渲染的月份
  const [recordMonths, setRecordMonths] = useState([
    `${$monthData[0]}-${$monthData[1] + 1}`,
  ]);

  // 头尾日期
  const $firstDate = moment($renderDates[0]);
  const [firstDate, setFirstDate] = useState(moment($renderDates[0]));
  const [lastDate, setLastDate] = useState(
    $firstDate.clone().add(SHOW_COUNT - 1, 'd'),
  );
  // card宽度
  const [cardWidth, setCardWidth] = useState(null);

  /**
   * 单击日期变化
   * @param dateStr
   */
  const handleDateChange = (dateStr: string) => {
    const currentMDate = moment(dateStr);
    setCurrentDate(currentMDate);
    onChangeCallback(currentMDate);
  };

  /**
   * 计算diff并移动卡片
   * @param formDate
   * @param toDate
   * @param width
   * @param offset 偏移量，新生的dom，可能原先容器存在scrolleft
   */
  const moveDateCard = (
    formDate: moment.Moment,
    toDate: moment.Moment,
    width: number,
    offset?: number,
  ) => {
    offset = offset || 0;
    // 对象内部会干扰原数据对象，重新设置对象
    const mFromStr = formDate.format('YYYY-MM-DD');
    const mFrom = moment(mFromStr);
    const mToStr = toDate.format('YYYY-MM-DD');
    const mTo = moment(mToStr);
    const diff = mFrom.diff(mTo, 'days');
    console.log('---moveDateCard:::', mFromStr, mToStr, diff, offset);
    cardBoxRef.current.scrollLeft += width * (diff - offset);
    return diff;
  };

  /**
   * 传入两个月数据，获取没渲染数据月份数据
   */
  const getMonthRenderDatesList = (
    cDate: moment.Moment,
    nowDate: moment.Moment,
  ) => {
    const monthDataList = [];
    let _newRenderDates = [];
    const _newRecordMonths = [];
    const paddingCurrentToNow = cDate.diff(nowDate, 'months');
    if (paddingCurrentToNow > 0) {
      // current在后，往前创建now的数据
      for (let i = 1; i <= paddingCurrentToNow + 1; i++) {
        const monthData = getMonthData(cDate.clone().subtract(i, 'M'));
        monthDataList.push(monthData);
      }
      //  遍历monthDataList
      let renderDatesArr = [];
      for (let i = 0; i < monthDataList.length; i++) {
        const nextMonthStr = `${monthDataList[i][0]}-${monthDataList[i][1] + 1}`;
        _newRecordMonths.push(nextMonthStr);

        const _renderDates = getMonthRenderDays(monthDataList[i]);
        // 往前增加
        renderDatesArr = [..._renderDates, ...renderDatesArr];
      }
      _newRenderDates = update(renderDates, {
        $splice: [[0, 0, ...renderDatesArr]],
      });
    } else {
      // current在前，往后创建now的数据
      for (let i = 1; i <= -paddingCurrentToNow; i++) {
        const monthData = getMonthData(cDate.clone().add(i, 'M'));
        monthDataList.push(monthData);
      }
      //  遍历monthDataList
      let renderDatesArr = [];
      for (let i = 0; i < monthDataList.length; i++) {
        const nextMonthStr = `${monthDataList[i][0]}-${monthDataList[i][1] + 1}`;

        _newRecordMonths.push(nextMonthStr);

        const _renderDates = getMonthRenderDays(monthDataList[i]);
        // 往后增加
        renderDatesArr = [...renderDatesArr, ..._renderDates];
      }
      _newRenderDates = update(renderDates, {
        $splice: [[renderDates.length, 0, ...renderDatesArr]],
      });
    }

    console.log('@@@monthDataList', monthDataList, _newRecordMonths);

    return {
      newRenderDates: _newRenderDates,
      newRecordMonths: [...recordMonths, ..._newRecordMonths],
    };
  };

  /**
   * 回到今天
   */
  const handleClickToday = () => {
    const nowDate = moment();
    // 今天的dom不存在需要创建
    const nowDateStr = nowDate.format('YYYY-MM-DD');
    const nowDom = cardRefs.current[nowDateStr];

    if (!nowDom) {
      const currentMonthStateDate = currentDate.clone().startOf('month');
      const offset = currentDate.clone().diff(currentMonthStateDate, 'days');

      const {
        newRenderDates: genRenderDates,
        newRecordMonths: genRecordMonths,
      } = getMonthRenderDatesList(currentDate, nowDate);

      console.log('@###最新的渲染日期', genRenderDates, genRecordMonths);

      setRenderDates(genRenderDates);
      setRecordMonths(genRecordMonths);

      //   往后
      if (firstDate.isBefore(nowDate)) {
        setTimeout(() => {
          const diff = moveDateCard(nowDate, firstDate, cardWidth);
          setFirstDate(nowDate);
          setLastDate(lastDate.clone().add(diff, 'd'));
        });
      } else {
        // 往前
        setTimeout(() => {
          console.log('----genRenderDates[0]', genRenderDates[0]);
          const startDate = moment(genRenderDates[0]);
          moveDateCard(nowDate, startDate, cardWidth, offset);
          setFirstDate(nowDate);
          setLastDate(nowDate.clone().add(SHOW_COUNT - 1, 'd'));
          console.log(
            '新的开始结束',
            nowDate.format('YYYY-MM-DD'),
            nowDate
              .clone()
              .add(SHOW_COUNT - 1, 'd')
              .format('YYYY-MM-DD'),
          );
        });
      }
    } else {
      const diff = moveDateCard(nowDate, firstDate, cardWidth);
      setFirstDate(nowDate);
      setLastDate(lastDate.clone().add(diff, 'd'));
      console.log(
        '新的开始结束',
        nowDate.format('YYYY-MM-DD'),
        lastDate.clone().add(diff, 'd').format('YYYY-MM-DD'),
      );
    }

    // 设置月份数据
    const _monthData = getMonthData(nowDate);
    setMonthPickerData(_monthData);
    // 仅是为了渲染颜色
    setCurrentDate(nowDate);
  };

  /**
   * 根据月份数据，生成需要渲染的天数
   * @param monthData
   *  @param step 前赠还是后
   */
  const genNewMonthRenderDates = (
    monthData: [number, number],
    step: number,
  ) => {
    const nextRenderDates = getMonthRenderDays(monthData);
    let _newRenderDates = null;
    // 后加
    if (step > 0) {
      _newRenderDates = update(renderDates, {
        $splice: [[renderDates.length, 0, ...nextRenderDates]],
      });
    } else {
      _newRenderDates = update(renderDates, {
        $splice: [[0, 0, ...nextRenderDates]],
      });
    }
    return _newRenderDates;
  };

  /**
   * 计算月份数据
   * @param mData
   * @param step
   */
  const handleChangeMonth = (mData: [number, number], step: number) => {
    // @ts-ignore
    const nextDate = moment(mData).add(step, 'M');
    const nextMonthData = getMonthData(nextDate);
    setMonthPickerData(nextMonthData);
    // 拼成记录月份
    const nextMonthStr = `${nextMonthData[0]}-${nextMonthData[1] + 1}`;
    if (recordMonths.indexOf(nextMonthStr) < 0) {
      const newRecordMonths = update(recordMonths, {
        $push: [nextMonthStr],
      });
      setRecordMonths(newRecordMonths);
      const _newRenderDates = genNewMonthRenderDates(nextMonthData, step);
      setRenderDates(_newRenderDates);
    }
    //   延迟一步，更新滚动条
    setTimeout(() => {
      //  之前dom已存在,不会发生scrollWidth变化,直接进行定位
      const newFirstDate = moment([nextMonthData[0], nextMonthData[1], 1]);
      const diff = moveDateCard(newFirstDate, firstDate, cardWidth);
      setFirstDate(newFirstDate);
      const newLastDate = lastDate.clone().add(diff, 'd');
      setLastDate(newLastDate);
      console.log(
        '新的开始结束',
        newFirstDate.format('YYYY-MM-DD'),
        newLastDate.format('YYYY-MM-DD'),
      );
    });
  };

  /**
   * slider的上一步和下一步
   */
  const handleSliderChange = (dDate: moment.Moment, step: number) => {
    const newFirstDate = firstDate.clone().add(step, 'd');
    const newLastDate = lastDate.clone().add(step, 'd');

    // 如果后移动，接下来的元素是下个月第一天，切换为下个月
    // 如果前移，接下来的元素是上个月最后一天，切换为上个月
    // 没有dom，判断ref存在否，先生成再执行move

    const nextDate = dDate.clone().add(step, 'd');
    const nextDateStr = nextDate.format('YYYY-MM-DD');
    const nextDateDom = cardRefs.current[nextDateStr];

    const nextMonthData = getMonthData(nextDate);
    setMonthPickerData(nextMonthData);

    // 不存在，就创建
    if (!nextDateDom) {
      const nextMonthStr = `${nextMonthData[0]}-${nextMonthData[1] + 1}`;
      const newRecordMonths = update(recordMonths, {
        $push: [nextMonthStr],
      });
      setRecordMonths(newRecordMonths);
      const _newRenderDates = genNewMonthRenderDates(nextMonthData, step);
      setRenderDates(_newRenderDates);

      if (step > 0) {
        // 往后移动
        setTimeout(() => {
          //   计算移动
          moveDateCard(nextDate, dDate, cardWidth);
          setFirstDate(newFirstDate);
          setLastDate(newLastDate);
          console.log(
            '@@@新的开始结束',
            newFirstDate.format('YYYY-MM-DD'),
            newLastDate.format('YYYY-MM-DD'),
          );
        }, 0);
      } else {
        // 往前移动
        setTimeout(() => {
          const startDate = nextDate.clone().startOf('month');
          moveDateCard(nextDate, startDate, cardWidth);
          setFirstDate(newFirstDate);
          setLastDate(newLastDate);
          console.log(
            '@@@新的开始结束',
            newFirstDate.format('YYYY-MM-DD'),
            newLastDate.format('YYYY-MM-DD'),
          );
        }, 0);
      }
    } else {
      cardBoxRef.current.scrollLeft += cardWidth * step;
      setFirstDate(newFirstDate);
      setLastDate(newLastDate);
      console.log(
        '@@@新的开始结束',
        newFirstDate.format('YYYY-MM-DD'),
        newLastDate.format('YYYY-MM-DD'),
      );
    }
  };

  /**
   * 渲染当前slider并初始化
   * @param renderDateStrs 可渲染数据
   * @param currentDate 用来渲染蓝色
   */
  const renderSlider = (renderDateStrs: string[], currentDate: any) => {
    return map(renderDateStrs, dateStr => {
      const mEndOfMonth = moment(dateStr).endOf('month');
      const endOfMonthStr = mEndOfMonth.format('YYYY-MM-DD');

      const dayStr = dateStr.split('-')[2];
      return (
        <span
          className={classNames({
            [styles.cardBox]: true,
            [styles.endOfMonth]: dateStr === endOfMonthStr,
          })}
          style={{
            width: `${100 / SHOW_COUNT}%`,
            flexBasis: `${100 / SHOW_COUNT}%`,
          }}
          key={dateStr}
          ref={el => {
            cardRefs.current[dateStr] = el;
          }}
        >
          <span
            className={classNames({
              [styles.card]: true,
              [styles.current]: dateStr === currentDate?.format('YYYY-MM-DD'),
            })}
            onClick={() => {
              handleDateChange(dateStr);
            }}
          >
            {dayStr}
          </span>
        </span>
      );
    });
  };

  // 宽度只计算一次
  useEffect(() => {
    const currentDateStr = currentDate?.format('YYYY-MM-DD');
    const currentMatchedCardDom = cardRefs.current[currentDateStr];
    const width = currentMatchedCardDom.getBoundingClientRect().width;
    setCardWidth(width);

    const diff = moveDateCard(currentDate, firstDate, width);
    setFirstDate(currentDate);
    setLastDate(lastDate.clone().add(diff, 'd'));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{children}</div>
        <div className={styles.dateOperate}>
          <div
            className={styles.today}
            onClick={() => {
              handleClickToday();
            }}
          >
            今日
          </div>
          <div className={styles.picker}>
            <span
              className={classNames({
                [styles.btn]: true,
                [styles.left]: true,
              })}
              onClick={() => {
                handleChangeMonth(monthPickerData, -1);
              }}
            />
            {/* @NOTICE 最后一天消失才显示下个月 */}
            <span>
              <span className={styles.year}>{monthPickerData?.[0]}</span>年-
              <span className={styles.month}>{monthPickerData?.[1] + 1}</span>月
            </span>
            <span
              className={classNames({
                [styles.btn]: true,
                [styles.right]: true,
              })}
              onClick={() => {
                handleChangeMonth(monthPickerData, 1);
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.slider}>
        <span
          className={classNames({
            [styles.btn]: true,
            [styles.left]: true,
          })}
          onClick={() => {
            handleSliderChange(firstDate, -STEP);
          }}
        />
        <div
          className={classNames({ [styles.cardContainer]: true })}
          ref={cardBoxRef}
        >
          {renderSlider(renderDates, currentDate)}
        </div>
        <span
          className={classNames({
            [styles.btn]: true,
            [styles.right]: true,
          })}
          onClick={() => {
            handleSliderChange(lastDate, STEP);
          }}
        />
      </div>
    </div>
  );
}
