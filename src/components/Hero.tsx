"use client";
import React from "react";
import CountUp from "react-countup";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import reviews from "../data/reviews.json";
import data from "../data/community.json";
import FeatureCards from "./FeatureCards";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import axios from "axios";
import Faq1 from "./faq";
import { motion } from "framer-motion";
import { Highlight, HeroHighlight } from "@/components/ui/hero-highlight";
import GradientText from "./ui/gradienttext";
import GrindMotion from "./GrindMotion";

const Hero: React.FC = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  const [currentReview, setCurrentReview] = useState(0);

  const [isStarred, setIsStarred] = useState(false);

  const [repoData, setRepoData] = useState({ stars: 0, forks: 0 });

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const { data: repoData } = await axios.get(
          "https://api.github.com/repos/TejasNasre/nexmeet"
        );
        setRepoData({
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
        });
      } catch (error) {
        console.error("Error fetching contributors data:", error);
      }
    };

    fetchContributors();
  }, []);

  return (
    <>
      <div className="h-full w-full bg-[#15132A] text-white pt-10">
        <HeroHighlight>
          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
          >
            <div className="flex flex-col justify-center items-center gap-8">
              <h1 className="text-3xl text-[#f6edff] md:text-6xl">
                What&apos;s cooler than Networking ?
              </h1>
              <Highlight className="text-[#f6edff]">Nothing dude.</Highlight>
              <div className="flex flex-row justify-center items-center gap-10">
                <Link href="/explore-events">
                  <GradientText
                    colors={[
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                    ]}
                    animationSpeed={3}
                    showBorder={true}
                    className="custom-class p-2 text-sm"
                  >
                    Explore Events
                  </GradientText>
                </Link>

                {isAuthenticated ? (
                  <Link href="/dashboard">
                    <GradientText
                      colors={[
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                      ]}
                      animationSpeed={3}
                      showBorder={true}
                      className="custom-class p-2 text-sm"
                    >
                      Dashboard
                    </GradientText>
                  </Link>
                ) : (
                  <RegisterLink>
                    <GradientText
                      colors={[
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                        "#4079ff",
                        "#40ffaa",
                      ]}
                      animationSpeed={3}
                      showBorder={true}
                      className="custom-class p-2 text-sm"
                    >
                      Register
                    </GradientText>
                  </RegisterLink>
                )}
              </div>
              <div className="text-center">
                <span className="text-lg text-[#bab1c8]">
                  ⭐ Stars: {repoData.stars}
                </span>
              </div>
            </div>
          </motion.h1>
        </HeroHighlight>

        {/* Feature cards section */}
        <div className="flex flex-col items-center justify-center w-full h-screen bg-[#15132A] sm:flex sm:flex-row">
          <FeatureCards />
        </div>

        <div className="py-20 flex flex-col antialiased bg-[#15132A] items-center gap-10 justify-center relative overflow-hidden">
          <h1 className="m-10 text-center text-4xl">
            Nexmeet Community Partner
          </h1>
          <InfiniteMovingCards items={data} direction="right" speed="slow" />
        </div>

        <div>
          <GrindMotion />
        </div>

        <div className="w-auto bg-[#15132A] py-20 px-4">
          <h1 className="text-center text-4xl mb-10 text-white">
            Community Reviews
          </h1>
          <div className="relative max-w-3xl mx-auto px-4">
            <div
              className="overflow-hidden"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentReview * 100}%)` }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="w-full flex-shrink-0 snap-center px-4 text-center"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <p className="text-2xl sm:text-3xl md:text-4xl text-white mb-6">
                      &quot;{review.text}&quot;
                    </p>
                    <p className="text-lg sm:text-xl text-gray-400">
                      - {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
              aria-label="Previous review"
            >
              <IoChevronBackOutline className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/10 p-2 rounded-full"
              aria-label="Next review"
            >
              <IoChevronForwardOutline className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        <div className="w-full px-4 py-20 bg-[#15132A]">
          <div className="mx-auto max-w-screen-xl py-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Trusted by Event Organizers and Attendees
              </h2>
              <p className="mt-4 text-white sm:text-xl">
                Discover a world of events with NexMeet! From technical
                workshops to creative meetups, we bring everything to one
                platform. Whether you&apos;re an organizer looking for seamless
                event management or an attendee exploring exciting events near
                you, NexMeet has you covered.
              </p>
            </div>

            <div className="mg-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2  sm:divide-y-0 lg:grid-cols-3">
              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Users
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp
                    start={0}
                    end={200}
                    duration={10}
                    suffix="+"
                    separator=","
                  />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Official Community Partners
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={3} suffix="+" duration={10} />
                </dd>
              </div>

              <div className="flex flex-col px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-white">
                  Total Event Organised
                </dt>
                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">
                  <CountUp start={0} end={1} duration={10} suffix="+" />
                </dd>
              </div>
            </div>
          </div>
        </div>
        <Faq1 />
      </div>
    </>
  );
};

export default Hero;
