import { Button, Drawer } from 'antd';
import axios from 'axios';
import { Shirt } from 'lucide-react';
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Sidebar = ({ isSidebarVisible, toggleSidebar }) => {
    const navigate = useNavigate();

    const navTabs = [
        { path: '/admin', label: 'Dashboard', icon: 'pajamas:dashboard' },
        { path: '/admin/men', label: 'Men', icon: 'icon-park-outline:men-jacket' },
        { path: '/admin/women', label: 'Women', icon: 'icon-park-outline:women' },
        { path: '/admin/kids', label: 'Kids', icon: 'hugeicons:kid' },
        { path: '/admin/manage-orders', label: 'Orders', icon: 'fluent:shopping-bag-16-regular' },
        { path: '/admin/profile', label: 'Profile', icon: 'carbon:user-profile' },
        { path: '/admin/notifications', label: 'Notifications', icon: 'carbon:notification' },
        { path: '/admin/reviews', label: 'Reviews', icon: 'solar:star-outline' },
        { path: '/admin/wallet', label: 'Wallet', icon: "uil:wallet" },
        { path: '/', label: 'Go to User Side', icon: "mdi:home-outline" },


    ];

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            localStorage.removeItem('token');
            toast.success('Logged out successfully');
            navigate('/auth/login');
        } catch (error) {
            toast.error('Error during logout');
            console.log(error);
        }
    };

    const sidebarContent = (
        <div>
            <div className="md:flex hidden items-center justify-center">
                <Link to='' className="w-[160px] h-14">
                    <img src="/assets/glamLogo.png" alt="header logo" className='size-full' />
                </Link>
            </div>
                <div className="md:hidden flex  items-center justify-center">
                    <div className="flex gap-1 items-center">
                        <Shirt />
                        <span className=' text-2xl font-bold '>Glamora</span>
                    </div>
                </div>

            {/* --------nav links--------- */}
            <div className="flex gap-3  md:sidebar-scroll my-6 nav-tab mx-3 flex-col">
                {navTabs.map((tab, index) => (
                    <NavLink
                        key={index}
                        end={tab.path === '/admin'}
                        to={tab.path}
                        className="py-2 px-4 bg-white flex items-center justify-between rounded-full shadow-md"
                        onClick={toggleSidebar}
                    >
                        <span className='text-[14px] font-medium'>{tab.label}</span>
                        <iconify-icon icon={tab.icon} className='text-2xl'></iconify-icon>
                    </NavLink>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div className="md:flex hidden flex-col w-[200px] py-4 justify-between bg-[#0f172a] min-h-screen">
                {sidebarContent}
                <div className="flex mx-6 flex-col">
                    <Button
                        className="!bg-red-700 px-4 py-5 !rounded-[24px] hover:!bg-red-600 border-none !text-white cursor-pointer"
                        onClick={handleLogout}
                    >
                        <iconify-icon icon="line-md:logout" className="text-2xl"></iconify-icon>
                        <span className="ml-1 font-bold">Log out</span>
                    </Button>
                </div>
            </div>
            <Drawer
                placement="left"
                onClose={toggleSidebar}
                open={isSidebarVisible}
                className="md:hidden"
                width={250}
            >
                <div className="flex flex-col justify-between h-full md:bg-[#0f172a] p-4">
                    {sidebarContent}
                    <div className="flex flex-col">
                        <Button
                            className="!bg-red-700 px-4 py-5 !rounded-[24px] hover:!bg-red-600 border-none !text-white cursor-pointer"
                            onClick={handleLogout}
                        >
                            <iconify-icon icon="line-md:logout" className="text-2xl"></iconify-icon>
                            <span className="ml-1 font-bold">Log out</span>
                        </Button>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default Sidebar;