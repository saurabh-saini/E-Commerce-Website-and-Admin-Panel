import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import AppRoutes from "./routes/AppRoutes";
import Spinner from "./components/Spinner";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Spinner />
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}
