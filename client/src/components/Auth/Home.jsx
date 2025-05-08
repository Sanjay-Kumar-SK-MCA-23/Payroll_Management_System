import { Navbar } from "../Common/Header/Navbar";
import image_home from "../../images/image_home.png"
export const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className=" bg-dark absolute inset-0 object-cover w-full h-full">
        <div className="container ">
          <div className="-mx-4 flex flex-wrap ">
            <div className="w-full px-4 pt-32 lg:w-5/12 mt-20">
              <div className="hero-content">
                <h1 className="mb-5 text-4xl font-bold !leading-[1.208]  text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                  Elevate Payroll Management for Your Business
                </h1>
                <p className="mb-8 max-w-[800px] text-base  text-dark-6">
                  Welcome to our Employee Payroll Management System, streamlining attendance, leave, and user access.
                  Admins oversee attendance, automate salaries, and secure access. Employees enjoy self-service for
                  leaves and payslips. Experience efficiency and innovation with our User-Centric Design. Optimize
                  operations with the Employee Payroll Management System – where precision meets simplicity.
                </p>
              </div>
            </div>
            <div className="hidden px-4 lg:block lg:w-1/12"></div>
            <div className="w-full px-4 lg:w-6/12">
              <div className="lg:ml-auto lg:text-right">
                <div className="relative z-10 inline-block pt-11 lg:pt-24">
                  <img src={image_home} alt="hero" className="sm:max-w-full lg:ml-auto md:max-w-sm xl:max-w-md" />
                  <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                      <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
