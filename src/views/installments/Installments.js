import {
	Card, CardContent, CircularProgress
} from "@material-ui/core";
import React from "react";
import CustomTable from "../Component/custom/CustomTable";
import DeleteModal from "../Component/custom/DeleteModal";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";


export default function Products (props) {
const {loading = false, error = null} = props;
const {currentUser} = React.useContext(AuthContext);
const {apiRequest} = React.useContext(ClientContext);

const [installments, setInstallments] = React.useState([]);
const [openDelete, setOpenDelete] = React.useState(false);

const handleOpenDelete = () => setOpenDelete(true);
const handleCloseDelete = () => setOpenDelete(false);

const loadInstallments = () => {
	apiRequest("GET", `/installments/all/${currentUser.companyProfiles[0].company_id}`)
	.then((res) => {
		setInstallments(res);
	})
	.catch((err) => {
		console.log("Erro dentro de loadInstallments", err);
	});
};

const createInstallment = () => {
	apiRequest("POST", `/installments/`)
	.then((res) => {
		loadInstallments()
	})
	.catch((err) => {
		console.log("Erro dentro de createInstallment", err);
	});
};

function createData(param1, param2) {
    return [param1, param2, "edit", "delete"];
}

const list = [
    ...installments.map((item) => (
        createData(item.num_installments, item.min_value) 
    ))
].sort((a, b) => (a.min_value < b.min_value ? -1 : 1));



React.useEffect(() => {
    console.log({list})
}, [list]); // eslint-disable-line react-hooks/exhaustive-deps

React.useEffect(() => {
    loadInstallments()
}, []); // eslint-disable-line react-hooks/exhaustive-deps


return (
	<div>
		<Card style={{marginTop:"2%"}}>
			{loading || error ? (
			<CardContent align="center">
				{loading ? (
				<CircularProgress />
				) : (
				<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
					{error}
				</div>
				)}
			</CardContent>
			) : (
				<CustomTable
					listBody={list}
                    title={"Parcelas"}
                    listHeader={["Nº de parcelas", "Valor mínimo", "Editar", "Deletar"]}

					buttonBody={'Nova parcela'}
					buttonFunction={createInstallment}

					handleOpenDelete={handleOpenDelete}
                />
            )}
		</Card>

		<DeleteModal
			open={openDelete}
			handleOpen={handleOpenDelete}
			handleClose={handleCloseDelete}
		/>
	</div>
  );
};

