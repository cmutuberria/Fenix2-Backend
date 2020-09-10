import {makeStyles} from '@material-ui/core/styles';

const listStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // flexDirection:"column",
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {    
     flexWrap: 'wrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  titleBar: {
    background:
    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
    'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  icon: {
    color: 'white',
  },
}));



export default listStyle;