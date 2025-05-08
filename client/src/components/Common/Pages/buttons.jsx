import React, { useState } from "react";

export const CustomButton = ({ onClick, name, disabled, type = "button", className = "", style, title }) => {
  const opacityClass = disabled
    ? "opacity-70"
    : "opacity-100 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-700 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80";

  const buttonClassName = `inline-flex items-center justify-center h-9 px-3 mr-6 font-medium tracking-wide text-white transition duration-200 rounded bg-gradient-to-r from-black via-gray-800 to-gray-900  ${opacityClass} ${className}`;

  return (
    <button
      style={style}
      onClick={onClick}
      type={type}
      className={buttonClassName}
      disabled={disabled || false}
      title={title}
    >
      {name}
    </button>
  );
};

export const CustomButton1 = ({ onClick, name, disabled, type = "button", className = "", style }) => {
  return (
    <button
      style={style}
      onClick={onClick}
      type={type}
      title="click to change"
      className={className}
      disabled={disabled || false}
    >
      {name}
    </button>
  );
};

export const ShowPopUpButton = ({
  title,
  question,
  yes,
  etcClassName,
  onClick,
  disabled,

  StatusBtn,
  className = "mb-2 md:mb-0 bg-red-500 border border-red-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600",
}) => {
  const [showModal, setShowModal] = React.useState(false);

  const opacityClass = disabled
    ? "opacity-70"
    : "opacity-100 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-700 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80";

  const buttonClassName = `inline-flex items-center justify-center h-9 px-3 mr-6 font-medium tracking-wide text-white transition duration-200 rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-900  ${opacityClass} `;

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleButtonClick = () => {
    toggleModal();
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        title="button"
        className={`${StatusBtn || buttonClassName} ${etcClassName}`}
        disabled={disabled}
      >
        {title}
      </button>

      {showModal && (
        <div
          className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
        >
          <div className="absolute bg-black opacity-80 inset-0 z-0 "></div>
          <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white/90">
            <div className="">
              <div className="text-center p-5 flex-auto justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 -m-1 flex items-center text-red-500 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <h2 className="text-xl font-bold py-4 ">Are you sure?</h2>
                <p className="text-sm text-gray-500 px-8 font-semibold">{question}</p>
              </div>
            </div>
            <div className="p-3 mt-2 text-center space-x-4 md:block">
              <div className="p-3 mt-2 text-center space-x-4 md:block">
                <button
                  onClick={toggleModal}
                  className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 text-gray-800 rounded-full hover:shadow-lg hover:bg-black/10 hover:border-black/30"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClick();
                    toggleModal();
                  }}
                  className={`${className} hover:bg-gradient-to-br hover:shadow-lg hover:border-black/30`}
                >
                  {yes}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ShowPopUpButtonForLeave = ({ title, question, yes, StatusBtn, className, handleSubmit }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleConfirm = () => {
    if (selectedValue && typeof handleSubmit === "function") {
      handleSubmit(selectedValue);

      toggleModal();
    } else {
      console.error("Please select an option or handleSubmit is not a function.");
    }
  };

  return (
    <>
      <button onClick={toggleModal} className={`${StatusBtn} `} title="button">
        {title}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-5 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-xl font-bold py-4">Are you sure?</h2>
              <p className="text-sm text-gray-500 px-8 font-semibold">{question}</p>
              <select
                value={selectedValue}
                onChange={handleChange}
                className="block w-full mt-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an option</option>
                <option value="Rejected">Rejected</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleModal}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button onClick={handleConfirm} className={className}>
                {yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ShowPopUpButtonForLeaveCancel = ({ title, question, yes, StatusBtn, className, handleSubmit }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <button onClick={toggleModal} className={`${StatusBtn} `} title="button">
        {title}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-5 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-xl font-bold py-4">Are you sure?</h2>
              <p className="text-sm text-gray-500 px-8 font-semibold">{question}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleModal}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button onClick={handleSubmit} className={className}>
                {yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ShowPopUpButtonForCheckInAndCheckOut = ({ title, question, yes, StatusBtn, className, handleSubmit }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <button onClick={toggleModal} className={`${StatusBtn} `} title="button">
        {title}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-full max-w-md p-5 rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="text-xl font-bold py-4">Are you sure?</h2>
              <p className="text-sm text-gray-500 px-8 font-semibold">{question}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={toggleModal}
                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  handleSubmit(e);
                  toggleModal();
                }}
                className={className}
              >
                {yes}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
