import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
//import IconButton from "@material-ui/core/IconButton";
//import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";

/*
const styles = (theme: Theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});
*/
const DialogTitle = (props: any) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {/*onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                    style={{ position: "absolute" }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null*/}
        </MuiDialogTitle>
    );
};

const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

interface IDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    text: string;
    input?: boolean;
    buttonText: string;
    onButtonClick?: (inputValue: string) => void;
}

export const CustomizedDialogs = ({
    open,
    setOpen,
    title,
    text,
    input,
    buttonText,
    onButtonClick,
}: IDialogProps) => {
    const [inputValue, setInputValue] = React.useState("");
    /*
    const handleClickOpen = () => {
        setOpen(true);
    };
    */
    const handleClose = () => {
        setOpen(false);
        onButtonClick && onButtonClick(inputValue);
    };

    return (
        <div>
            {/*
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleClickOpen}
                >
                    Open dialog
                </Button>*/}

            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                //style={{ width: "500px" }}
            >
                <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                    classes={{}}
                >
                    {title}
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>{text}</Typography>
                    {input ? (
                        <input
                            type="text"
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    ) : (
                        ""
                    )}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        {buttonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};
