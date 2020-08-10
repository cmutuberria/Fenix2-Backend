import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
          backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
          backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
          color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
          backgroundColor: 'transparent',
        },
      },
      
      content: {
        // color: theme.palette.text.primary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
          fontWeight: theme.typography.fontWeightRegular,
        },
      },
      group: {
        marginLeft: 0,
        '& $content': {
          paddingLeft: theme.spacing(2),
        },
      },
      expanded: {},
      selected: {},
      label: {
        fontWeight: 'inherit',
        color: 'inherit',
      },
      labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 2),
      },
      labelIcon: {
        marginRight: theme.spacing(1),
      },
      labelText: {
        flexGrow: 1,
      },
      labelPrimary: {        
        fontWeight: 'inherit',
        lineHeight:1,
      },
      labelSecondary: {
        color: theme.palette.text.hint,
        fontWeight: 'inherit',
        padding:theme.spacing(0,1)
      },
}));


export default useStyles;