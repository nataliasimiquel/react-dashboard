import { Button, Grid, makeStyles, Modal } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
  
const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: 20,
    position: "absolute",
    width: 480,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: "flex",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: 290,
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "30ch",
  },
}));
  
export default function DeleteClient (props) {
  
  const classes = useStyles();

  const {apiRequest} = React.useContext(ClientContext);

  const [open, setOpen] = React.useState(false);
  const [modalStyle] = React.useState();

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const removeClient = (e) => {
    e.preventDefault();
    apiRequest("DELETE", `/customer/delete-customer/${props.company_id}`)
    .then((res) => {
      handleClose();
      props.setAlert(1)
      props.setSucess(1)
      props.loadClient();
    })
    
    .catch((err) => {
      props.setAlert(2)
      props.setSucess(2)
    });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.root}>
        <Grid container spacing={3}>
          <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
            <h3> Tem certeza que deseja Excluir?</h3>             
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" size="medium" onClick={() => {handleClose();}}fullWidth>
              Cancelar              
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="secondary" size="medium"  
              onClick={(e) => {
                removeClient(e) 
                handleClose()}} 
              fullWidth>    
              Excluir
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <DeleteIcon style={{ cursor: "pointer" }} onClick={handleOpen} />
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        {body}
      </Modal>
    </div>
  );
}