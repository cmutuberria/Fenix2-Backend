import {makeStyles} from '@material-ui/core/styles';
const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3,1),
        marginTop: theme.spacing(6),
    },

    nested: {
        paddingLeft: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(3, 2),
    },
    header: {
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: "center",
    },
    card: {
        padding: theme.spacing(2),
    },

    /*detail*/
    detail: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: "wrap",
        //padding: theme.spacing(6),  
    },
    detailHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: "center",
        marginBottom: theme.spacing(1),
    },
    detailContent: {
        maxWidth: "20%",
        marginBottom: theme.spacing(4),
        '& :first-child': {
            marginBottom: theme.spacing(4),
        },
    },
    detailContent2: {
        flexGrow: 1,
        margin: theme.spacing(0, 2, 0, 6),
        padding: theme.spacing(2),
    },

    detailActions: {
        '& Button': {
            marginRight: theme.spacing(2),
        }
    },
    detailActionsRight: {
        display:"flex",
        justifyContent: 'flex-end',
        '& Button': {
            marginRight: theme.spacing(2),
        }
    },

    /**Forms */
    formInline: {
        display:"flex",
        margin: theme.spacing(1,0),
        justifyContent: 'space-between', 
        alignItems: "flex-end",           
        width: "100%", 
    },
    textFieldFile: {
        display:"flex",
        flexDirection:"column",
        justifyContent: 'space-between', 
        alignItems: "flex-start",  

        marginTop: theme.spacing(4),
        width: "90%",
        flexGrow: 1,
        '& img': {
            margin: theme.spacing(1, 0),
        },
    },
    textField: {
        marginTop: theme.spacing(4),
        flexGrow: 1,
        width: "90%"
    },
    miniTextField: {
        margin: theme.spacing(1, 1),
        width: "90%"
    },
    miniTextFieldInline: {
        margin: theme.spacing(0, 1),
        width: "90%"
    },
    autocompleteInline: {
        width: "90%"
    },
    gridContainerTextField: {
        //margin: theme.spacing(1,1),
        width: "95%"
    },
    rootForm: {
        display: "flex",
        justifyContent: "Center",
    },
    left: {
        marginTop:theme.spacing(1),
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row-reverse",
    },
    uploadInput:{
        display:"none",
    },
    /* btn Group */
    btnGroup: {
        display: 'flex',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    btnGroup1: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: "flex-end",
        '& > *': {
            margin: theme.spacing(0, 1),
        },
    },
    pagination: {
        display: "flex",
        justifyContent: "flex-start",
    },
    secureMsg: {
        margin: theme.spacing(10),
        display: "flex",
        justifyContent: "center",
        '& > *': {
            margin: theme.spacing(20),
        },
    },
    errorMsg: {
        margin: theme.spacing(10),
        display: "flex",
        justifyContent: "center",
        flexDirection:"column",
        alignItems:"center",
        padding: theme.spacing(10),
        
    },
    padd1:{
        padding:theme.spacing(1,0),
    },
    /*Table */
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      },
// GridList

}));


export default useStyles;