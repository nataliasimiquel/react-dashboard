import { Modal, Button, Grid, TextField, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "./../../contexts/AuthContext";

export default function RegisterRooms(props) {
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      borderRadius: 15,
      padding: theme.spacing(2, 4, 3),
    },
    modal: {
      display: "flex",
      padding: theme.spacing(1),
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
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  const {apiRequest} = React.useContext(ClientContext);
  const {currentUser} = React.useContext(AuthContext);

  const [data, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  
  const handleOpen = () => {setOpen(true)};
  const handleClose = () => setOpen(false);

  function RegisterRooms(e) {
    e.preventDefault();
    if ((!data.name)|| data.name.length === 0) {
      setError(true)
    }
    else {
      apiRequest("POST", "/rooms/add-rooms", { ...data })
      .then((res) => {
        console.log(data)
        setData({});
        handleClose();
        props.setAlert(1)
        props.setSucess(1)
        props.loadRooms()
      })
      .catch((err) => {
        console.log("err", err)
        handleClose();
        props.setAlert(2)
        props.setSucess(2)
        props.getError(err)
      });
    }
  }

  const handleChangeData = (event) => {  
    setData({
      ...data,
      company_id: currentUser.companyProfiles[0].company_id,
      [event.target.name]: event.target.value,
    });
    setError(false)
  };

  React.useEffect(() => {
    setData({});
  }, []);

  const body = (
    <div className={classes.paper}>
      <form className={classes.root} onSubmit={()=> {RegisterRooms(data)}}>
        <Grid>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
            <h2 variant="h5" gutterBottom>Cadastrar Sala</h2>
            <Grid item>
              <FormControl>
                <TextField variant="outlined" name="name" type="text" label="Nome da Sala"
                  value={data ? data.name : ""}
                  onChange={handleChangeData}
                  error={error}
                  helperText={error ? "insira um nome" : ""}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary" size="medium"
              onClick={(e) => {
                RegisterRooms(e) 
              }}fullWidth
            >Cadastrar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="secondary" aria-label="add" style={{borderRadius: 15}} 
        onClick={handleOpen} 
      >Cadastrar
      </Button>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        {body}
      </Modal>
    </div>
  );
}
