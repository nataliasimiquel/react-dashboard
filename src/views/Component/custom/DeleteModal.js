import {
    Button, CircularProgress, Grid, Modal, Typography
} from "@material-ui/core";
import React from "react";

const DeleteModal=(props)=> {
    return (
        <Modal
            open={props.open}
            onClose={props.handleClose}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <div style={{
                width: "35%",
                minWidth: 350,
                borderRadius: 10,
                backgroundColor: 'white',
            }}>
                <div style={{margin:"4%"}}>
                    <Grid container xs={12} sm={12} md={12}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Typography 
                                fullWidth
                                variant="h5" 
                                gutterBottom
                                style={{
                                    color: 'black',
                                    marginTop: "4%", 
                                    textAlign: "center", 
                                }}
                            > 
                                Tem certeza que deseja excluir?
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid 
                        container 
                        spacing={1}
                        xs={12} sm={12} md={12} 
                        style={{marginTop:"2%"}} 
                    >
                        <Grid item xs={12} sm={12} md={6}>
                            <Button 
                                fullWidth
                                size="medium"
                                variant="contained" 
                                onClick={() => {props.handleClose();}}
                                style={{
                                    color: 'black', 
                                    borderRadius:8
                                }}
                            >
                                Cancelar
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            {
                                props.deleting
                                ? <CircularProgress />
                                :
                                <Button 
                                    fullWidth
                                    variant="contained" 
                                    color="primary" 
                                    size="medium"
                                    style={{
                                        borderRadius:8
                                    }}
                                    onClick={(e) => { 
                                        props.delete();
                                        props.handleClose();
                                    }}
                                > 
                                    Excluir
                                </Button>
                            }
                        </Grid>
                    </Grid>
                </div>

            </div>
        </Modal>
    );
}
export default DeleteModal;