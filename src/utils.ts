import moment from 'moment';

/**
 * 获取月份数据
 * @param currentDate
 */
const getMonthData = (currentDate: any): [number, number] => {
  const nowYear = currentDate.year();
  // dayjs内部从0开始，0-11
  const nowMonth = currentDate.month();
  return [nowYear, nowMonth];
};

/**
 * 获取渲染的日期树
 * @param monthData
 */
const getMonthRenderDays = (monthData: [number, number]) => {
  const monthDays = moment(monthData).daysInMonth();
  return Array.from({ length: monthDays }, (_, index) => {
    return moment([...monthData, index + 1]).format('YYYY-MM-DD');
  });
};

export { getMonthData, getMonthRenderDays };
