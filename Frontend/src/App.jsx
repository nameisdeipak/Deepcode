import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DeepcodeLoader from "./components/DeepcodeLoader";
import ProblemSet from "./pages/ProblemSet";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import ProblemPage from "./pages/ProblemPagae"
import CoursesPage from "./pages/CoursePage";
import Admin from "./pages/Admin";
import Explore from "./pages/Explore";
import Contest from "./pages/Contest";
import Discuss from "./pages/Discuss";
import ManageDiscussPage from './pages/ManageDiscussPage ';
import CourseDetail from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import ChangePassword from "./components/ChangePassword";
import UserProfile from "./pages/UserProfile";
import ProblemList from "./pages/ProblemList";
import AdminProfile from "./pages/AdminProfile";
import AdminUsers from "./pages/AdminUsers";
import AdminProblem from "./pages/AdminProblem";
import AdminSignup from './pages/AdminSignup'
import ProblemUpdate from "./components/ProblemUpdate";
import AdminProblemVideo from "./components/AdminProblemVideo";
import ProblemCreate from "./components/ProblemCreate";
import AdminCourse from "./pages/AdminCourse";
import CourseCreate from "./components/CourseCreate";
import CourseUpdate from "./components/CourseUpdate";
import CourseDetailView from "./components/CourseDetailView";
import LandingPage from "./pages/LandingPage";





function App() {

  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, theme } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const themeClasses = {
    bg: theme === 'dark' ? 'bg-black' : 'bg-white',
    text: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
  }

  if (loading) {
    return (
      <DeepcodeLoader/>
    );
  }


  return (
    <>
      <Routes>
        {/* Before the login and signup route  */}
        <Route path="/" element={isAuthenticated ? <Explore /> : <LandingPage />} />

        {/* Login and Signup routes  */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

        <Route path="/problemset" element={isAuthenticated ? <ProblemSet /> : <Navigate to="/login" />} />
        <Route path="/contest" element={isAuthenticated ? <Contest /> : <Navigate to="/login" />} />
        <Route path="/discuss" element={isAuthenticated ? <Discuss /> : <Navigate to="/login" />} />
        <Route path="/course" element={isAuthenticated ? <CoursesPage /> : <Navigate to="/login" />} />
       

        {/* Admin routes  */}
        <Route path="/admin-panel" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/admin-Profile" element={isAuthenticated && user?.role === 'admin' ? <AdminProfile /> : <Navigate to="/login" />} />
        <Route path="/admin/all-users" element={isAuthenticated && user?.role === 'admin' ? <AdminUsers /> : <Navigate to="/login" />} />
        <Route path="/admin/signup" element={isAuthenticated && user?.role === 'admin' ? <AdminSignup /> : <Navigate to="/login" />} />
        <Route path="/admin/all-problems" element={isAuthenticated && user?.role === 'admin' ? <AdminProblem /> : <Navigate to="/login" />} />
        <Route path="/admin/all-courses" element={isAuthenticated && user?.role === 'admin' ? <AdminCourse /> : <Navigate to="/login" />} />
        <Route path="/admin/all-problem/vidoes" element={isAuthenticated && user?.role === 'admin' ? <AdminProblemVideo /> : <Navigate to="/login" />} />
        <Route path="/admin/problem/create" element={isAuthenticated && user?.role === 'admin' ? <ProblemCreate /> : <Navigate to="/login" />} />
        <Route path="/admin/update-problem/:problemId" element={isAuthenticated && user?.role === 'admin' ? <ProblemUpdate /> : <Navigate to="/login" />} />
        <Route path="/admin/course/create" element={isAuthenticated && user?.role === 'admin' ? <CourseCreate /> : <Navigate to="/login" />} />
        <Route path="/admin/update-course/:courseId" element={isAuthenticated && user?.role === 'admin' ? <CourseUpdate /> : <Navigate to="/login" />} />
        <Route path="/admin/cousre/details/:courseId" element={isAuthenticated && user?.role === 'admin' ? <CourseDetailView /> : <Navigate to="/login" />} />

        {/* user routes  */}
        <Route path={`/u/${user?.userName}/`} element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path="/problem/:problemId" element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
        <Route path="/problem-list/:tags/" element={isAuthenticated ? <ProblemList /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/profile/account/changePassword" element={isAuthenticated ? <ChangePassword /> : <Navigate to="/login" />} />
        <Route path="/course/details/:courseId" element={isAuthenticated ? <CourseDetail /> : <Navigate to="/login" />} />
        <Route path="/manage-discuss"  element={isAuthenticated ? <ManageDiscussPage  /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App;