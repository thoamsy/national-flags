import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function Navbar() {
  return (
    <AppBar color="transparent" position="relative" enableColorOnDark>
      <Toolbar>
        <Typography variant="h5" fontWeight={700} component="h4">
          Where in the world
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
