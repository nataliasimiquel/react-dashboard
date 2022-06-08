import {
  Card,
  Grid,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import AuthContext from "./../../contexts/AuthContext";
import ClientContext from "./../../contexts/ClientContext";
import EditRooms from "./../Component/EditRooms";
import RegisterRooms from "./../Component/RegisterRooms";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 0,
  },
  header: {
      height: "20",
  },
  row: {
    display:"flex",
    flexDirection: "row",
    justifyContent: "space-around"
  }
}));

export default function Rooms(props) {

  const classes = useStyles();

  const {className, loading = false, error = null} = props;
  const {currentUser} = React.useContext(AuthContext);
  const {apiRequest} = React.useContext(ClientContext);

  const [loadingRooms, setLoadingRooms] = React.useState([]);
  const [alert, setAlert] = React.useState(undefined);
  const [success, setSucess] = React.useState(undefined);
  const [errorMessage, setErrorMessage] = React.useState("");

  const getError = (err) => {
    console.log((err.message))
    setErrorMessage(err.message)
  }

  const loadRooms = () => {
    if (success === 1) {
      setAlert(1)   
    }
    if (success === 2) {
      setAlert(2)   
    }
    apiRequest("GET", `/rooms/list/${currentUser.companyProfiles[0].company_id}`)
    .then((res) => {
      setLoadingRooms(res);
    })
    .catch((err) => {
      console.log("nao conseguiu carregar as salas", err);
    });
  };

  const removeRooms = (value) => {
    let removedClasses = loadingRooms.filter((item) => item !== value);
    setLoadingRooms(removedClasses);
    apiRequest("PATCH", `/rooms/${value.id}/deactivate/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {})
      .catch((err) => {
        console.log("nao conseguiu apagar a sala", err);
      });
  };  
 
  React.useEffect(() => {
    loadRooms(); 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    loadRooms();
  },[success]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {
        alert &&  ((alert === 1)
          ? <Alert severity="success">Sucesso!</Alert>
          : <Alert severity="error">{errorMessage || "error"}</Alert>
        ) 
      }    
      <Card className={clsx(className)}>
        <CardHeader action={<RegisterRooms 
          getError={(err) => getError(err)} 
          loadRooms={() => {loadRooms()}}
          setAlert={setAlert} setSucess={setSucess}/>} 
          title="SALAS"
        />
        <Divider />
        {loading || error ? (
          <CardContent align="center">
            {loading ? (
              <CircularProgress />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "red",
                  fontSize: 12,
                }}
              >
                {error}
              </div>
            )}
          </CardContent>
        ) : (
          <CardContent className={classes.content}>
            <div className="table-responsive">
              <Table>
                <TableHead>
                  <TableRow>

                      <TableCell>NOME</TableCell>
                    <TableCell>OPÇÕES</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingRooms.length === 0 ? (
                    <div />
                  ) : (
                    loadingRooms.map((rooms) => 
                    {
                      return(
                      <TableRow>
                        <TableCell>{rooms.name}</TableCell>
                        <TableCell>
                          <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={3}>
                            <Grid item>
                              <EditRooms setSucess={setSucess} setAlert={setAlert} loadRooms={() => {loadRooms()}} rooms={rooms} />
                            </Grid>
                            <Grid item>
                              <DeleteIcon
                                fontSize="small"
                                style={{ cursor: "pointer" }}
                                onClick={()=> removeRooms(rooms)}
                              />
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    )}
                    )
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        )}
        <Divider />
      </Card>
    </div>
  );
}
