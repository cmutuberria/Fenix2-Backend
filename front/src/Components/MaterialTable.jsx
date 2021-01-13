import React from "react";
import MaterialTable from 'material-table';
import { IconButton, Tooltip } from "@material-ui/core";
import { Edit, Delete, Visibility, PermIdentity, LockOpen, Lock} from '@material-ui/icons';
import { useIntl  } from "react-intl";


export default ({ data, actions, columns }) => {
   const intl = useIntl();

    const renderIcon = (icon) => {
        switch (icon) {
            case "edit":
                return <Edit fontSize="small" />
            case "delete":
                return <Delete fontSize="small" />
            case "visibility":
                return <Visibility fontSize="small" />
            case "permIdentity":
                return <PermIdentity fontSize="small" />
            case "lock":
                return <Lock fontSize="small" />
            case "lockOpen":
                return <LockOpen fontSize="small" />
            default:
                break;
        }
    }
    const components = {
        Action: props => {
            const { disabled, icon, iconProps, onClick, tooltip, hidden } = props.action.action(props.data);
            if (disabled) {
                return (
                    <React.Fragment>
                        {!hidden &&<IconButton
                                onClick={(event) => onClick(event, props.data)}
                                color="inherit"
                                aria-label={tooltip}
                                disabled={disabled}
                                size="small">
                                {renderIcon(icon, iconProps)}
                            </IconButton>}
                    </React.Fragment>)
            }
            return (
                <React.Fragment>
                    {!hidden && <Tooltip title={tooltip}>
                        <IconButton
                            onClick={(event) => onClick(event, props.data)}
                            color="inherit"
                            aria-label={tooltip}
                            size="small">
                            {renderIcon(icon, iconProps)}
                            </IconButton>
                    </Tooltip>}
                </React.Fragment>
            )
        }
    }

    return (
        <MaterialTable
            localization={{ 
                header: {actions: ""},
                toolbar: { 
                    searchTooltip:"Buscar",
                    searchPlaceholder:"Buscar",
                },
                pagination: {
                    labelDisplayedRows: '{from}-{to} de {count}',
                    labelRowsSelect:intl.formatMessage({ id: 'table.pagination.labelRowsSelect' }),
                    firstTooltip:intl.formatMessage({ id: 'table.pagination.firstTooltip' }),
                    lastTooltip:intl.formatMessage({ id: 'table.pagination.lastTooltip' }),
                    previousTooltip:intl.formatMessage({ id: 'table.pagination.previousTooltip' }),
                    nextTooltip:intl.formatMessage({ id: 'table.pagination.nextTooltip' }),
                },
                body: {
                    emptyDataSourceMessage: 'Sin datos para mostrar',
                    filterRow: {
                        filterTooltip: 'Filtro'
                    }
                }
            }}
            options={{
                showTitle: false,
            }}
            columns={columns}
            data={data}
            components={components}
            actions={actions} />
    )
}