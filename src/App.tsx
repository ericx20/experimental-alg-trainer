import { Box } from "@mui/joy";
import { AlgSelect } from "./views/AlgSelect";
import { AlgTrainer } from "./views/AlgTrainer";

function App() {
  return (
    <Box maxWidth="lg" marginX="auto">
      <AlgSelect />
      <AlgTrainer />
    </Box>
  );
}

export default App;
