import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import LinkedTree from '../src/linked';
import TreeConfig from '../src/tree';
import styles from './index.module.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

const testData = [
  {
    id: '1818194108238397440',
    name: '测试文件1',
    policyLevel: {
      _value: 3,
    },
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
  {
    id: '29',
    name: '关于加强就业帮扶巩固拓展脱贫攻坚成果推进乡村振兴的实施意见的通知',
    policyLevel: {
      _value: 2,
    },
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
  },
  {
    id: '35',
    name: '成都市人民政府关于加快总部经济发展做强国家中心城市核心功能支撑的意见',
    policyLevel: {
      _value: 2,
    },
    area: '',
    parentList: '31',
    policyList: [
      {
        policyID: '279',
        policyName: '【四川省成都市】总部经济发展——海外布局支持',
      },
      {
        policyID: '276',
        policyName: '【四川省成都市】总部经济——规模经济奖',
      },
      {
        policyID: '275',
        policyName: '【四川省成都市】总部经济——效益贡献奖',
      },
      {
        policyID: '277',
        policyName: '【四川省成都市】总部经济——办公用房补贴',
      },
    ],
    preIDs: ['31'],
    nextIDs: ['1818194108238397440'],
  },
  {
    id: '31',
    name: '关于印发成都市促进工业企业“新上规”激励措施的通知',
    policyLevel: {
      _value: 1,
    },
    area: '',
    parentList: '',
    policyList: [
      {
        policyID: '285',
        policyName: '【四川省成都市】 2021年支持新上规企业奖励项目（贡献奖）',
      },
    ],
    preIDs: [],
    nextIDs: ['35'],
  },
  {
    id: '1818194267869413376',
    name: '测试文件2',
    policyLevel: {
      _value: 4,
    },
    area: '青羊区',
    parentList: '1818194108238397440',
    policyList: [],
    preIDs: ['1818194108238397440'],
    nextIDs: [],
  },
  {
    id: '1818194404217847808',
    name: '测试文件3',
    policyLevel: {
      _value: 4,
    },
    area: '青羊区',
    parentList: '1818194108238397440',
    policyList: [],
    preIDs: ['1818194108238397440'],
    nextIDs: [],
  },
];

root.render(
  <div className={styles.container}>
    <div className={styles.item}>
      <LinkedTree currentId="1818194108238397440" data={testData} />
    </div>
    <div className={styles.item}>
      <TreeConfig />
    </div>
  </div>,
);
