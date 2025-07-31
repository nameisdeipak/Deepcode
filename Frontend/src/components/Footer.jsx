// src/components/Footer.jsx

import React from 'react';
import { NavLink } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

import { Blocks, LucideInstagram, Github, LinkedinIcon, TwitterIcon, Twitter, Instagram } from 'lucide-react';



const IndiaFlagIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
    >
        <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
        <path fill="#ff9811" d="M256 0c-57.348 0-110.219 19.899-151.791 53.868h303.582C366.219 19.899 313.348 0 256 0z" />
        <path fill="#6da544" d="M256 512c57.348 0 110.219-19.899 151.791-53.868H104.209C145.781 492.101 198.652 512 256 512z" />
        <path fill="#0052b4" d="M256 296.059c-22.11 0-40.059-17.949-40.059-40.059s17.949-40.059 40.059-40.059 40.059 17.949 40.059 40.059-17.949 40.059-40.059 40.059zm0-64.118c-13.266 0-24.059 10.793-24.059 24.059s10.793 24.059 24.059 24.059 24.059-10.793 24.059-24.059-10.794-24.059-24.059-24.059z" />
        <g fill="#0052b4">
            <path d="m256 223.971 1.414 4.348-4.133-2.679h5.132l-4.133 2.679z" />
            <path d="m278.029 256-4.348 1.414 2.679-4.133v5.132l-2.679-4.133zM256 288.029l-1.414-4.348 4.133 2.679h-5.132l4.133-2.679zM233.971 256l4.348-1.414-2.679 4.133v-5.132l2.679 4.133z" />
            <path d="m268.044 230.559 3.061 3.536-4.572-.256.911 4.49-3.902-2.253z" />
            <path d="m271.441 243.956 3.536-3.061-.256 4.572 4.49-.911-2.253 3.902zM268.044 281.441l3.061-3.536 4.572.256-.911-4.49 3.902 2.253zM252.044 274.853l-3.536 3.061.256-4.572-4.49.911 2.253-3.902zM243.956 237.147l-3.061 3.536.256 4.572-4.49-.911 2.253 3.902zM230.559 243.956l-3.536-3.061 4.572-.256-3.902-2.253.911 4.49zM237.147 268.044l-3.061-3.536-4.572.256 3.902 2.253-.911-4.49zM243.956 281.441l3.536 3.061-.256-4.572 4.49.911-2.253-3.902z" />
        </g>
    </svg>
);


const Footer = () => {
    const { theme } = useSelector((state) => state.auth);


    const themeClasses = {
        border: theme === 'dark' ? 'border-gray-300/30' : 'border-gray-200',
        textPrimary: theme === 'dark' ? 'text-gray-100' : 'text-gray-900',
        textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-200',
        hoverBg: theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200',
    };

    return (

        <footer className={`  max-w-7xl border  ${themeClasses.border} mx-auto rounded   p-10 pb-6`}>
            <div className='footer footer-vertical  sm:footer-horizontal   '>
                <nav className='w-auto max-w-85'>
                    <a className="text-2xl font-bold text-glitch-hover" data-text="DeepCode">
                        DeepCode
                    </a>
                    <p>The lookable and  most problem solving platform . here you explore problem and improve your coding and logic building thinking</p>
                    <span className='text-sm text-gray-400'>Developed By  <br/>
                        <span className={` ${themeClasses.textPrimary} text-sm capitalize`}> Deepak patidar</span>
                    </span>
                </nav>
                <nav >
                    <h6 className="footer-title">Services</h6>
                    <NavLink to={'/problemset'} className="link link-hover">Problem</NavLink>
                    <NavLink to={'/contest'} className="link link-hover">Contest</NavLink>
                    <NavLink to={'/course'} className="link link-hover">Course</NavLink>
                    <NavLink to={'/discuss'} className="link link-hover">Discuss</NavLink>
                </nav>

                <nav>
                    <h6 className="footer-title">Social</h6>

                        <a href='https://github.com/nameisdeipak'  className=' flex justify-center items-center gap-2 link link-hover'>  <Github size={18} /> Github</a>
                        <a href='https://x.com/NameisDeipak?t=Qr5ewkxRR0ixrCFIfA6JRw&s=09' className=' flex justify-center items-center gap-2 link link-hover'>  <Twitter size={18} /> X.com</a>
                        <a href='https://www.linkedin.com/in/deepak-patidar-720262319?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' className=' flex justify-center items-center gap-2 link link-hover'><LinkedinIcon size={18} /> Linkedin</a>

                </nav>
                <nav>
           
                    <p className='  footer-title'>Made in Bharat </p>
                    <IndiaFlagIcon className={' w-15 h-15 mx-auto'}/>

                </nav>
            </div>

            <div className={`border-t  text-center container  mt-8 pt-4 ${themeClasses.border}`}>
                <p className="text-sm text-gray-500">
                    Copyright © {new Date().getFullYear()} DeepCode. All Rights Reserved.
                </p>
            </div>


       

        </footer>

    );
};

export default Footer;