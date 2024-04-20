import {createBrowserRouter} from "react-router-dom";
import Homepage from "../pages/Homepage";
import MapSearchpage from "../pages/MapSearchpage";
import OrderPage from "../pages/OrderPage";

const router = createBrowserRouter([
    {
      path: "/",
      element:<Homepage/>,
    },
    {
      path: "/MapSearchpage",
      element: <MapSearchpage/>,
    },
    {
      path: "/OrderPage",
      element: <OrderPage/>,
    },
  ]);

  export default router;