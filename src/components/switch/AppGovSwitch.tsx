import { useLocation, useNavigate } from 'react-router';
import { BaseSwitch } from './BaseSwitch';

export const AppGovSwitch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const appGovSwitchHandler = () => {
    if (location.pathname.includes('proposal')) {
      navigate('/');
    } else {
      navigate('/proposal');
    }
  };

  return (
    <BaseSwitch
      option1='App'
      option2='Governance'
      onOptionChange={appGovSwitchHandler}
      defaultIsOption1={!location.pathname.includes('proposal')}
    />
  );
};
