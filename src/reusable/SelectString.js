import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {Skeleton} from "@mui/material";

export default function SelectString({
  options,
  label,
  formik,
  valueName,
  editing,
  isLoading,
}) {
  const handleChange = (event) => {
    formik.setFieldValue(valueName, event.target.value);
  };

  const arrayIndexes = Object.keys(options);
  //  <Skeleton width={"100%"} height={calcHeight + "px"} />
  return (
    <>
      {isLoading ? (
        <Skeleton width={"100%"} height="50px" />
      ) : (
        <Box sx={{minWidth: 120, width: "100%"}}>
          <FormControl
            fullWidth
            size="large"
            variant="standard"
            disabled={!editing}
          >
            <InputLabel
              id="demo-simple-select-label"
              data-cy={`${valueName}-label`}
            >
              {label}
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formik.values[valueName]}
              label="Estado"
              onChange={handleChange}
              data-cy={valueName}
            >
              {arrayIndexes.map((index) => {
                const {name} = options[index];
                return (
                  <MenuItem value={name} key={index}>
                    {name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      )}
    </>
  );
}
