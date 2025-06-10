import React from 'react';
import bell_notification from "../assets/5925587_alert_bell_notification_icon 1 (1).png";
import profile from "../assets/businessman.png";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import logo from "../assets/Axoma-logo.svg"

export default function Navbar() {
  return (
    <div className="grid grid-cols-[1.3fr_4fr_1.3fr] ">
      {/* Left Section */}
      <div className="">
        <span className="">
          <img src={logo} alt="" className='w-40 ml-5' />
        </span>
      </div>

      {/* Center Section */}
      <div className=" p-2  text-center">
        {/* <span className="text-lg font-bold">Dashboard</span> */}
      </div>

      {/* Right Section with Nested Grid */}
      <div className="mt-auto mb-auto">
        <div className="grid grid-cols-[1fr_5fr] items-center  p-2 ">
          
          {/* Notification Bell */}
          <div className="flex ">
            <img src={bell_notification} alt="Notification" className="w-[30px] h-[30px]" />
          </div>
          

          {/* Profile Info */}
          <div className="flex gap-2 items-center">
            <img src={profile} alt="Profile" className="w-[40px] h-[40px] rounded-full object-cover border border-gray-300" />
            <div className="max-w-[100px] overflow-hidden">
            <h4 className="text-sm font-medium truncate">Steve R</h4>
            <h6 className="text-xs text-gray-500 truncate">Tenant.x</h6>
          </div>
          <KeyboardArrowDownIcon className="text-gray-600" />
        </div>
      </div>
      </div>
    </div>
  );
}
