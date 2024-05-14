import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableHead from "@mui/material/TableHead";
import TableCell, { SortDirection } from "@mui/material/TableCell";
import TableSortLabel, {
  TableSortLabelOwnProps
} from "@mui/material/TableSortLabel";

import { visuallyHidden } from "../utils";

// ----------------------------------------------------------------------

export interface HeadLabelType {
  id: string;
  label: string;
  align?: "left" | "right" | "center" | "justify" | "inherit";
  width?: number | string;
  minWidth?: number | string;
}

export default function UserTableHead({
  order,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onRequestSort,
  onSelectAllClick,
  noCheckbox
}: {
  order: TableSortLabelOwnProps["direction"];
  orderBy: string;
  rowCount: number;
  headLabel: HeadLabelType[];
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<HTMLElement>, p: string) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  noCheckbox?: boolean;
}) {
  const onSort =
    (property: string) => (event: React.MouseEvent<HTMLElement>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {!noCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || "left"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width: headCell.width,
              minWidth: headCell.minWidth,
              whiteSpace: "nowrap"
            }}
          >
            <TableSortLabel
              hideSortIcon
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={onSort(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box sx={{ ...visuallyHidden }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  );
}
