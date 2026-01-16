import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Published from "./Products/Published";
import Unpublished from "./Products/Unpublished";
import Home from "./Components/Home";
import MainLayout from "./Components/MainLauout";
import ManageProduct from "./Products/ManageProducts";
import Protector from "./ProtectRouter/Protector";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        theme="light"
      />

      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <Protector>
                <MainLayout />
              </Protector>
            }
          >
            <Route element={<Home />}>
              <Route index element={<Published />} />
              <Route path="published" element={<Published />} />
              <Route path="unpublished" element={<Unpublished />} />
            </Route>

            <Route path="products" element={<ManageProduct />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
