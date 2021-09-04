import React from "react";
import Snackbar from "@material-ui/core/Snackbar";

interface SnackBarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    message: string;
}

export default function CRSnackbar({ open, setOpen, message }: SnackBarProps) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={open}
                onClose={handleClose}
                message={message}
            />
        </div>
    );
}
