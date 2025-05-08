import React from "react";
import "./loader.css";

export default function Loader() {
  return (
    <div className=" bg-dark">
      <div className=" data-loader  ">
        <h1 className="font-sans text-2xl font-bold tracking-tight text-white">please wait..</h1>

        <div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}
