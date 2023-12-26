import { Box, Stack } from "@mui/joy";
import { AlgSelect } from "./views/AlgSelect";
import { AlgTrainer } from "./views/AlgTrainer";

function App() {
  return (
    <Box maxWidth="lg" marginX="auto" padding={3}>
      <Stack spacing={2}>
        <AlgSelect />
        <AlgTrainer />
      </Stack>
    </Box>
  );
}

export default App;
