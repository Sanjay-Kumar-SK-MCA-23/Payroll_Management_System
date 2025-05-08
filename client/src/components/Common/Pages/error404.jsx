import { getToken } from "../../utils/decryptToken";


export const ErrorPage = () => {
  return (
    <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div className="relative">
          <div className="absolute">
            <div className="">
              <h1 className="my-2 text-gray-800 font-bold text-2xl">
                Looks like you've found the doorway to the great nothing
              </h1>
              {getToken !== null && getToken !== undefined ? (
                <p className="my-2 text-gray-800">
                  Sorry about that! Please visit dashboard to get where you need to go.
                </p>
              ) : (
                <p className="my-2 text-gray-800">
                  Sorry about that! Please visit our hompage to get where you need to go.
                </p>
              )}
              <button
                className="text-white bg-gradient-to-r ml-4 from-dark via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                Take me there!
              </button>
            </div>
          </div>
          <div>
            <img src="https://i.ibb.co/G9DC8S0/404-2.png" alt="404" />
          </div>
        </div>
      </div>
      <div>
        <img src="https://i.ibb.co/ck1SGFJ/Group.png" alt="404" />
      </div>
    </div>
  );
};
