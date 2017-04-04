import React from 'react'
import { Link } from 'react-router'

export const HomeView = () => (
  <div>
    <h4>Super landing will be here!</h4>
    <h5>But for now we just show main disciplines</h5>
    <div>
      <Link to='/disciplines/dota2'>
        <img
          src='http://static1.gamespot.com/uploads/original/43/434805/3026092-2827525372-dota-.jpg'
          style={{ height: '200px' }} />
        <h4>Dota 2</h4>
      </Link>
      <Link to='/disciplines/cs_go'>
        <img
          src='http://media.steampowered.com/apps/valvestore/images/slider/store_image_02.png'
          style={{ height: '200px' }} />
        <h4>CS:GO</h4>
      </Link>
      <Link to='/disciplines/lol'>
        <img
          src='https://games.openmandriva.org/wp-content/uploads/2015/05/hc6k-Custom.png'
          style={{ height: '200px' }} />
        <h4>LOL</h4>
      </Link>
    </div>
  </div>
)

export default HomeView
