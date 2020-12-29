import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import useStyles from '../style'

export default ({ imgPath, open, onClose }) => {
    const classes = useStyles();

  return (
    <Dialog
    //   fullWidth={true}
      maxWidth={false}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent className={classes.dialogImg}>          
          <img src={imgPath} />
      </DialogContent>
    </Dialog>
  );
};

