"use client";
import Link from "next/link";
import Header from "./components/Header";
import React, { Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Button from "./components/Button";
import dynamic from "next/dynamic";

/* Preloader Component Imported */
const Preloader = dynamic(() => import("./components/Preloader"), {
  ssr: false,
});

export default function Home(): JSX.Element {
  const beginRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(true);

  /* Showing Behavior */
  useEffect(() => {
    const preloaderShow = sessionStorage.getItem("preloaderShown");
    if (!preloaderShow) {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("preloaderShown", "true");
      }, 7000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, []);

  /* Page Animations */
  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        ".index__title--wrapper",
        { y: 200 },
        { y: 0, duration: 1.5, ease: "power4.out" }
      );
      gsap.fromTo(
        ".image__content",
        { opacity: 0, delay: 0.2 },
        { opacity: 1, delay: 0.2 }
      );
      gsap.fromTo(
        ".btn__wrapper",
        { x: -20, opacity: 0, ease: "power2.out" },
        { x: 0, opacity: 1 }
      );
      gsap.fromTo(
        ".dotted__square--link-wrapper",
        { x: 50, opacity: 0, ease: "power2.out" },
        { x: 20, opacity: 1 }
      );
      gsap.fromTo("#square-right, #square-left", { opacity: 0 }, { opacity: 1, duration: 1 });
      gsap.fromTo(
        ".experience__btn--wrapper",
        { opacity: 0 },
        { opacity: 1, delay: 0.5 }
      );
    }
  }, [loading]);

  /* Animations In on Hover Btn */
  function handleAnimationsIn() {
    const titleElement = document.querySelector(".index__title--wrapper");
    if (titleElement) {
      const titleRect = titleElement.getBoundingClientRect();
      const translateX = titleRect.left * 0.95;
      beginRef.current?.classList.add("begin__btn");

      gsap.to(".index__title--wrapper", {
        x: -translateX,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.to(".bottom__title", {
        x: "-30%",
        ease: "power2.out",
        duration: 1,
      });

      gsap.to(".index__left--link-wrapper", {
        x: "-100vw",
        ease: "power2.out",
      });
    }
  }

  /* Animations Out on Hover Btn */
  function handleAnimationsOut() {
    beginRef.current?.classList.remove("begin__btn");
    gsap.to(".index__title--wrapper", {
      x: 0,
      duration: 0.7,
    });

    gsap.to(".bottom__title", {
      x: "0%",
      ease: "power2.out",
      duration: 1,
    });

    gsap.to(".index__left--link-wrapper", {
      x: "0",
      ease: "power2.out",
    });
  }

  /* loading = Preloader | !loading = <div id="__next">... */
  if (loading) {
    return (
      <Suspense fallback={<div></div>}>
        <Preloader />
      </Suspense>
    );
  }
  return (
    <>
      <div id="__next">
        <Header btnOn={true} />
        <main className="main">
          <div className="page">
            <div className="index__content">
              <div className="index__title--container">
                <div className="index__title--wrapper">
                  <h1 className="index__title">
                    <span>Sophisticated</span>
                    <br />
                    <span className="bottom__title">Skincare</span>
                  </h1>
                </div>
                <div className="experience__btn--wrapper">
                  <Link href="/introduction">
                    <Button
                      label="ENTER EXPERIENCE"
                      arrow="right"
                      order="label-first"
                      main={true}
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="index__left--link-wrapper">
              <span id="square-left" className="dotted__square"></span>
              <div className="dotted__square--link-wrapper">
                <button disabled>
                  <span className="btn__icon">
                    <span className="btn__icon--inner">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 11 12"
                        fill="#1A1B1C"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        className="svg__btn"
                      >
                        <path
                          d="m.714 6 9.429 5.444V.556L.714 6Z"
                          fill="current"
                        ></path>
                      </svg>
                    </span>
                  </span>
                  <span className="icon__btn--text font-roobert">
                    CLINICAL RESEARCH
                  </span>
                </button>
              </div>
            </div>
            <div className="index__right--link-wrapper">
              <span id="square-right" className="dotted__square"></span>
              <div className="dotted__square--link-wrapper2">
                <Link
                  onMouseEnter={handleAnimationsIn}
                  onMouseLeave={handleAnimationsOut}
                  href="/introduction"
                  className="dotted__square--link"
                >
                  <Button label="LET'S BEGIN" arrow="right" order="label-first" />
                </Link>
              </div>
            </div>
            <div className="bottom__grid--container">
              <p className="bottom__text font-roobert">
                Premium Custom Skincare For
                <br />
                Faces With Sophisticated Needs
              </p>

              <p className="bottom__text opacity-[0.7]">
                Proprietary Algorithms For
                <br />
                Effective Formula Design
              </p>

              <p className="bottom__text opacity-[0.7]">
                Complete Control over
                <br />
                Skincare ingredients
              </p>
              <p className="bottom__text opacity-[0.7]">
                Expert clinical
                <br />
                diagnostics + guidance
              </p>
              <p className="bottom__text opacity-[0.7]">
                Fully Customizable
                <br />
                from Scratch
              </p>
              <p className="bottom__text opacity-[0.7]">
                FDA / TGA Approved
                <br />
                Compound Pharmacies
              </p>
              <p className="bottom__text opacity-[0.7]">
                Highly Personalized
                <br />
                Experience
              </p>
            </div>
          </div>
          <div className="background__overlay">
            <div className="background__wrapper">
              <video
                className="video__content"
                preload="auto"
                muted
                autoPlay
                loop
              >
                <source src="bubble-animation.mp4" type="video/mp4" />
              </video>
              <img className="image__content opacity-0" alt="bubble-bg" src="bubble-bg.avif" />
            </div>
          </div>
          <div className="glassy__container"></div>
        </main>
      </div>
    </>
  );
}