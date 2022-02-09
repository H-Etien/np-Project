import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//permet d'avoir un id unique pour chaque post
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const navigate = useNavigate();
  const user = fetchUser();

  // donne l'array length, soit de 0 ou 1, si l'user a aimé ou non le post
  // !1 donne false et !false donne true, donc !!1 donne true
  // !0 donne true et !true donne false, donc !!0 donne false
  let alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  const downloadButtonStyle =
    "bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none";

  const saveButtonStyle =
    "bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none";

  const deleteButtonStyle =
    "bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none";

  const linkStyle =
    "bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md";

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out "
      >
        <img
          className="rounded-lg w-full"
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
        {/* montre le logo download is est hoevered */}
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className={downloadButtonStyle}
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {alreadySaved ? (
                <button type="button" className={saveButtonStyle}>
                  {save?.length} aimé
                </button>
              ) : (
                <button
                  type="button"
                  className={saveButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                >
                  {save?.length} {savingPost ? "" : "like"}
                </button>
              )}
            </div>

            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className={linkStyle}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.slice(8)}
                </a>
              )}

              {/* supprimer un post par l'autheur */}
              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  className={deleteButtonStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Link
        to={`user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center justify-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover "
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize ">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
