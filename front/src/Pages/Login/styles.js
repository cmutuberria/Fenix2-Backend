import {makeStyles} from '@material-ui/core/styles';

export default makeStyles(theme => ({
    root: {
        display: "flex",
        justifyContent: "Center",
        alignItems: "Center"
    },
    card: {
        minWidth: 200,
        maxWidth: 400,
        padding: theme.spacing(2),
    },
    title: {
        fontSize: 48

    },
    textField: {
        marginTop: theme.spacing(4),
        flexGrow: 1,
        width: "100%"
    },
    snack:{
        marginTop: theme.spacing(4),
    },
    actions: {
        flexDirection: "row-reverse"
    },
    '@media (max-width: 1024px)': {
        title: {
            fontSize: 38
        }
    }
}));