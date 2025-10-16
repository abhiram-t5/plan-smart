"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignInButton, useUser } from "@clerk/nextjs";

const menuOptions = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Pricing",
    path: "/pricing",
  },
  {
    name: "Contact Us",
    path: "/contact-us",
  },
];

function Header() {
  const { user } = useUser();
  return (
    <div className="flex justify-between items-center p-4">
      {/* Logo */}
      <div className="flex gap-2 items-center">
        <Image
          src={"/logo.svg"}
          alt="logo"
          width={30}
          height={30}
          className="h-auto"
        />
        <h2 className="font-bold text-2xl">PlanSmart</h2>
      </div>
      {/*Menu Options*/}
      <div className="flex gap-8 items-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="text-lg hover:scale-105 transition-all hover:text-primary">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      {/* 👤 User Actions */}
      <div className="flex items-center gap-3">
        {!user ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : (
          <>
            <Link href={"/create-new-trip"}>
              <Button>Create New Trip</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
