import { WordCloud } from '@ant-design/plots';
import FirstData from './components/FirstData';
import { listSysError } from '@/services/error/sys-error';
import { useRequest } from 'ahooks';
import { useState } from 'react';
import Error from './components/Error';

const Home = () => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://assets.antv.antgroup.com/g2/philosophy-word.json',
    },
    layout: { spiral: 'rectangular' },
    colorField: 'text',
  };
  return (
    <div>
      <FirstData
        salesAmount={102838}
        totalSalesAmount={12600011312}
        weekOnWeek={10}
        monthOnMonth={10}
        yearOnYear={100}
        totalVisit={87128}
        dayVisit={1245}
        todayPayCount={100}
        totalPayCount={100}
        totalRoi={100}
        todayRoi={100}
        totalUv={100}
        todayUv={100}
      />
      {/* <WordCloud {...config} /> */}
      <Error />
    </div>
  );
};

export default Home;
