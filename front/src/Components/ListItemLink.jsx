import React, { useMemo, forwardRef} from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink} from "react-router-dom"
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core"

const ListItemLink = ({ icon, primary, to, classes} )=> {
    const renderLink = useMemo(
        () =>
            forwardRef((itemProps, ref) => (
                <RouterLink to={to} {...itemProps} innerRef={ref} />
            )),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink} className={classes}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={primary} />
            </ListItem>
        </li>
    );
}
ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    classes: PropTypes.string,
};

export default ListItemLink