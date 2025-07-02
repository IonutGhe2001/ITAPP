import AppRouter from "./router";
import { ToastProvider } from "./components/ToastProvider"; 

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}

export default App;
