"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTripDetail } from "../provider";



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
	  //@ts-ignore
	const { tripDetailInfo, setTripDetailInfo } = useTripDetail();
	const path = usePathname();
	const { user } = useUser();
	const router = useRouter();
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={`sticky top-0 z-50 p-4 flex justify-between items-center border-b-[1px] transition-colors duration-500 ease-in-out ${
				isScrolled ? "bg-[#F2E6FF] shadow-sm" : "bg-white"
			}`}
		>
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
				{user && (
					<Link href={"/my-trips"}>
						<h2 className="text-lg hover:scale-105 transition-all hover:text-primary">
							My Trips
						</h2>
					</Link>
				)}
			</div>
			<div className="flex gap-5 items-center">
        {!user ? (
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        ) : path == "/create-new-trip" ? (
          <Link href={"/my-trips"}>
            <Button>My Trips</Button>
          </Link>
        ) : (
          <Link href={"/create-new-trip"}>
            <Button onClick={() => setTripDetailInfo(null)}>
              Create New trip
            </Button>
          </Link>
        )}
        <UserButton />
      </div>
		</div>
	);
}

export default Header;
