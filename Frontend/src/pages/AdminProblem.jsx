
import React, { useEffect, useState } from 'react';
import {
  Plus, Edit, Menu, Code,
  Trash2, BookMarkedIcon,
  Moon, Sun, Home, Puzzle,
  RefreshCw, Zap,
  PanelRightClose,
  PanelRightOpen,
  Video, Palette, LogOut,
  Check, User, Settings
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router';
import { useSelector, useDispatch } from "react-redux";
import { toast, Toaster } from 'react-hot-toast';
import { logoutUser, clearLoginSuccess, themeChanger } from '../authSlice';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import AdminProblemOptions from './AdminProblemOptions';
import axiosClient from '../utils/axiosClient';










function AdminProblem() {

  const { user, theme } = useSelector(state => state.auth);




  return (
    <div className={`${theme == 'dark' ? 'bg-black' : 'bg-white'}`}>
      <AdminHeader openTab={`Problem's`} />

      <div className='flex  '>
        <AdminSidebar />




        <AdminProblemOptions/>


      </div>
    </div>
  )

}

export default AdminProblem;