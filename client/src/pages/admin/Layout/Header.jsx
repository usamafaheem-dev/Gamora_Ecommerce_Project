import { Button, Spin } from 'antd'; // Added Spin for loading
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Menu } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data.profile);
        // console.log('Profile data:', response.data.profile); 
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const getDisplayName = () => {
    if (!profile) return 'Admin';
    if (profile.firstName && profile.lastName) return `${profile.firstName} ${profile.lastName}`;
    return profile.name || 'Admin';
  };



  return (
    <div className="flex justify-between md:justify-end items-center h-20 px-8 border-b border-gray-300 bg-white">
      <div className="md:hidden">
        <Button onClick={toggleSidebar} icon={<Menu />} />
      </div>
      {loading ? <Spin /> : (
        <div className="flex items-center gap-2">
          <div className='w-10 h-10'>
            <img
              src={
                profile?.profileImage
                  ? `http://localhost:5000${profile.profileImage}`
                  : 'img'
              }
              alt="Profile"
              className=" object-cover size-full rounded-full"
              onError={() => console.log('Profile image failed to load')}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-medium">
              {getDisplayName()}
            </span>
            <span className="text-[12px] font-medium text-gray-600">
              {profile?.email || 'No email available'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

export default Header;