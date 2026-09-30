import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout'
import UserLayout from './components/UserLayout'
import { useApp } from './context/AppContext'
import Auth from './pages/Auth'
import Landing from './pages/Landing'
import AdminAnalytics from './pages/admin/Analytics'
import AdminCenters from './pages/admin/Centers'
import AdminComplaints from './pages/admin/Complaints'
import AdminDashboard from './pages/admin/Dashboard'
import AdminNotifications from './pages/admin/Notifications'
import AdminPickups from './pages/admin/Pickups'
import AdminSettings from './pages/admin/Settings'
import AdminUsers from './pages/admin/Users'
import Awareness from './pages/user/Awareness'
import Complaints from './pages/user/Complaints'
import UserDashboard from './pages/user/Dashboard'
import UserNotifications from './pages/user/Notifications'
import PickupRequest from './pages/user/PickupRequest'
import Profile from './pages/user/Profile'
import RecyclingCenters from './pages/user/RecyclingCenters'
import ReportIssue from './pages/user/ReportIssue'

function RequireRole({ role, children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route
          path="/app"
          element={
            <RequireRole role="citizen">
              <UserLayout />
            </RequireRole>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="report" element={<ReportIssue />} />
          <Route path="pickup" element={<PickupRequest />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="awareness" element={<Awareness />} />
          <Route path="centers" element={<RecyclingCenters />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="pickups" element={<AdminPickups />} />
          <Route path="centers" element={<AdminCenters />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
