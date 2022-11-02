import Link from 'next/link';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useColorMode } from '../libs/useColorMode';

export default function Navbar() {
  const { toggleColorMode, color } = useColorMode();

  return (
    <AppBar color="primary" position="relative">
      <Toolbar>
        <div style={{ flexGrow: 1 }}>
          <Link href="/">
            <Typography
              style={{ cursor: 'pointer' }}
              variant="h5"
              fontWeight={700}
              component="h4"
            >
              Where in the world
            </Typography>
          </Link>
        </div>
        <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
          {color === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
