import { tesloApi } from "@/api";
import { AdminLayout } from "@/components/layouts";
import { IUser } from "@/interfaces";
import { PeopleOutlined } from "@mui/icons-material";
import { Grid, MenuItem, Select } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useSWR from "swr";

const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data])

    if (!data && !error) {
        return <></>
    };

    const onRoleUpdated = async (userId: string, newRole: string) => {
        const previousUsers = users.map((user) => ({ ...user }));
        const updatedUsers = users.map((user) => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('admin/users', {
                userId, 
                role: newRole
            });
        } catch (error) {
            setUsers(previousUsers);
            console.log(error);
            alert('No se pudo actualizar el rol del usuario')
        }
    };

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre Completo', width: 300 },
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Rol"
                        onChange={({target}) => onRoleUpdated(row.id, target.value)}
                        sx={{width: '300px'}}
                    >
                        <MenuItem value='admin'>Administrador</MenuItem>
                        <MenuItem value='client'>Cliente</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }));

    return (
        <AdminLayout
            title="Usuarios"
            subTitle="Mantenimiento de Usuarios"
            icon={<PeopleOutlined />}
        >
            <Grid container className="fadeIn">
                <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                    <DataGrid 
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {paginationModel: {pageSize: 5}},
                        }}
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    );
};

export default UsersPage;