import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import { formatColor, formatGradient, gradient, neutral } from '../../theme';

export const Values: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        paddingTop: { xs: 9, md: 10 },
        paddingBottom: 16,
        backgroundColor: formatColor(neutral.gray11),
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 9, md: 10 },
        paddingX: { xs: 3, md: 10 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          flexBasis: '100%',
          width: '100%',
          maxWidth: 1250,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography display='inline' variant='h2' color={formatColor(neutral.gray1)}>
          Our Values
        </Typography>
      </Box>
      <Box
        sx={{
          flexBasis: '100%',
          flexWrap: 'nowrap',
          flexDirection: { xs: 'column', md: 'row' },
          display: 'flex',
          gap: 1,
          maxWidth: 1250,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        <GradientBox
          bg={`linear-gradient(${formatGradient(gradient.gradientPinkPeach)})`}
          left='1. Efficiency'
          right='Capital flows to capital-efficient protocols. Interest Protocol’s improved risk management, automated rate adjustments, and superior terms make it the most capital-efficient lending protocol.'
        />
        <GradientBox
          bg={`linear-gradient(${formatGradient(gradient.gradientPurpleGrey)})`}
          left='2. Adaptability'
          right='Community is the bedrock of Interest Protocol. A keep-it-simple approach to concepts and code encourages participation, leading to a vibrant community and an adaptable protocol.'
        />
        <GradientBox
          bg={`linear-gradient(${formatGradient(gradient.gradientPurpleYellow)})`}
          left='3. Transparency'
          right="Anyone can audit Interest Protocol's finances on-chain. The whitepaper and docs explain how Interest Protocol works, the risks involved, and governance processes. Nothing is hidden."
        />
      </Box>
    </Box>
  );
};

const GradientBox = (props: { left: string; right: string; bg: string }) => {
  const { left, right, bg } = props;
  return (
    <Box
      sx={{
        paddingY: 5,
        paddingX: { xs: 2, md: 5 },
        display: 'flex',
        width: '100%',
        maxWidth: 600,
        flexWrap: 'wrap',
        borderRadius: 5,
        background: bg,
        minHeight: 320,
        marginX: 'auto',
        rowGap: 1,
      }}
    >
      <Box>
        <Typography variant='h5' color={formatColor(neutral.gray5)} mb={1}>
          {left}
        </Typography>
      </Box>
      <Box>
        <Typography variant='body3_medium' color={formatColor(neutral.white)}>
          {right}
        </Typography>
      </Box>
    </Box>
  );
};
