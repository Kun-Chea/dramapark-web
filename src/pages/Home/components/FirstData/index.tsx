import { Card, Col, Row, Statistic, Tooltip } from 'antd';
import { CaretDownOutlined, CaretUpOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';

interface FirstDataProps {
  // 当日销售金额
  salesAmount: number;
  // 总销售金额
  totalSalesAmount: number;
  //周同比
  weekOnWeek: number;
  //月同比
  monthOnMonth: number;
  //年同比
  yearOnYear: number;
  //总访问量
  totalVisit: number;
  //日访问量
  dayVisit: number;
  //今日支付笔数
  todayPayCount: number;
  //总支付笔数
  totalPayCount: number;
  //总roi
  totalRoi: number;
  //今日roi
  todayRoi: number;
  //总uv
  totalUv: number;
  //今日uv
  todayUv: number;
}

const data = [
  { year: '1991', value: 500 },
  { year: '1992', value: 1200    },
  { year: '1993', value: 700 },
  { year: '1994', value: 1800 },
  { year: '1995', value: 2500 },
  { year: '1996', value: 150 },
  { year: '1997', value: 30 },
];

const config = {
  height: 86,
  data,
  xField: 'year',
  yField: 'value',
  axis: false,
  interaction: {
    tooltip: {
      marker: false,
    },
  },
  style: {
    stroke: '#a259ec',
  },
  area: {
    style: {
      fill: 'linear-gradient(-90deg, #ffffff 0%, #a259ec 100%)',
    },
  },
};

const FirstData: React.FC<FirstDataProps> = (props) => {
  const {
    salesAmount,
    totalSalesAmount,
    weekOnWeek,
    monthOnMonth,
    yearOnYear,
    totalVisit,
    dayVisit,
    todayPayCount,
    totalPayCount,
    totalRoi,
    todayRoi,
    totalUv,
    todayUv,
  } = props;

  return (
    <Row gutter={16}>
      {/* 总销售额 */}
      <Col span={6}>
        <Card size="small" title={<span>总销售额</span>} bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <span>总销售额</span>
            </Col>
            <Col>
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            </Col>
          </Row>
          <Statistic
            value={totalSalesAmount}
            prefix="$"
            valueStyle={{ fontSize: 28, fontWeight: 500 }}
          />
          <Row style={{ marginTop: 65, marginBottom: 10, gap: 20 }}>
            <Col>
              <span>周同比 {weekOnWeek}%</span>
              <CaretUpOutlined style={{ color: '#E0282E' }} />
            </Col>
            <Col>
              <span>月同比 {monthOnMonth}%</span>
              <CaretDownOutlined style={{ color: '#00B96B' }} />
            </Col>
          </Row>
          <Row style={{ borderTop: '1px solid #E5E5E5', marginTop: 10, marginBottom: 10 }}>
            <Col style={{ paddingTop: 15 }}>
              <span>日销售额</span>
              <span style={{ fontWeight: 500, paddingLeft: 10 }}>
                {salesAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </span>
            </Col>
          </Row>
        </Card>
      </Col>
      {/* 访问量 */}
      <Col span={6}>
        <Card size="small" title={<span>访问量</span>} bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <span>总访问量</span>
            </Col>
            <Col>
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            </Col>
          </Row>
          <Statistic value={totalVisit} valueStyle={{ fontSize: 28, fontWeight: 500 }} />
          <Line {...config} />
          <Row style={{ borderTop: '1px solid #E5E5E5', marginTop: 10, marginBottom: 10 }}>
            <Col style={{ paddingTop: 15 }}>
              <span>日访问量</span>
              <span style={{ fontWeight: 500, paddingLeft: 10 }}>{dayVisit}</span>
            </Col>
          </Row>
        </Card>
      </Col>
      {/* 支付笔数 */}
      <Col span={6}>
        <Card
          title={
            <span>
              支付笔数&nbsp;
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          bordered={false}
        >
          <Statistic value={totalPayCount} valueStyle={{ fontSize: 28, fontWeight: 500 }} />
        </Card>
      </Col>
      {/* ROI/UV等可自定义扩展 */}
      <Col span={6}>
        <Card
          title={
            <span>
              ROI&nbsp;
              <Tooltip title="指标说明">
                <InfoCircleOutlined />
              </Tooltip>
            </span>
          }
          bordered={false}
        >
          <Statistic value={totalRoi} valueStyle={{ fontSize: 28, fontWeight: 500 }} suffix="%" />
        </Card>
      </Col>
    </Row>
  );
};

export default FirstData;
