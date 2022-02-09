import React, { useState, useRef, useEffect } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import { client } from "../client";
import logo from "../assets/logo-rogned.png";
import Pins from "./Pins";

import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const userInfo = fetchUser();

  useEffect(() => {
    //fetch google userID
    const query = userQuery(userInfo?.googleId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, []);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
      <div className="hidden sm:flex h-screen flex-initial">
        {/* //mobile Sidebar */}
        <Sidebar user={user && user} />
      </div>

      <div className="flex sm:hidden flex-row">
        {/* partie haute avec pin, user logo et logo memory lane */}
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />

          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?.id}`}>
            <img src={user?.image} alt="logo" className="w-28" />
          </Link>
        </div>

        {/* ouverture de la sidebar */}
        {toggleSidebar && (
          <div className="fixed x-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flew justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>

            {/* desktop sidebar */}
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userId" element={<UserProfile />}></Route>
          <Route path="/*" element={<Pins user={user && user} />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Home;
