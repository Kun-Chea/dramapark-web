import { useAsyncEffect } from 'ahooks';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useEffect } from 'react';

const Collect = () => {
  const [mockList, setMockList] = useState<any[]>([]);

  useEffect(() => {
    setMockList([
      {
        id: 1,
        name: '张三',
        age: 18,
      },
      {
        id: 2,
        name: '李四',
        age: 20,
      },
      {
        id: 3,
        name: '王五',
        age: 22,
      },
      {
        id: 4,
        name: '赵六',
        age: 24,
      },
      {
        id: 5,
        name: '孙七',
        age: 26,
      },
      {
        id: 6,
        name: '周八',
        age: 28,
      },
    ]);
  }, []);

  const handleClick = useCallback((item: any) => {
    console.log(item);
  }, [mockList ]);

  useEffect(() => {
    console.log(mockList);
  }, [mockList]);
  return (
    <div>
      {mockList.map((item) => (
        <div key={item.id} onClick={() => handleClick(item)}>{item.name}</div>
      ))}
    </div>
  );
};

export default Collect;
