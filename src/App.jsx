import { Routes,Route } from "react-router-dom";
import Login from "./pages/Login";
import List from "./pages/List";
import Details from "./pages/Details";
import Photo from "./pages/Photo";
import PhotoResult from "./pages/PhotoResult";
import ChartPage from "./pages/ChartPage";
import Analytics from "./pages/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/list" element={ <ProtectedRoute>
            <List />
          </ProtectedRoute>
        } />
      <Route path="/details" element={ <ProtectedRoute>
            <Details />
          </ProtectedRoute>
        } />
      <Route path="/photo" element={ <ProtectedRoute>
            <Photo />
          </ProtectedRoute>
        } />
      <Route path="/photo-result" element={ <ProtectedRoute>
            <PhotoResult />
          </ProtectedRoute>
        } />
      <Route path="/chart" element={ <ProtectedRoute>
            <ChartPage />
          </ProtectedRoute>
        } />
      <Route path="/analytics" element={ <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        } />
    </Routes>
  );
}

export default App;
