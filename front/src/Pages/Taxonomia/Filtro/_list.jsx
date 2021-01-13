import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import {  Visibility } from '@material-ui/icons';
import React from 'react';
import { useIntl  } from "react-intl";

export default ({ objList, handleView }) => {
    const intl = useIntl();

    return (
        <List key="key">
                {objList.map(obj => (
                   <ListItem divider
                   key={obj._id+"item"}
                //    onClick={handlerDetails}
                    >                   
                   <ListItemText primary={obj.nombre}
                       secondary={obj.tipo.label} />
                   {obj.sinonimias &&obj.sinonimias.length>0 &&<ListItemText primary={intl.formatMessage({ id: 'page.filtroestructuras.list.sinonimias' })} 
                   secondary={obj.sinonimias.join(", ")} />}
                   {obj.nombres_comunes &&obj.nombres_comunes.length>0&& <ListItemText primary={intl.formatMessage({ id: 'page.filtroestructuras.list.nombres_comunes' })} 
                   secondary={obj.nombres_comunes.join(", ")} />}                    
                   <ListItemSecondaryAction>
                       <IconButton edge="end" aria-label={intl.formatMessage({ id: 'table.btn.detail' })}
                           onClick={(e)=>handleView(obj)}>
                           <Visibility />
                       </IconButton>                       
                   </ListItemSecondaryAction>
               </ListItem>
                ))}
            </List>
    )

}