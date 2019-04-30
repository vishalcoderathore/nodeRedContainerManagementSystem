import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const snackBarStyles = theme => ({
    close: {
      padding: theme.spacing.unit / 2,
    },
  });

const Notification = (props) => (
    <React.Fragment>
        <Snackbar
        anchorOrigin={{
            vertical: props.anchorOriginVertical,
            horizontal: props.anchorOriginHorizontal,
        }}
        open={props.openInvalid}
        autoHideDuration={3000}
        onClose={props.handleClose}
        ContentProps={{
            'aria-describedby': 'message_id',
        }}
        message={<span id="message_id">{props.message}</span>}
        action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={snackBarStyles.close}
                onClick={props.handleClose}
            >
                <CloseIcon />
            </IconButton>,
        ]}
    />
    </React.Fragment>  
); 

export default Notification;