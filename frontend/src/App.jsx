import {ChakraProvider} from "@chakra-ui/react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Home} from "./page/Home.jsx";
import RegisterStepper from "./page/host/register/RegisterStepper.jsx";
import {createTheme} from "@mui/material/styles";
import {ThemeProvider} from "@mui/material";
import {Reserve} from "./page/Reserve.jsx";
import {SpaceOption} from "./page/admin/space_config/SpaceOption.jsx";

// MUI 테마 설정
const theme = createTheme();

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      children: [
        {
          path: "reserve",
          element: <Reserve/>,
        },
        {},
      ],
    },
    {path: "space/register", element: <RegisterStepper/>},
    {path: "space/option", element: <SpaceOption/>},
  ]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ChakraProvider>
          <RouterProvider router={router}/>
        </ChakraProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
