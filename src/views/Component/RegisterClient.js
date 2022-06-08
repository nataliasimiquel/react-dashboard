import { Button, FormControl, Grid, Modal, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from './../../contexts/AuthContext';

export default function RegisterClient(props) {
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
        },
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
        minWidth: 120,
        maxWidth: 300,
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
    
    function RegisterClient() {
      if ((!data.cpf)|| data.cpf.length === 0) {
        setError(true)
      }
      else {
        apiRequest ("POST", `/customer/add-customer`, { ...data})
        .then((res) => {
          setData({});
          handleClose();
          props.setAlert(1)
          props.setSucess(1)
          props.loadClient()
        })
        .catch((err) => {
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
      setData({})
    },[]); // eslint-disable-line react-hooks/exhaustive-deps
     
    const body = (
        <div className={classes.paper}>
            <form className={classes.root} onSubmit={()=> {RegisterClient(data)}}>
                <Grid>
                    <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
                    <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
                        <h2 variant="h5" gutterBottom>Cadastrar Cliente</h2>
                        <Grid item>
                            <FormControl>
                              <TextField variant="outlined" name="name" label="Nome Completo"
                                value={data ? data.name : ""}
                                onChange={handleChangeData}
                                error={error}
                                helperText={error ? "insira um nome" : ""}
                              />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                              <TextField variant="outlined" name="cpf" type="number" label="CPF"
                                value={data ? data.cpf : ""}
                                onChange={handleChangeData}
                                error={error.cpf}
                                helperText={error.cpf ? "insira o cpf" : ""}
                              />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <TextField variant="outlined" name="email" type="text" label="Email"
                                  value={data ? data.email : ""}
                                  onChange={handleChangeData}
                                  error={error}
                                  helperText={error ? "insira um email" : ""}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <TextField variant="outlined" name="phone" type="number" label="Telefone"
                                  value={data ? data.phone : ""}
                                  onChange={handleChangeData}
                                  error={error}
                                  helperText={error ? "insira um telefone" : ""}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item>
                      <Button variant="contained" color="primary" size="medium"
                        onClick={(e) => RegisterClient(e)} type="submit" fullWidth
                      >Cadastrar
                      </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
  
    return (
        <div>
            <Button variant="contained" color="secondary" style={{borderRadius: 15}} onClick={handleOpen} aria-label="add">Cadastrar</Button>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
                {body}
            </Modal>
        </div>
    );
}