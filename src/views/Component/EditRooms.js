import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "./../../contexts/AuthContext";
import {Button, 
  FormControl, 
  Grid,
  Modal,
  makeStyles,
  TextField
} from "@material-ui/core";

export default function EditRooms(props) {

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      borderRadius: 15,
      padding: theme.spacing(2, 4, 3),
    },
    root: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: 290,
      }
    },
    textField: {
      width: "30ch",
    },
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
    },
    formControl: {
      mmargin: theme.spacing(1),
      minWidth: 240,
      maxWidth: 600, 
    },
  }));
  
  const classes = useStyles();

  const {apiRequest} = React.useContext(ClientContext);
  const {currentUser} = React.useContext(AuthContext);

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  
  const handleClose = () => {setOpen(false)};
  const handleClickOpen = () => {setOpen(true)};

  const EditRooms = (e) => {
    e.preventDefault();
    apiRequest("PATCH", `/rooms/edit-rooms/${props.rooms.id}`, { ...data })
    .then((res) => {
      setData([]);
      handleClose();
      props.setAlert(1)
      props.setSucess(1)
      props.loadRooms();
    })
    .catch((err) => {
      handleClose();
      props.setAlert(2)
      props.setSucess(2)
      props.getError(err)
    });
  }

  const handleChangeData = (event) => {
    setData({
      name: data.name,
      company_id: currentUser.companyProfiles[0].company_id,
      [event.target.name]: event.target.value,
    });
  };

  const body = (
    <div className={classes.paper}>
      <form className={classes.root}>
        <Grid>
          <CloseIcon onClick={handleClose} style={{cursor: "pointer"}}/>
          <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
            <h2 variant="h5" gutterBottom>EDITAR</h2>
            <Grid item>
              <FormControl>
                <TextField variant="outlined" name="name" type="text" label="NOME DA SALA" 
                  defaultValue={props.rooms.name}
                  value={data ? data.name : ""}
                  onChange={handleChangeData}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <Button type="submit"variant="contained" color="primary" size="medium"
                onClick={(e) => {
                  EditRooms(e)
                  handleClose();
                }}fullWidth 
                >ALTERAR
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <EditIcon style={{cursor: "pointer"}} onClick={handleClickOpen}/>
      </Grid>
      <Modal open={open} onClose={handleClickOpen} className={classes.modal}>
        {body}
      </Modal>
    </div>
  );
}
