import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";  
import { Modal, Button, Grid, TextField, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";


export default function EditCategories(props) {
  const {apiRequest} = React.useContext(ClientContext);
  const {currentUser} = React.useContext(AuthContext);

  const [data, setData] = React.useState({category_name:props.name});
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState({ category_name:false });

  const handleOpen = () => {setOpen(true)};
  const handleClose = () => {
      setData({category_name:props.name})
      setOpen(false)
    };

  const editCategory = () => {

    if (!data.category_name) {
      setError(e => ({...e,category_name:true}))

    } else {
    	apiRequest("PATCH", `/categories/update/${props.id}`, { ...data })
      	.then((res) => {
			setData({});
			handleClose();
			props.setAlert(1)
			props.setSucess(1)
			props.loadCategories();
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
      status: 1,
      company_id: currentUser.companyProfiles[0].company_id,
      [event.target.name]: event.target.value,
    });
    setError(false)
  };

  React.useEffect (() => {
	if (data.category_name) {
		setError(e => ({...e,category_name:false}))
	}
  }, [data])

  return (
    <div>
		<EditIcon 
				fontSize="medium" 
				style={{cursor:'pointer', color: 'black'}} 
				onClick={handleOpen}
		/>

        <Modal 
			open={open} 
			onClose={handleClose} 
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
				position: "absolute",
				backgroundColor: 'white',
			}}>
				<CloseIcon 
					fontSize="medium"
					onClick={handleClose} 
					style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
				/>

				<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
					<Grid item xs={12} sm={12} md={12}>
						<Typography 
							fullWidth
							variant="h5"
							style={{ color: Colors.primary, width: "90%" }}
						>
							Editar categoria
						</Typography>
					</Grid>
				</Grid>

				<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
					<Grid item xs={12} sm={12} md={12}>
						<TextField
							fullWidth
							style={{width: "90%"}}
							variant="outlined"
							name="category_name"
							label="Nome da Categoria"
							value={data ? data.category_name : ""}
							onChange={handleChangeData}
							error={error.category_name}
							helperText={error.category_name ? "insira um nome" : ""}
						/>
					</Grid>
				</Grid>

				<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
					<Grid item xs={12} sm={12} md={12}>
						<Button
							fullWidth
							variant="contained" 
							color="primary" 
							style={{ borderRadius:8, width: "90%" }}
							onClick={() => editCategory()} 
						>
							Salvar
						</Button>
					</Grid>
				</Grid>

			</div>
        </Modal>

    </div>
  );
}
