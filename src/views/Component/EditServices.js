import { Button, Dialog, DialogContent, DialogTitle, Grid, makeStyles, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "../../contexts/AuthContext";

export default function EditServices({ service }) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 15,
    },
    textField: {
      width: "30ch",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
  }));
  const { apiRequest } = React.useContext(ClientContext);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const { currentUser } = React.useContext(AuthContext);
  
  const handleClickOpen = () => { setOpen(true) };
  const handleClose = () => { setOpen(false) };

  const EditServices = () => {
    apiRequest("PATCH", `/services/edit-services/${service.id}`, { ...data })
      .then((res) => {
        setData(null);
        handleClose();
        window.location.reload(true);
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handleChangeData = (event) => {
    setData({
      name: data.name,
      company_id: currentUser.companyProfiles[0].company_id,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className={classes.paper}>
    {/* {console.log('rooms', rooms)} */}

      <EditIcon onClick={handleClickOpen} style={{ cursor: "pointer" }} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />

        <DialogTitle id="form-dialog-title">Editar serviços</DialogTitle>

        <DialogContent className={classes.formControl}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
            <Grid item>
            <Grid container direction="column" justify="center" alignItems="center" spacing={1}>
              <Grid item>
                <TextField
                  variant="outlined"
                  name="name"
                  label={service && service.name ? service.name: null}
                  value={data ? data.name : ""}
                  onChange={handleChangeData}
                />
              </Grid>

 
            </Grid>
            </Grid>

            <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => {
                EditServices();
              }}
              fullWidth
              handleClose
            >
              editar
            </Button>
            </Grid>
          </Grid>

        </DialogContent>
      </Dialog>
    </div>
  );
}
