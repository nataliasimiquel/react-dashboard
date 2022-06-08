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
import EditServices from "./../Component/EditServices";
import RegisterServiceRoom from "./../Component/RegisterServiceRoom";

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 0,
  },
}));

export default function Rooms(props) {
  const { className, loading = false, error = null } = props;
  const classes = useStyles();
  const { currentUser } = React.useContext(AuthContext);
  const { apiRequest } = React.useContext(ClientContext);

  const [loadingServicesRooms, setLoadingServicesRooms] = React.useState([]);
console.log('loadingServicesRooms',loadingServicesRooms);


  const removeServicesRooms = (value) => {
    apiRequest("PATCH", `/servicesrooms/${value.id}/deactivate/${currentUser.companyProfiles[0].company_id}`)
    .then((res) => {
      let removedServiceRoom = loadingServicesRooms.filter((item) => item !== value);
      setLoadingServicesRooms(removedServiceRoom);
      console.log('apagou')
      })
      .catch((err) => {
        // console.log("nao conseguiu apagar a sala", err);
      });
  };

  const loadServicesRooms = () => {
    apiRequest("GET", `/servicesrooms/list/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setLoadingServicesRooms(res);

      })
      .catch((err) => {
        console.log("nao conseguiu carregar os serviços", err);
      });
  };

  React.useEffect(() => {
    loadServicesRooms();
  }, []);

  return (
    <div>
      <div className="col-lg-12">
        <div className="card">
          <Card className={clsx(className)}>
            <CardHeader
              action={<RegisterServiceRoom />}
              title="Serviços das salas"
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
                        <TableCell>id do serviço da sala</TableCell>
                        <TableCell>Nome da sala</TableCell>
                        <TableCell>Nome do serviço</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loadingServicesRooms.length === 0 ? (
                        <div />
                      ) : (
                        loadingServicesRooms.map((serviceRoom) => (
                          <TableRow>
                            {/* {console.log("serviceRoom", serviceRoom)} */}
                            <TableCell>{serviceRoom.id}</TableCell>
                            <TableCell>{serviceRoom.rooms.name}</TableCell>
                            <TableCell>{serviceRoom.services.name}</TableCell>
                            <TableCell>
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={3}
                              >
                                <Grid item>
                                  {/* <EditServices serviceRoom={serviceRoom} /> */}
                                </Grid>
                                <Grid item>
                                  <DeleteIcon
                                    fontSize="small"
                                    style={{ cursor: "pointer" }}
                                      onClick={()=> removeServicesRooms(serviceRoom)}
                                  />
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            )}
            <Divider />
          </Card>
        </div>
      </div>
    </div>
  );
}
