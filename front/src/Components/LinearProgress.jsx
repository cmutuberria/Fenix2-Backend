import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';

const ColorLinearProgress = withStyles(theme => ({
    root: {
        height: 1.5,
        flexGrowp: 1,
        zIndex:theme.zIndex.drawer + 2,
        // position: "-webkit - sticky", /* Safari */
        position: "sticky",
        top: 0,
    },
    bar: {
        borderRadius: 20,
    },
}))(LinearProgress);

export default (props) =>{
    return (<ColorLinearProgress {...props}/>);
}