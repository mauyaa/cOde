import { forwardRef } from 'react';
import Paper from '@mui/material/Paper';

/**
 * Surface — the primary card/section container.
 * Thin border, warm surface, subtle hover depth.
 * Accepts every Paper prop for flexibility.
 */
const Surface = forwardRef(function Surface(
  { elevation = 0, square = true, ...rest },
  ref
) {
  return (
    <Paper
      ref={ref}
      elevation={elevation}
      square={square}
      {...rest}
    />
  );
});

export default Surface;
