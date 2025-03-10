"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { userDetails } from "../action/userDetails";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface User {
  picture: string;
  given_name: string;
  family_name: string;
  email: string;
}

function Header() {
  const { isAuthenticated } = useKindeBrowserClient();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    userDetails()
      .then((res: any) => {
        setUser(res);
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser(null);
      });
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = () => {
    setIsMenuOpen(false);
    setIsDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="fixed w-full z-[999] top-0 left-0">
      <div className="bg-[#15132a]/40 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto pr-6">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/nexmeet.png"
                width={150}
                height={40}
                alt="NexMeet Logo"
                className="h-10 w-auto transition-transform duration-300 hover:scale-105"
              />
            </Link>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white bg-purple-900/30 rounded-md p-2 hover:bg-purple-800/40 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {renderNavItems()}
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[1000] bg-[#15132A]/80 backdrop-blur-xl flex flex-col justify-center items-center">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-purple-900/30 hover:bg-purple-800/40 transition-colors"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col items-center justify-center space-y-6 w-full px-6">
            {renderNavItems()}
            <div className="pt-6 w-full flex flex-col space-y-4 items-center">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderNavItems() {
    const navItems = [
      { href: "/", label: "Home" },
      { href: "/explore-events", label: "Explore Events" },
      {
        href: "/explore-community",
        label: "Explore Community",
        requiresAuth: true,
      },
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/contributors", label: "Contributors" },
    ];

    return (
      <div
        className={`${isMenuOpen ? "flex flex-col space-y-6 items-center" : "flex space-x-8"}`}
      >
        {navItems.map(({ href, label, requiresAuth }) => {
          if (requiresAuth && !isAuthenticated) return null;

          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavigation}
              className={`text-lg transition-all duration-300 ${
                isActive
                  ? "text-white font-semibold text-[16px]"
                  : "text-gray-300 hover:text-white text-[16px]"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    );
  }

  function renderAuthButtons() {
    if (isAuthenticated) {
      return (
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center group">
            <div className="relative">
              <Image
                src={user?.picture || "/profile.jpg"}
                alt="Profile"
                width={56}
                height={56}
                className="rounded-full size-10 shadow-md transition-all duration-300 group-hover:shadow-purple-400/50"
              />
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full ${isDropdownVisible ? "animate-pulse" : ""}`}
              ></div>
            </div>
          </button>

          {isDropdownVisible && (
            <div className="absolute right-0 mt-2 w-64 bg-[#15132A]/90 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden origin-top-right animate-scaleIn">
              <div className="p-4">
                <div className="flex items-center space-x-3">
                  <Image
                    src={user?.picture || "/profile.jpg"}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="rounded-full size-12"
                  />
                  <div>
                    <p className="font-semibold text-white">
                      {user?.given_name} {user?.family_name}
                    </p>
                    <p className="text-xs text-gray-300 truncate max-w-[160px]">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <Link
                  href="/dashboard"
                  onClick={handleNavigation}
                  className="block px-4 py-3 text-gray-200 hover:bg-purple-800/30 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </div>
                </Link>
                <LogoutLink
                  className="block w-full text-left px-4 py-3 text-gray-200 hover:bg-purple-800/30 transition-colors duration-200"
                  postLogoutRedirectURL="/"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Log out
                  </div>
                </LogoutLink>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`${isMenuOpen ? "flex flex-col w-full space-y-4 items-center" : "flex space-x-4"}`}
      >
        <LoginLink
          postLoginRedirectURL="/dashboard"
          className="px-5 py-2 text-gray-200 bg-purple-800/20 backdrop-blur-md rounded-lg hover:bg-purple-800/30 transition-all duration-300 text-center whitespace-nowrap text-[16px]"
        >
          Sign in
        </LoginLink>
        <RegisterLink
          postLoginRedirectURL="/dashboard"
          className="px-5 py-2 bg-purple-600/80 backdrop-blur-md text-white rounded-lg hover:bg-purple-700/90 transition-all duration-300 shadow-md hover:shadow-lg text-center whitespace-nowrap text-[16px"
        >
          Sign up
        </RegisterLink>
      </div>
    );
  }
}

export default Header;
