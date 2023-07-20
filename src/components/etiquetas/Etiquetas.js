import React from "react";
import {Paper, Stack, Typography} from "@mui/material";
import TitleCard from "../../reusable/card/TitleCard";
import Tabs from "../../reusable/Tabs";
import CrearLoteForm from "./CrearLoteForm";
import ReimprimirLoteForm from "./ReimprimirLoteForm";

function Etiquetas() {
  return (
    <Stack
      width="100vw"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{mt: "30px"}}
    >
      <TitleCard
        title="Etiquetas"
        subtitle="Creacion e impresion de etiquetas"
        width="60vw"
        sx={{marginY: "auto"}}
      >
        <Paper elevation={3} sx={{width: "80%", mb: 5}}>
          <Tabs
            indexes={[0, 1]}
            labels={["Crear lote nuevo", "Reimprimir etiquetas"]}
            activeTab={0}
          >
            <CrearLoteForm />
            <ReimprimirLoteForm />
          </Tabs>
        </Paper>
      </TitleCard>
    </Stack>
  );
}

export default Etiquetas;
