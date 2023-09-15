import React from 'react'
import Navbar from './Navbar';
import Search from './Search';
import SideChats from './SideChats';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Navbar/>
      <Search/>
      <SideChats/>
    </div>
  )
}

export default Sidebar