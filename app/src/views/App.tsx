import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { AddItemForm } from "../components/AddItemForm";
import { MatrixBoard } from "../components/MatrixBoard";
import { useMatrixItems } from "../controllers/useMatrixItems";

export default function App() {
  const {
    sections,
    addItem,
    saveItem,
  } = useMatrixItems();

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 2, md: 3 } }}>
      <Container maxWidth="xl">
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1}>
            <Box>
              <Typography variant="h1">JMatrix</Typography>
              <Typography color="text.secondary">
                John-modified Eisenhower Matrix
              </Typography>
            </Box>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
              gap: 2,
              alignItems: "start",
            }}
          >
            <MatrixBoard
              sections={sections}
              onSaveItem={saveItem}
            />
            <Paper variant="outlined" sx={{ p: 2, position: { lg: "sticky" }, top: 16 }}>
              <AddItemForm onAdd={addItem} />
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
