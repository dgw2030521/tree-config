import { each, find } from 'lodash-es';

const getTreeItemById = (id: string, data: any[]) => {
  return find(data, item => {
    return item.id === id;
  });
};

const getMatchedLevel = (ids: string[], data: any[]) => {
  const levels = [] as any[];
  each(ids, id => {
    const matchedItem = getTreeItemById(id, data);
    levels.push(matchedItem.policyLevel?._value);
  });
  return levels[0];
};
const convertToTree = (data: any[]) => {
  // level
  const levelList = [] as any[];
  // 记录数据
  const renderData = {} as any;
  // 记录关系
  const dataRelations = {} as any;
  data.forEach(item => {
    const level = item.policyLevel?._value;
    const id = item.id;
    const nextIDs = item.nextIDs;

    if (levelList.indexOf(level) < 0) {
      levelList.push(level);
    }

    let levelData = renderData[level] || [];
    levelData = [...levelData, { ...item, policyLevel: level }];
    renderData[level] = levelData;

    let relationData = dataRelations[level] || [];
    relationData = [
      ...relationData,
      {
        from: id,
        to: nextIDs,
        toLevel: getMatchedLevel(nextIDs, data),
      },
    ];
    dataRelations[level] = relationData;
  });

  return {
    renderData,
    dataRelations,
    // 从小到大
    levelList: levelList.sort((a, b) => a - b),
  };
};

function generateRandomNumber(min: number = 0.2, max: number = 0.8) {
  const randomNumber = min + Math.random() * (max - min);
  // 保留一位小数
  return Number.parseFloat(randomNumber.toFixed(1));
}

/**
 * 绘画开始到结束的点
 * @param cardFromDom
 * @param cardToDom
 * @param rowFromDom 因为Row布局，计算位置需要Row盒子的位置
 * @param rowToDom
 * @param context
 */
const doPaintLine = (
  cardFromDom: any,
  cardToDom: any,
  rowFromDom: any,
  rowToDom: any,
  context: any,
) => {
  const cardFromPosObj = cardFromDom.getBoundingClientRect();
  const cardToPosObj = cardToDom.getBoundingClientRect();

  const cardFromLeft = cardFromDom.offsetLeft;
  const cardFromWidth = cardFromPosObj.width;
  const cardFromHeight = cardFromPosObj.height;
  let cardFromBottom = cardFromDom.offsetTop + cardFromHeight;

  const cardToLeft = cardToDom.offsetLeft;
  const cardToWidth = cardToPosObj.width;
  let cardToTop = cardToDom.offsetTop;

  const rowFromTop = rowFromDom.offsetTop;
  const rowFromBottom = rowFromTop + rowFromDom.offsetHeight;

  const rowToTop = rowToDom.offsetTop;
  const rowToBottom = rowToTop + rowToDom.offsetHeight;

  // console.log('####FROM', cardFromLeft, cardFromBottom);
  // console.log('####TO', cardToLeft, cardToTop);
  // console.log('####ROW FROM', rowFromTop, rowFromBottom);
  // console.log('####TO FROM', rowToTop, rowToBottom);

  // 重新计算：：相对定位，加上rowBox的位置信息
  cardFromBottom = cardFromBottom + rowFromTop;
  cardToTop = cardToTop + rowToTop;

  // from和to之间的间距
  const FormToMargin = cardToTop - cardFromBottom;

  const cornerRadius = 10;
  const radius = (cardFromWidth / 2) * generateRandomNumber(0.2, 0.8);
  // @TODO 优化点：贝塞尔曲线可以更圆滑一点，和其他画线错开

  context.beginPath();
  context.moveTo(cardFromLeft + cardFromWidth / 2, cardFromBottom);

  // 画一半准备画圆角
  context.lineTo(
    cardFromLeft + cardFromWidth / 2,
    cardFromBottom + FormToMargin / 2 - cornerRadius,
  );

  // 画圆角,需考虑往左还是右
  if (cardFromLeft < cardToLeft) {
    // 右
    context.quadraticCurveTo(
      cardFromLeft + cardFromWidth / 2,
      cardFromBottom + FormToMargin / 2,
      cardFromLeft + cardFromWidth / 2 + cornerRadius,
      cardFromBottom + FormToMargin / 2,
    );

    //  准备再次画圆角
    context.lineTo(
      cardToLeft + cardToWidth / 2 - cornerRadius,
      cardFromBottom + FormToMargin / 2,
    );

    context.quadraticCurveTo(
      cardToLeft + cardToWidth / 2,
      cardFromBottom + FormToMargin / 2,
      cardToLeft + cardToWidth / 2,
      cardFromBottom + FormToMargin / 2 + cornerRadius,
    );
    context.lineTo(cardToLeft + cardToWidth / 2, cardFromBottom + FormToMargin);
  } else if (cardFromLeft > cardToLeft) {
    // 左
    context.quadraticCurveTo(
      cardFromLeft + cardFromWidth / 2,
      cardFromBottom + FormToMargin / 2,
      cardFromLeft + cardFromWidth / 2 - cornerRadius,
      cardFromBottom + FormToMargin / 2,
    );
    context.lineTo(
      cardToLeft + cardToWidth / 2 + cornerRadius,
      cardFromBottom + FormToMargin / 2,
    );

    context.quadraticCurveTo(
      cardToLeft + cardToWidth / 2,
      cardFromBottom + FormToMargin / 2,
      cardToLeft + cardToWidth / 2,
      cardFromBottom + FormToMargin / 2 + cornerRadius,
    );
    context.lineTo(cardToLeft + cardToWidth / 2, cardFromBottom + FormToMargin);
  } else {
    // 直
    context.lineTo(
      cardFromLeft + cardFromWidth / 2,
      cardFromBottom + FormToMargin,
    );
  }

  context.stroke();
};

export { convertToTree, generateRandomNumber, doPaintLine };
