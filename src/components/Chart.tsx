import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory';
  const getData = (percent) => {
    return [{ x: 1, y: percent }, { x: 2, y: 100 - percent }];
  };
const Chart = ({topNumber}:{topNumber:number}) => {
  const [percent, setPercent] = useState(0);
  const [data, setData] = useState(getData(0));

  useEffect(() => {
      let newPercent = percent +  topNumber;
      setPercent(newPercent);
      setData(getData(newPercent));


   
  }, [topNumber]);



  return (
      <svg viewBox="0 0 400 400" width="55%" height="55%">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={400} height={400}
          data={data}
          innerRadius={120}
          cornerRadius={0}
          labels={() => null}
          style={{
            data: { fill: ({ datum }) => {
              const color = datum.y > 0 ? "#d73737" : "red";
              return datum.x === 1 ? color : "#F1F1F1";
            }
            }
          }}
        />
        <VictoryAnimation duration={1000} data={{ percent }}>
          {(newProps) => {
            return (
              <VictoryLabel
                textAnchor="middle" verticalAnchor="middle"
                x={200} y={200}
                text={`TOP${Math.round(newProps.percent)}%`}
                style={{ fontSize: 50 }}
              />
            );
          }}
        </VictoryAnimation>
      </svg>
  );
};

export default Chart