import { queryUserActiveData } from '@/services/short-drama-user/retention';
import CardContainer from '@/components/CardContainer';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
const Retention = () => {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    queryUserActiveData({}).then((res: any) => {
      console.log(fillMissingDates(res.data), 'fillMissingDates==============>>>>>>>>>>>');

      setData(fillMissingDates(res.data));
    });
  }, []);

function fillMissingDates(data: any) {
  const parseDate = (str: string) => new Date(str);
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // 找最大 logDate
  const maxDate = new Date(Math.max(...data.map((item: any) => parseDate(item.logDate))));

  return data.map((origin: any) => {
    const logDate = origin.logDate;

    // retentionDate -> retentionCount（过滤掉 retentionDate === logDate）
    const retentionMap = new Map(
      origin.list
        .filter((r: any) => r.retentionDate !== logDate) // ✅ 过滤掉重复日期
        .map((r: any) => [r.retentionDate, r.retentionCount]),
    );

    // 从 logDate+1 到 maxDate 补齐 list
    const list: string[] = [];
    const start = new Date(parseDate(logDate));
    start.setDate(start.getDate() + 1); // ✅ 从 logDate 的下一天开始
    for (let d = start; d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dStr = formatDate(d);
      list.push(retentionMap.get(dStr)?.toString() ?? '-');
    }

    return {
      logDate,
      userCount: origin.userCount,
      list,
    };
  });
}


  const columns: any = [
    { title: '日期', dataIndex: 'logDate', key: 'logDate', fixed: 'left' },
    { title: '1日', dataIndex: 'userCount', key: 'userCount' },
    ...data.map((item: any, index: any) => {
      return {
        title: index + 2 + '日',
        key: item.logDate,
        render: (record: any) => record.list[index] || '-',
      };
    }),
  ];

  return (
    <CardContainer title="用户留存统计">
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </CardContainer>
  );
};

export default Retention;
