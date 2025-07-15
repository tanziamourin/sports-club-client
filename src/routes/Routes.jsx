import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";


// Public Pages
import Home from "../pages/CommonPages/Home";
import Courts from "../pages/Courts/Courts";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// User Dashboard Pages
import UserProfile from "../pages/Dashboard/User/UserProfile";
import UserBookings from "../pages/Dashboard/User/UserBookings";
import UserAnnouncements from "../pages/Dashboard/User/UserAnnouncements";
import PendingBookings from "../pages/Dashboard/User/PendingBookings";

// Member Dashboard Pages
import MemberProfile from "../pages/Dashboard/Member/MemberProfile";
import MemberPendingBookings from "../pages/Dashboard/Member/MemberPendingBookings";
import ApprovedBookings from "../pages/Dashboard/Member/ApprovedBookings";
import ConfirmedBookings from "../pages/Dashboard/Member/ConfirmedBookings";
import PaymentPage from "../pages/Dashboard/Member/PaymentPage";
import PaymentHistory from "../pages/Dashboard/Member/PaymentHistory";
import MemberAnnouncements from "../pages/Dashboard/Member/MemberAnnouncements";

// Admin Dashboard Pages
import AdminProfile from "../pages/Dashboard/Admin/AdminProfile";
import BookingApproval from "../pages/Dashboard/Admin/BookingApproval";
import ManageMembers from "../pages/Dashboard/Admin/ManageMembers";
import AllUsers from "../pages/Dashboard/Admin/AllUsers";
import ManageCourts from "../pages/Dashboard/Admin/ManageCourts";
import ConfirmedBookingsAdmin from "../pages/Dashboard/Admin/ConfirmedBookingsAdmin";
import ManageCoupons from "../pages/Dashboard/Admin/ManageCoupons";
import ManageAnnouncements from "../pages/Dashboard/Admin/ManageAnnouncements";

// Route Guards
import PrivateRoute from "./PrivateRoute";
import MemberRoute from "./MemberRoute";
import AdminRoute from "./AdminRoute";
import NotFound from "../pages/CommonPages/NotFound";
import WelcomePage from "../pages/Dashboard/WelcomePage";
import EditCourt from "../pages/Dashboard/Admin/EditCourt";
import EditAnnouncement from "../pages/Dashboard/Admin/EditAnnouncement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/courts", element: <Courts /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [

         {
        index: true, // /dashboard route
        element: <WelcomePage />,
      },
      // 🟢 User Routes
      { path: "user/profile", element: <UserProfile /> },
      { path: "user/bookings", element: <UserBookings /> },
      { path: "user/announcements", element: <UserAnnouncements /> },
      { path: "user/pending", element: <PendingBookings /> },

      // 🔵 Admin Routes
      {
        path: "admin/profile",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/bookings",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <BookingApproval />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/members",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageMembers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllUsers />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/courts",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageCourts />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
  path: "/dashboard/admin/courts/edit/:id",
  element: <PrivateRoute><AdminRoute><EditCourt /></AdminRoute></PrivateRoute>, // or your auth wrapper
},
      {
        path: "admin/confirmed",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ConfirmedBookingsAdmin />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/coupons",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageCoupons />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "admin/announcements",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageAnnouncements />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/admin/announcements/edit/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <EditAnnouncement></EditAnnouncement>
            </AdminRoute>
          </PrivateRoute>
        ),
      },
  {
    path: "member/profile",
    element: (
      <PrivateRoute>
        <MemberRoute>
          <MemberProfile />
        </MemberRoute>
      </PrivateRoute>
    ),
  },
 { path: "member/pending", 
  element:(
    <PrivateRoute>
      <MemberRoute>
 <MemberPendingBookings />
      </MemberRoute>
    </PrivateRoute>
  ) },
  {
    path: "member/approved",
    element:(
    <PrivateRoute>
      <MemberRoute>
 <ApprovedBookings /> 
      </MemberRoute>
    </PrivateRoute>
  )
  },
    {
    path: "member/confirmed",
    element:(
    <PrivateRoute>
      <MemberRoute>
<ConfirmedBookings />
      </MemberRoute>
    </PrivateRoute>
  )
  },
    {
    path: "member/payment/:id",
    element:(
    <PrivateRoute>
      <MemberRoute>
 <PaymentPage />
      </MemberRoute>
    </PrivateRoute>
  )
  },
     {
    path: "member/history",
    element:(
    <PrivateRoute>
      <MemberRoute>
 <PaymentHistory />
      </MemberRoute>
    </PrivateRoute>
  )
  },
       {
    path: "member/announcements",
    element:(
    <PrivateRoute>
      <MemberRoute>
 <MemberAnnouncements />
      </MemberRoute>
    </PrivateRoute>
  )
  },


    ],
  },
  // 🔶 Member Dashboard Separate Layout




  //   children: [
    
  //    ,
  //     { path: "approved", element: },
  //     { path: "confirmed", element:  },
  //     { path: "payment/:id", element: },
  //     { path: "history", element: },
  //     { path: "announcements", element: },
  //   ],
  // },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
