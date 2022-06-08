import {
  Button, FormControl, Grid, Modal, TextField, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import AuthContext from "./../../contexts/AuthContext";

export default function RegisterSchedule(props) {
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
  }));

  const { apiRequest } = React.useContext(ClientContext);

  const classes = useStyles();
  const [data, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => {
    setOpen(true);
    setData({});
  };

  console.log('props',props);
  console.log('datatatatattaa',data);
  function RegisterSchedule() {
    apiRequest("POST", `/schedules_dates/add-schedules_dates/${props.id}`, {
      ...data,
    })
      .then((res) => {
        setData({});
        handleClose();
        console.log(res.status);
      })
      .catch((err) => {
        alert(err);
        console.log(err.data);
      });
  }

  const handleChangeData = (event,props) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
    console.log('props.weekday',props.weekday);
  };

  React.useEffect(() => {
    setData({});
  }, []);

  const body = (
    <div className={classes.paper}>
      <form
        className={classes.root}
        onSubmit={() => {
          RegisterSchedule(data);
        }}
      >
        <Grid>
          <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={0.5}
          >
            <h2 variant="h5" gutterBottom>
              Cadastrar agendamento
            </h2>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="period"
                  label="Periodo"
                  value={data ? data.period : ""}
                  onChange={handleChangeData}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="date_time"
                  type="text"
                  label="date_time"
                  value={data ? data.date_time : ""}
                  onChange={handleChangeData}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  variant="outlined"
                  name="date"
                  type="date"
                  value={data ? data.date : ""}
                  onChange={handleChangeData}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              size="medium"
              onClick={() => RegisterSchedule(data)}
              style={{ cursor: "pointer" }}
              type="submit"
              fullWidth
            >
              Inserir agendamento
            </Button>
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
        onClick={handleOpen}
      >
        <Grid style={{ cursor: "pointer" }} item>
          <AddIcon />
        </Grid>
        <Grid style={{ cursor: "pointer" }} item>
          <Typography>Agendamento</Typography>
        </Grid>
      </Grid>
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
