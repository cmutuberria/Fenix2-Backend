import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { Delete, Edit, Visibility } from '@material-ui/icons';
import React, {useState} from 'react';
export default ({ objList, handleView }) => {

    return (
        <List key="key">
                {objList.map(obj => (
                   <ListItem divider
                   key={obj._id+"item"}
                //    onClick={handlerDetails}
                    >                   
                   <ListItemText primary={obj.nombre}
                       secondary={obj.tipo.label} />
                   {obj.sinonimias &&obj.sinonimias.length>0 &&<ListItemText primary="Sinonimias" secondary={obj.sinonimias.join(", ")} />}
                   {obj.nombres_comunes &&obj.nombres_comunes.length>0&& <ListItemText primary="Agencia" secondary={obj.nombres_comunes.join(", ")} />}                    
                   <ListItemSecondaryAction>
                       <IconButton edge="end" aria-label="Editar"
                           onClick={(e)=>handleView(obj)}>
                           <Visibility />
                       </IconButton>                       
                   </ListItemSecondaryAction>
               </ListItem>
                ))}
            </List>
    )

}