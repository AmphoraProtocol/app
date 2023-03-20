import { FormControl, InputAdornment, InputLabel, OutlinedInput, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import * as d3 from 'd3';
import Slider from '@mui/material/Slider';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

function valuetext(value: number) {
  return `${value}°C`;
}

export const DiscreteSliderSteps: React.FC = () => {
  const answer = Array(6)
    .fill(0)
    .map((_, x) => {
      return { value: 20 * x, label: 20 * x + '%' };
    });
  const [reserveRatio, setReserveRatio] = useState<number>(33);

  const [deposits, setDeposits] = useState<number>(10000);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if ((newValue as number) < 1) {
      newValue = 1;
    }
    setReserveRatio(newValue as number);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNaN(Number(event.target.value))) {
      return;
    }
    let nv = event.target.value === '' ? 0 : Number(event.target.value);
    if (nv <= 0) {
      nv = 1;
    }
    if (nv > 1000 * 1000) {
      return;
    }
    setDeposits(nv);
  };

  return (
    <Paper>
      <Box
        sx={{
          display: 'flex',
          paddingLeft: 5,
          paddingRight: 1,
          paddingY: 5,
          gap: 8,
        }}
      >
        <Box sx={{ width: 400, marginTop: 2 }}>
          <Slider
            aria-label='Target Reserve Ratio'
            id='slider'
            defaultValue={33}
            getAriaValueText={(n) => {
              return Math.round(n) + '%';
            }}
            valueLabelFormat={(n) => {
              return Math.round(n) + '%';
            }}
            value={reserveRatio}
            step={1}
            min={1}
            max={99}
            onChange={handleSliderChange}
            valueLabelDisplay='on'
            // marks={answer}
          />
          <InputLabel htmlFor='slider'>Target Reserve Ratio</InputLabel>
        </Box>
        <Box sx={{ width: 300 }}>
          <FormControl fullWidth sx={{ marginTop: 3, marginLeft: -1 }}>
            <InputLabel htmlFor='outlined-adornment-amount'>Total sUSD Deposited</InputLabel>
            <OutlinedInput
              id='outlined-adornment-amount'
              value={deposits}
              onChange={handleChange}
              startAdornment={<InputAdornment position='start'>$</InputAdornment>}
              label='Total sUSD Deposited'
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{
                MozAppearance: 'textfield',
                margin: 0,
                WebkitAppearance: 'none',
              }}
            />
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          padding: 0,
          width: 800,
        }}
      >
        <BarChart rr={reserveRatio} deposits={deposits} />
      </Box>
    </Paper>
  );
};

const BarChart = (props: { rr: number; deposits: number }) => {
  const { rr, deposits } = props;
  const svgRef = useRef(null);
  const margin = { top: -30, right: 0, bottom: -30, left: 0 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  // X axis
  //
  useEffect(() => {
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll('*').remove(); // Clear svg content before adding new elements
    const svg = svgEl.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const ival = Math.floor((100 * deposits) / rr - deposits);
    const cval = Math.floor(deposits - (rr * deposits) / 100);
    const data = [
      {
        group: `IP w/ USDA ($${ival.toLocaleString()})`,
        value: ival,
        color: '#69b3a2',
      },
      {
        group: `COMP/AAVE ($${cval.toLocaleString()})`,
        value: cval,
        color: '#707070',
      },
    ];
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        data.map(function (d) {
          return d.group;
        }),
      )
      .padding(0.2);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .style('font-size', '16px')
      .call(d3.axisBottom(x));

    const y = d3
      .scaleLinear()
      .domain([data[0].value * 1.2, 0])
      .range([0, height]);

    const u = svg.selectAll('rect').data(data);
    u.enter()
      .append('rect')
      .merge(u as any)
      .attr('x', (d) => {
        return x(d.group) as any;
      })
      .attr('y', (d) => {
        return y(d.value);
      })
      .attr('width', x.bandwidth())
      .attr('height', function (d) {
        return height - y(d.value);
      })
      .attr('fill', (d) => {
        return d.color;
      });

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(`Total Issuable Loans`);
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 80)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(`$${deposits.toLocaleString()} sUSD supplied, ${rr}% Reserve Ratio`);
  }, [rr, deposits]);
  return <svg preserveAspectRatio={'xMaxYMax'} viewBox={`0 0 ${width} ${height}`} ref={svgRef} />;
};
