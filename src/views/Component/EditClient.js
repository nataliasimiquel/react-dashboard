import { Button, FormControl, Grid, makeStyles, Modal, TextField } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";
import ClientContext from "../../contexts/ClientContext";

export default function EditClient(props) {

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
    modal: {
      display: "flex",
      padding: theme.spacing(1),
      alignItems: "center",
      justifyContent: "center",
    },
    textField: {
      width: "30ch",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 240,
      maxWidth: 600, 
    },
  }));

  const classes = useStyles();

  const {apiRequest} = React.useContext(ClientContext);

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  
  const handleClose = () => { setOpen(false) };
  const handleClickOpen = () => { setOpen(true) };

  const EditClient = (e) => {
    e.preventDefault();
    apiRequest("PATCH", `/customer/edit-customer/${props.client.id}`, { ...data })
      .then((res) => {
        setData([]);
        handleClose();
        props.setAlert(1)
        props.setSucess(1)
        props.loadClient();
          
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
      ...data,
      company_id: 1,
      [event.target.name]: event.target.value,
    });
  };

 const body = (
    <div className={classes.paper}>
      <form className={classes.root} >
        <Grid>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }}/>
          <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
            <h2 variant="h5" gutterBottom>EDITAR</h2>
            <Grid item>
              <FormControl>
                <TextField variant="outlined" name="name" type="text" label="NOME COMPLETO" 
                  defaultValue={props.client.name}
                  value={data ? data.name : ""}
                  onChange={handleChangeData}
                />
              </FormControl>
            </Grid>

              <Grid item>
                <FormControl>
                  <TextField variant="outlined" name="cpf" type="cpf" label="CPF" 
                    defaultValue={props.client.cpf} 
                    value={data ? data.cpf : ""}
                    onChange={handleChangeData}
                  />
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl>
                  <TextField variant="outlined" name="email" type="email" label="EMAIL"  
                    defaultValue={props.client.email}
          
                    value={data ? data.email : ""}
                    onChange={handleChangeData}
                  />
                </FormControl>
              </Grid>

              <Grid item>
                <FormControl>
                  <TextField variant="outlined" name="phone" type="phone" label="TELEFONE"  
                    defaultValue={props.client.phone} 
                    value={data ? data.phone : ""}
                    onChange={handleChangeData}
                  />
                </FormControl>
              </Grid>
              
              <Grid item>
                <Button type="submit"variant="contained" color="primary" size="medium"
                  onClick={(e) => {
                    EditClient(e)
                    handleClose();
                  }} fullWidth 
                  >ALTERAR
                  
                </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  )
   
  return (
    <div>
      <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
        <EditIcon style={{ cursor: "pointer" }} onClick={handleClickOpen}/>
      </Grid>
      <Modal open={open} onClose={handleClickOpen} className={classes.modal}>
        {body}
      </Modal>
    </div>
  ); 
}
