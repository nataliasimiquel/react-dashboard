import {
  Button, FormControl, Grid, Modal, TextField
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "./../../contexts/AuthContext";

export default function RegisterServices(props) {
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
  const [error, setError] = React.useState({
    product_id:false,
    amount:false,
    stock_date:false,
    due_date:false,
  });

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const RegisterServices = (e) => {
    e.preventDefault();
    if (!data.name) {
      setError(e => ({...e,name:true}))
    }
    else 
    apiRequest("POST", "/services/add-services", { ...data })
      .then((res) => {
        setData([]);
        handleClose();
        props.setAlert(1)
        props.setSucess(1)
        props.loadStock();
      })
      .catch((err) => {
        handleClose();
        props.setAlert(2)
        props.setSucess(2)
        props.getError(err)
      });
  }

  const handleChangeData = (event) => {
    if (event.target.name === "price") {
      setData({
        ...data,
        company_id: currentUser.companyProfiles[0].company_id,
      });
    } else {
      setData({
        ...data,
        company_id: currentUser.companyProfiles[0].company_id,
        [event.target.name]: event.target.value,
      });
    }
  };

  React.useEffect(() => {
    setData({});
  }, []);

  React.useEffect (() => {
    if (data.product_id) {
      setError(e => ({...e,product_id:false}))
    }
  }, [data])

  const body = (
    <div className={classes.paper}>
      <form className={classes.root}>
        <Grid>
          <CloseIcon onClick={handleClose} style={{cursor: "pointer"}}/>
          <Grid container direction="column" justify="center" alignItems="center" spacing={0.5}>
            <h2 variant="h5" gutterBottom>Cadastrar Estoque</h2>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="name"
                  size="small"
                  label="Nome do serviço"
                  value={data ? data.name : ""}
                  onChange={handleChangeData}
                  error={error.name}
                  helperText={error.name ? "insira um nome" : ""}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid item>
            <Button type="submit"variant="contained" color="primary" size="medium"
              onClick={(e) => {
                RegisterServices(e)
              }} fullWidth 
            >INSERIR
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
    <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        CADASTRAR
      </Button>
    </Grid>
    <Modal open={open} onClose={handleOpen} className={classes.modal}>
      {body}
    </Modal>
  </div>
  );
}
