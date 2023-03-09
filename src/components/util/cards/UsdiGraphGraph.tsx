/** MultilineChart.js */
import React from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/system';
import { useTheme } from '@mui/material';
import { formatColor, neutral } from '../../../theme';

type GraphType = 'line' | 'fill';

export interface Observation {
  block: number;
  timestamp?: number;
  interestRate?: number;
  interestPaid?: number;
}

export interface MultilineChartProps {
  datamap: Map<number, Observation>;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  setLastPaid: any;
  setLastRate: any;
  setLastTime: any;
  setLastBlock: any;
}

const MultilineChart = (props: MultilineChartProps) => {
  const { width, height, margin, datamap, setLastRate, setLastPaid, setLastTime, setLastBlock } = props;
  const svgRef = React.useRef(null);
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;
  const data = Array.from(datamap.values());
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  data.sort((a: Observation, b: Observation) => {
    if (a.block < b.block) {
      return -1;
    } else {
      return 1;
    }
  });

  const interestColor = '#6929F0';
  const notionalColor = '#AFEABC';

  const fontColor = formatColor(neutral.gray3);

  React.useEffect(() => {
    try {
      // this scales the data to be within the size that we specify
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.timestamp) as any)
        .range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.interestRate) as any)
        .range([height, 0]);
      const yScaleNotional = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.interestPaid) as any)
        .range([height, 0]);

      // Create root container where we will append all other chart elements
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
      const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // Add X grid lines with labels
      const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickSize(-height + margin.bottom)
        .tickFormat((val) => {
          let dat: Date = new Date(0);
          if (val instanceof Date) {
            dat = val;
          } else {
            dat = new Date(val.valueOf());
          }
          const ystring = dat.toLocaleDateString('en-US');
          return ystring.substring(0, ystring.length - 5);
        });

      try {
        const xAxisGroup = svg
          .append('g')
          .attr('transform', `translate(-5, ${height - margin.bottom + 40})`)
          .call(xAxis);

        xAxisGroup.select('.domain').remove();
        xAxisGroup.selectAll('line').attr('stroke', 'rgba(00, 00, 00, 00)');
        xAxisGroup.selectAll('text').attr('opacity', 1).attr('color', fontColor).attr('font-size', '0.75rem');
      } catch (e) {
        console.log('failed to draw x axis', e);
      }

      // Add Y grid lines with labels
      // const yAxis = d3.axisLeft(yScale)
      // .ticks(10)
      // .tickSize(-width)
      // .tickFormat((val) => `${val}%`);

      //  const yAxisGroup = svg.append("g").call(yAxis);
      //  yAxisGroup.select(".domain").remove();
      //  yAxisGroup.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.1)");
      //  yAxisGroup.selectAll("text")
      //  .attr("opacity", 0.5)
      //  .attr("color", "black")
      //  .attr("font-size", "0.75rem");

      // Add Y grid lines with labels
      // const yAxis2 = d3.axisRight(yScaleNotional)
      // .ticks(10)
      // .tickSize(-width)
      // .tickFormat((val) => `$${val}`);

      //const yAxis2Group = svg.append("g").call(yAxis2);
      // yAxis2Group.select(".domain").remove();
      // yAxis2Group.selectAll("line").attr("stroke", "rgba(0, 0, 0, 0.0)");
      // yAxis2Group.selectAll("text")
      // .attr("transform", `translate(${width},0)`)
      // .attr("opacity", 0.5)
      // .attr("color", "black")
      // .attr("font-size", "0.75rem");

      // this line function is used to draw the data
      const interestLine = d3
        .line<Observation>()
        .curve(d3.curveMonotoneX)
        .x((d) => xScale(d.timestamp!))
        .y((d) => yScale(d.interestRate!));

      // Draw the interest rate payments
      svg
        .selectAll('barline')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', (d) => {
          return xScale(d.timestamp!) - 10;
        })
        .attr('y', (d) => {
          return yScaleNotional(d.interestPaid!) + 5;
        })
        .attr('width', 10)
        .attr('height', (d) => {
          const v = height - yScaleNotional(d.interestPaid!) - 5;
          return v < 0 ? 0 : v;
        })
        .attr('fill', notionalColor);

      // Draw the lines
      svg
        .append('path')
        .attr('class', 'line')
        .style('stroke', interestColor)
        .style('stroke-width', '2')
        .style('fill', 'none')
        .attr('d', (_) => interestLine(data));

      // create hover effect
      const mouser = svg.append('g').attr('class', 'mouse-over-effects');

      mouser
        .append('path')
        .attr('class', 'mouse-line')
        .style('stroke', 'black')
        .style('stroke-width', '0px')
        .style('opacity', '0');

      const lines: HTMLCollectionOf<SVGGeometryElement> = document.getElementsByClassName('line') as any;

      const mouseLiner = mouser
        .selectAll('.mouse-per-line')
        .data(['rate'])
        .enter()
        .append('g')
        .attr('class', 'mouse-per-line');

      mouseLiner
        .append('circle')
        .attr('r', 3)
        .style('stroke', interestColor)
        .style('fill', 'none')
        .style('stroke-width', '2px')
        .style('opacity', '.5');

      mouseLiner.append('text').attr('transform', 'translate(14,-10)');

      mouser
        .append('svg:rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseout', () => {
          d3.select('.mouse-line').style('opacity', '0');
          d3.selectAll('.mouse-per-line circle').style('opacity', '0');
          d3.selectAll('.mouse-per-line text').style('opacity', '0');
        })
        .on('mouseover', () => {
          d3.select('.mouse-line').style('opacity', '1');
          d3.selectAll('.mouse-per-line circle').style('opacity', '1');
          d3.selectAll('.mouse-per-line text').style('opacity', '1');
        })
        .on('mousemove', (e) => {
          // mouse moving over canvas
          const mouse = d3.pointer(e);
          d3.select('.mouse-line').attr('d', () => {
            let d = 'M' + mouse[0] + ',' + height + 5;
            d += ' ' + mouse[0] + ',' + 0;
            return d;
          });
          d3.selectAll('.mouse-per-line').attr('transform', function (d, i) {
            const xTimestamp = xScale.invert(mouse[0]);
            const bisect = d3.bisector(function (d: Observation) {
              return d.timestamp!;
            }).right;
            bisect(data, xTimestamp);
            setLastTime(xTimestamp.toUTCString());
            let paid = 0;
            let lastDiff = 10000000000000;
            let blk = 0;
            for (const d of data) {
              const diff = Math.abs(xTimestamp.getTime() - d.timestamp!);
              if (diff < lastDiff) {
                lastDiff = diff;
                paid = d.interestPaid!;
                blk = d.block;
              }
            }
            setLastBlock(blk);
            setLastPaid(paid);
            let beginning = 0;
            if (lines[i] == undefined) {
              return '';
            }
            let end = lines[i].getTotalLength();
            let target = null;
            let pos = undefined;
            while (true) {
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
              }
              if (pos.x > mouse[0]) end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            setLastRate(yScale.invert(pos.y).toFixed(2));
            return 'translate(' + mouse[0] + ',' + pos.y + ')';
          });
        });
    } catch (e) {
      console.log('failed to draw graph', e);
      return undefined;
    }
  }, [datamap.size]); // Redraw chart if data size changes

  return <svg preserveAspectRatio={'xMidYMax meet'} viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={svgRef} />;
};

export default MultilineChart;
