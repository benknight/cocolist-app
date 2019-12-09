import { useEffect, useState } from 'react';
import {
  tpBreakpointLargeValue,
  tpBreakpointMediumValue,
  tpBreakpointSmallValue,
} from '@thumbtack/thumbprint-tokens';

export default function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > tpBreakpointLargeValue) {
        setBreakpoint('large');
      } else if (window.innerWidth > tpBreakpointMediumValue) {
        setBreakpoint('medium');
      } else if (window.innerWidth > tpBreakpointSmallValue) {
        setBreakpoint('small');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return breakpoint;
}
