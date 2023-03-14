import { CSSProperties, useEffect, useRef, useState } from 'react';
import { graphic, init, use } from 'echarts/core';
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers';

import { BarChart, LineChart, PieChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import type { EChartOption, EChartsType } from 'echarts';
import axios from 'axios';
import useWindowDimensions from '../../../hooks/useWindowDimensions';
import { useLight } from '../../../hooks/useLight';

export interface ChartContainerCardProps {
  src: string;
  style?: CSSProperties;
}

export const ChartContainerCard = (props: ChartContainerCardProps) => {
  use([
    BarChart,
    LineChart,
    PieChart,
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    DataZoomComponent,
    SVGRenderer,
    CanvasRenderer,
  ]);
  const ref = useRef<HTMLDivElement>(null);

  const { width } = useWindowDimensions();

  const isLight = useLight();

  const { style, src } = props;

  const [echart, setEchart] = useState<EChartsType | undefined>(undefined);
  const [options, setOptions] = useState<EChartOption | undefined>(undefined);
  useEffect(() => {
    if (!echart) {
      const ec = init(ref.current!, 'white', { renderer: 'canvas' });
      setEchart(ec as any);
    }
  }, []);
  useEffect(() => {
    axios.get(src).then((resp) => {
      if (resp.status == 200) {
        setOptions(resp.data);
      }
    });
  }, [echart]);

  useEffect(() => {
    if (echart) echart.resize();
  }, [width]);

  useEffect(() => {
    if (options && echart) {
      const opts = prepareOptions(options, ['nogrid', 'gradient'], isLight, width);
      echart.setOption(opts);
    }
  }, [echart, options, isLight]);

  return (
    <>
      <div
        ref={ref}
        style={{
          ...style,
          height: width < 900 ? 400 : 300,
        }}
      ></div>
    </>
  );
};

const prepareOptions = (o: any, typ: Array<string>, isLight: boolean, width: number): EChartOption => {
  typ.forEach((x) => {
    o = prepareChartOptions(o, x, isLight, width);
  });
  return o;
};

const prepareChartOptions = (o: any, typ: string, isLight: boolean, width: number): EChartOption => {
  const to: EChartOption = o as EChartOption;
  const isMobile = width < 900;
  switch (typ) {
    case 'gradient':
      if (to && to.legend && to.legend!.textStyle) {
        to.legend.textStyle.fontSize = 14;
      }
      //@ts-ignore
      if (to && to.title && to.title.textStyle) {
        //@ts-ignore
        to.title.textStyle = {
          fontSize: 16,
          color: isLight ? '#6B7687' : '#FFFFFF',
        };
      }
      if (to.series) {
        to.series.forEach((x: any) => {
          x.animation = true;
          if (x.lineStyle.type !== 'dotted') {
            x.lineStyle = {
              width: 3,
            };

            x.areaStyle = {
              color: x.itemStyle.color,
              opacity: 0.3,
            };
          }

          if (x.areaStyle) {
            if (x.type == 'line') {
              x.smooth = true;
              x.areaStyle.color = createGradient(x.areaStyle.color, isLight);
            }
          }
        });
      }

      to.grid = {
        width: isMobile ? '100%' : '80%',
        left: isMobile ? 0 : '200px',
      };

      if (isMobile) {
        to.legend = {
          top: 30,
          orient: 'horizontal',
        };
      }
      // to.dataZoom = [
      //   {
      //     type: 'inside',
      //     start: 50,
      //     end: 100,
      //   },
      //   {
      //     start: 0,
      //     end: 100,
      //   },
      // ]
      break;
    case 'nogrid':
      const x = to.yAxis as any;
      if (x) {
        if (x.length) {
          x.forEach((y: any) => (y.splitLine = { show: false }));
        } else {
          x.splitLine = { show: false };
        }
      }
      break;
    default:
  }
  return to;
};

const createGradient = (startingColor = '#748ff1', isLight: boolean) =>
  new graphic.LinearGradient(0, 0, 0, 1, [
    {
      offset: 0,
      color: startingColor,
    },
    {
      offset: 1,
      color: isLight ? startingColor : '#1c1d21',
    },
  ]);

export const CreateStackedGradient = (c1: string, c2: string) => {};
