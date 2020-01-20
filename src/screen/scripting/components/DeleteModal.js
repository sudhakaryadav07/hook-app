
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Logger from 'js-logger';
import { getTime } from '../../../utils/helper';
import { modal } from '../../../style/app';

class DeleteModal extends React.Component {

    handleClose = () => this.props.handleCancel();

    render() {
        let time = getTime();
        Logger.debug("DeleteModal>>>>>>", time);
        return (
            <Dialog open={true}  aria-labelledby="alert-dialog-title" >
                <DialogTitle id="alert-dialog-title" style={modal.header}>Delete Confirmation</DialogTitle>
                <DialogContent style={modal.content}>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={modal.action}>
                    <Button onClick={() => this.props.handleOkay()} color="primary" autoFocus>
                        Okay
                    </Button>
                    <Button onClick={() => this.props.handleCancel()} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default DeleteModal;