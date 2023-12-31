import React from "react";
import {Skeleton, TableCell, TableRow} from "@mui/material";
// Reusables
// Components
import SelectState from "./SelectState";
// Redux
import {useSelector} from "react-redux";
// Data

function RowBatch({row, columns, id, page, rowsPerPage}) {
  const isLoading = useSelector((state) => state.batches.isLoading);

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={row.nroDoc}>
      {columns.map((column) => {
        const value = row[column.id];
        return (
          <TableCell key={column.id} align={column.align}>
            {isLoading ? (
              <Skeleton />
            ) : column.id === "estado" ? (
              <>
                <SelectState
                  selectedValue={row.estado || ""}
                  id={id}
                  page={page}
                  rowsPerPage={rowsPerPage}
                />
              </>
            ) : column.format && typeof value === "number" ? (
              column.format(value)
            ) : (
              value
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

export default RowBatch;
