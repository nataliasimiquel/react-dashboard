import {
  Button, FormControl, Grid,
  InputLabel, MenuItem, Modal, Select, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";

export default function RegisterServiceRoom(props) {
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
  const { apiRequest } = React.useContext(ClientContext);
  const { currentUser } = React.useContext(AuthContext);

  const classes = useStyles();
  const [data, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [rooms, setRooms] = React.useState([]);
  const [services, setService] = React.useState([]);

  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
    setData({});
  };

  const loadRooms = () => {
    apiRequest("GET", `/rooms/all/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setRooms(res);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const loadServices = () => {
    apiRequest("GET", `/services/all/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setService(res);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const RegisterServicesRoom = () => {
    apiRequest("POST", `/servicesrooms/add-servicesrooms/${1}`, { ...data })
      .then((res) => {
        handleClose();
      })
      .catch((err) => {
      });
  };

  const getCurrentRoom = (b) => {
    setData({
      ...data,
      room_id: b.id,
    });
  };

  const getCurrentService = (c) => {
    console.log("c", c);
    setData({
      ...data,
      service_id: c.id,
    });
  };

  React.useEffect(() => {
    setData({});
    loadRooms();
    loadServices();
  }, []);

  const body = (
    <div className={classes.paper}>
      <form className={classes.root}>
        <Grid>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />

          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={0.5}
          >
            <Typography variant="h5">Cadastrar Serviço da sala</Typography>
            <Grid item>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel htmlFor="demo-simple-select-autowidth-label">
                  Nome da sala
                </InputLabel>
                <Select
                 size="large" 
                 value={data.name}
                 labelId="demo-simple-select-autowidth-label"
                 id="demo-simple-select-autowidth"
                autoWidth
                 label="Nome da sala">
                  {rooms.map((b) => {
                    return (
                      <MenuItem
                        value={b}
                        onClick={() => {
                          getCurrentRoom(b);
                        }}
                      >
                        {b.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="demo-simple-select-autowidth-label">
                Serviços
              </InputLabel>

              <Select value={data.name} label="Serviço">
                {services.map((c) => {
                  return (
                    <MenuItem
                      value={c}
                      onClick={() => {
                        getCurrentService(c);
                      }}
                    >
                      {c.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={() => {
                RegisterServicesRoom();
              }}
              fullWidth
              handleClose
            >
              inserir
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleOpen}>
        Inserir serviço da sala
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
