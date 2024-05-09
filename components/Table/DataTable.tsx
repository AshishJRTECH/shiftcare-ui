import { ReactNode, useRef, useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Scrollbar from "@/ui/scrollbar";

import TableNoData from "./DataTableComponents/table-no-data";
import UserTableRow from "../../pages/staff/staff-table-row";
import UserTableHead, {
  HeadLabelType
} from "./DataTableComponents/user-table-head";
import TableEmptyRows from "./DataTableComponents/table-empty-rows";
import UserTableToolbar from "./DataTableComponents/user-table-toolbar";
import { applyFilter, emptyRows, getComparator } from "./utils";
import Iconify from "../Iconify/Iconify";
import {
  TableHeadProps,
  TableHeadTypeMap,
  TableSortLabelOwnProps
} from "@mui/material";

// ----------------------------------------------------------------------

export default function DataTable({
  data,
  columns,
  RowComponent,
  noCheckbox
}: {
  data: any[];
  columns: HeadLabelType[];
  RowComponent: React.ElementType;
  noCheckbox?: boolean;
}) {
  const ref = useRef(null);
  const [page, setPage] = useState(0);

  const [order, setOrder] =
    useState<TableSortLabelOwnProps["direction"]>("asc");

  const [selected, setSelected] = useState<number[]>([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event: React.MouseEvent<HTMLElement>, id: string) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    filterName
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Card>
      <UserTableToolbar
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
      />

      <Scrollbar ref={ref}>
        <TableContainer sx={{ overflow: "unset" }}>
          <Table sx={{ minWidth: 800 }}>
            <UserTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
              numSelected={selected.length}
              onRequestSort={handleSort}
              onSelectAllClick={handleSelectAllClick}
              headLabel={columns}
              noCheckbox={noCheckbox}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <RowComponent
                      key={row.id}
                      {...row}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => handleClick(event, row.id)}
                    />
                  );
                })}

              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, data.length)}
              />

              {notFound && (
                <TableNoData query={filterName} colSpan={columns.length + 1} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <TablePagination
        page={page}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
