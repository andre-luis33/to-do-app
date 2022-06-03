import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './views/Home/index'
import NotFound from "./views/NotFound"


const RoutesHandle = (props) => {

   return (
      <BrowserRouter>
         <Routes>
            <Route index path="/" element={<Home />} />
            <Route path='*' exact element={<NotFound />}/>
         </Routes>
      </BrowserRouter>
   )



}

export default RoutesHandle