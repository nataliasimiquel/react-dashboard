import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "../../contexts/AuthContext";
import {
  makeStyles,
  Modal,
  Button,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  Card,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from '@material-ui/core/FormHelperText';
import Select from "@material-ui/core/Select";
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: 10,
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
    width: "34ch",
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function AddSchedules(props) {
  const classes = useStyles();

  const [modalStyle] = React.useState();
  const { apiRequest } = React.useContext(ClientContext);
  const { currentUser } = React.useContext(AuthContext);
  const [value, setValue] = React.useState([""]);
  const [value2, setValue2] = React.useState([""]);
  const [inputValue, setInputValue] = React.useState("");
  const [inputValue2, setInputValue2] = React.useState("");
  const [loadingRooms, setLoadingRooms] = React.useState([]);
  const [loadingServices, setLoadingServices] = React.useState([]);
  const [loadingServicesRooms, setLoadingServicesRooms] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [type, setType] = React.useState("");
  const [data, setData] = React.useState({});
  const [data2, setData2] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);

  // console.log("data", data);
  // console.log("data2", data2);
  // console.log("loadingRooms", loadingRooms);
  // console.log("value", value);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const postAvailability = (e) => {
    e.preventDefault();
    if (!data.period) {
      alert("err");
    } else {
      const submitData = {
        ...data,
        ...data2,
        // period: data.period,
        company_id: currentUser.companyProfiles[0].company_id,
        // date_time:
      };
      console.log("submitData", submitData);
      apiRequest("POST", "/availability/add-availability", { ...submitData })
        .then((res) => {
          setData({});
          handleClose();
          // props.setAlert(1);
          // props.setSucess(1);
          props.GetAvailability();
        })
        .catch((err) => {
          handleClose();
          alert(err);
        });
    }
  };
  const loadServiceRoom = () => {
    apiRequest("GET", `/servicesrooms/list/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setLoadingServicesRooms(res);
      })
      .catch((err) => {
        console.log("erro", err);
      });
  };

  const loadService = () => {
    apiRequest("GET", `/services/list/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setLoadingServices(res);
      })
      .catch((err) => {
        console.log("erro", err);
      });
  };

  const loadRooms = () => {
    apiRequest("GET", `/rooms/list/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setLoadingRooms(res);
      })
      .catch((err) => {
        console.log("nao conseguiu carregar as salas", err);
      });
  };

  const handleSelectData = (e) => {
    console.log("ea sports ",e);
    setData2(
      {
        [e.target.name]: e.target.value,
      },
    );
  };

  const handleChangelist = (event) => {
    event.target.value === "rooms"
      ? setList({ obj: loadingRooms, type: "room_id" })
      : event.target.value === "services"
      ? setList({ obj: loadingServices, type: "service_id" })
      : setList({ obj: loadingServicesRooms, type: "service_room_id" });

    setType(event.target.value);
    // console.log("vaaaaaaaaaaaaaaaaaaaaaalue", event.target.value);
  };

  const handleChangeData = (event) => {
    setData({
      ...data,
      company_id: currentUser.companyProfiles[0].company_id,
      [event.target.name]: event.target.value,
    });
    setError(false);
  };

  React.useEffect(() => {
    loadRooms();
    loadService();
    loadServiceRoom();
  }, []);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <form className={classes.root}>
        <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Adicionar uma Disponibilidade
            </Typography>
          </Grid>

          <Grid item direction="column" spacing={0.5}>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="period"
                  label="Período em minutos"
                  value={data ? data.period : ""}
                  onChange={handleChangeData}
                  error={error.period}
                  helperText={error.period ? "insira um nome" : ""}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="weekday"
                  label="Dia da semana"
                  value={data ? data.weekday : ""}
                  onChange={handleChangeData}
                  error={error.weekday}
                  helperText={error.weekday ? "insira um nome" : ""}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="start_time"
                  label="Hora de inicio"
                  value={data ? data.start_time : ""}
                  onChange={handleChangeData}
                  error={error.start_time}
                  helperText={error.start_time ? "insira um nome" : ""}
                />
              </FormControl>
            </Grid>

            <Grid container direction="row">
              <FormControl
                className={classes.formControl}
                required
                variant="outlined"
              >
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  fullWidth
                  value={type}
                  onChange={handleChangelist}
                >
                  <MenuItem value={"rooms"}>sala</MenuItem>
                  <MenuItem value={"services"}>serviço</MenuItem>
                  <MenuItem value={"servicesRooms"}>sala / serviço</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid container direction="row">
              <FormControl
                className={classes.formControl}
                required
                variant="outlined"
              >
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  fullWidth
                  onChange={e=>handleSelectData(e)}
                >
                  {list.obj &&
                    list.obj.map((item) => (
                      <MenuItem
                      onClick={() => {
                        // console.log("zzzxzxzx-----",item);
                      }}
                      value={item.id}
                      name={list.type}
                      >
                        {/* {console.log("lissssssssssssssssssssst",list.type)} */}
                        {item.name
                          ? item.name
                          : `${item.rooms.name} ${item.services.name}`}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Card className={classes.scroll}></Card>
          </Grid>

          <Grid item>
            <FormControl style={{ marginTop: 15, width: 200 }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={(e) => {
                  postAvailability(e);
                }}
              >
                Adicionar
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
      >
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          Inserir Disponibilidade
        </Button>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.modal}>
        {body}
      </Modal>
    </div>
  );
}

/* React.useEffect(() => {
    setMethod(paymetods)
    console.log(paymetods);
  }, [paymetods] */
