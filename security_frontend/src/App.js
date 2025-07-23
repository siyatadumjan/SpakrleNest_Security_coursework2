import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

import Register from './pages/register/Register';
import Login from './pages/login/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import UpdateProduct from './pages/admin/update_product/UpdateProduct';
import BoardingPage from './pages/boardingPage/Boardingpage';
import Homepage from './pages/homepage/Homepage';
import AdminRoutes from './protected_routes/AdminRoutes';
import UserRoutes from './protected_routes/UserRoutes';
import ProductDetails from './pages/product_details/ProductDetails';
import AddToCart from './pages/addToCart/AddToCart';
import Wishlist from './pages/wishlist/Wishlist';
import PlaceOrder from './pages/order/PlaceOrder';
import ViewOrder from './pages/admin/view_order/ViewOrder';
import ActivityLog from './pages/admin/dashboard/ActivityLog';
import EditProfile from './pages/EditProfile/EditProfile';
import ForgetPassword from './forgetpassword/ForgetPassword';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<BoardingPage />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
       
       
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path='/admin/update/:id' element={<UpdateProduct />} />
          <Route path='/admin/view-order' element={<ViewOrder />} />
          <Route path='/admin/activity-log' element={<ActivityLog />} />

        </Route>

        <Route element={<UserRoutes />}>
          <Route path='/homepage' element={<Homepage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/add-to-cart" element={<AddToCart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/edit-profile" element={<EditProfile />} />

        </Route>
        <Route path='/forgotpassword' element={<ForgetPassword/>} />
      </Routes>
    </Router>
  );
}

export default App;
