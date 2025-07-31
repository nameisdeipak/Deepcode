import React, { useState } from 'react';
import { Plus, Edit, Trash2, BookMarkedIcon, Home, RefreshCw, Zap, Video } from 'lucide-react';
import { NavLink } from 'react-router';
import { useSelector } from 'react-redux';
import AdminProblemSet from '../components/AdminProblemSet';

function AdminProblemOptions() {
  const { theme } = useSelector((state) => state.auth)
  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-success',
      bgColor: 'bg-success/10',
      route: '/admin/problem/create'
    },

  ];

  return (
    <>
    
      <div className={`min-h-screen w-full max-w-5xl mx-auto ${theme == 'dark' ? 'text-gray-100 bg-gray-100/0' : 'text-black '}`}>
        <div className=" mx-auto px-2 md:px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className=" text-2xl sm:text-4xl font-bold mb-4">
              Problem Management
            </h1>
            <p className=" text-md sm:text-lg">
              Manage coding problems on your platform
            </p>
          </div>

          {/* Admin Options Grid */}
          <div className="flex justify-center items-center    mx-auto">
            {adminOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  className={`card  h-auto border-1  hover:shadow transition-all duration-300 transform hover:-translate-y-1 
                    ${theme == 'dark' ? 'border-gray-100/20' : 'border-gray-300  '}
                cursor-pointer `}
                >
                  <div className="card-body items-center text-center p-8">
                    {/* Icon */}
                    <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                      <IconComponent size={32} className="" />
                    </div>

                    {/* Title */}
                    <h2 className="card-title text-xl mb-2">
                      {option.title}
                    </h2>

                    {/* Description */}
                    <p className=" mb-6">
                      {option.description}
                    </p>

                    {/* Action Button */}
                    <div className="card-actions">
                      <div className="card-actions">
                        <NavLink
                          to={option.route}
                          className={`btn ${option.color} btn-wide`}
                        >
                          {option.title}
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        <AdminProblemSet />

      </div>
    </>
  );
}

export default AdminProblemOptions;