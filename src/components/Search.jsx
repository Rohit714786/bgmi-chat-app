import React from 'react'

const Search = () => {
  return (
    <div className='search'>
      <div className='searchForm'>
        <input type='text' placeholder='find user' />
      </div>
      <div className='userChat'>
        <img src='https://tse3.mm.bing.net/th?id=OIP.mvPLLRgYSrxg5XRLE9sUrAHaL8&pid=Api&P=0&h=180' alt=''/>
        <div className="userChatInfo">
          <span>Jane</span>
        </div>
      </div>
      
    </div>
  )
}

export default Search
