import dayjs from "dayjs";
import Link from "next/link";
import React from 'react'
import Image from 'next/image';


const Footer = () => {
  return (
    <footer>
      <div
        className="w-full cursor-pointer bg-primary py-3.5 text-center text-xs font-medium text-white transition-opacity hover:bg-opacity-90 md:text-sm"
        onClick={() => window.scrollTo(0, 0)}
      >
        Back to top
      </div>


      <footer className=" shadow dark:bg-gray-900">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <Link href="/app" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <Image
                src="/logo/png/logo-no-background-mang.png"
                alt="Mangalam Marketing logo"
                width={80} height={35}
                className="h-auto w-[105px] " />
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-primary dark:text-white">Mangalam Marketing</span>
            </Link>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">About</Link>
              </li>
              <li>
                <Link href="/app/privacy" className="hover:underline me-4 md:me-6">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:underline me-4 md:me-6">Licensing</Link>
              </li>
              <li>
                <Link href="/app/contactus" className="hover:underline">Contact Us</Link>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">Copyright &#169; {dayjs().format("YYYY")} <Link href="https://flowbite.com/" className="hover:underline">Mangalam Marketing</Link>. All Rights Reserved.</span>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
