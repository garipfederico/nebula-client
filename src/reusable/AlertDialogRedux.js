import {useDispatch, useSelector} from "react-redux";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {Stack, Typography} from "@mui/material";
import {closeAlertDialog} from "../states/reusable/AlertDialogSlice";
import {Error, Cancel} from "@mui/icons-material";
/**
 *
 * @param {*} props
 * @example
 * <AlertDialog
 *      open={openAlertDialog}
 *      setOpen={setOpenAlertDialog}
 *      title={ 'Está por eliminar al cliente' + formik.values.nombre}
 *      content='¿Seguro desea eliminarlo?'
 *      icon='error' // valores posibles: error | cancel
 *      buttonTextAccept='Borrar'
 *      buttonTextDeny='Cancelar'
 *      buttonActionAccept={deleteCliente}
 * >
 *     <DeleteForeverIcon color="warning" fontSize="medium" />
 * </AlertDialog>
 *
 * @returns
 */

function AlertDialogRedux(props) {
  const dispatch = useDispatch();
  const {
    open,
    title,
    content,
    icon,
    actionAcceptButton,
    actionCancelButton,
    textAcceptButton,
    textCancelButton,
    otherMessages,
  } = useSelector((state) => state.alertDialog);

  console.log("open ", open);

  // Remember that any clic outside de box it's the same that cancel action
  const handleClose = () => {
    dispatch(closeAlertDialog());
    actionCancelButton();
  };

  const handleAcceptButton = () => {
    if (actionAcceptButton) {
      actionAcceptButton();
    }
    handleClose();
  };

  const messages = otherMessages.map((aMessage, index) => (
    <Typography variant="b1" key={index}>
      {aMessage}
    </Typography>
  ));

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {
          // Here goes the icons. To agregate another one you must to create en new line, assign an string
          // and import an icon component to render it. Example :
          //
          // {icon==='StringExample') && (
          //  <ExampleComponent  color='error' sx={{margin:'auto', fontSize:"70px"}}/>
          //  )}
          // You can uncommit below.  
          
          icon && (
            <>
              {icon === "error" && (
                <Error color="error" sx={{margin: "auto", fontSize: "70px"}} />
              )}
              {icon === "cancel" && (
                <Cancel color="error" sx={{margin: "auto", fontSize: "70px"}} />
              )}
              { /*  icon==='StringExample') && (
                //   <ExampleComponent  color='error' sx={{margin:'auto', fontSize:"70px"}}/>
                //  )*/ }
            </>
          )
        }

        <DialogTitle
          id="alert-dialog-title"
          alignItems="center"
          aligntContent="center"
        >
          {title}
        </DialogTitle>
        <DialogContent>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <DialogContentText id="alert-dialog-description">
              {content}
              <Stack direction="column">{messages}</Stack>
            </DialogContentText>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "space-between",
          }}
        >
          {textCancelButton ? (
            <Button
              color="error"
              variant="contained"
              id="cancelarAlertDialog"
              onClick={handleClose}
              autoFocus
            >
              {textCancelButton}
            </Button>
          ) : null}
          {textAcceptButton ? (
            <Button
              color="primary"
              variant="contained"
              id="aceptarAlertDialog"
              onClick={handleAcceptButton}
            >
              {textAcceptButton ? textAcceptButton : "Aceptar"}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AlertDialogRedux;
