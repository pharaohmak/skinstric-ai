"use client"

import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Link from "next/link";
import gsap from "gsap";
import Button from "../components/Button";
import { useJsApiLoader, Autocomplete} from "@react-google-maps/api";
import Blackbox from "../components/Blackbox";
import { ToastContainer, toast } from "react-toastify";
// @ts-ignore: allow side-effect CSS import without type declarations
import { useRouter } from "next/navigation";

interface LatLng {
  lat: number | null;
  lng: number | null;
}

const Introduction: React.FC = () => {
  const [showLabel, setShowLabel] = useState<boolean>(true);
  const [labelText, setLabelText] = useState<number>(1);
  const [proceed, setProceed] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [latLng, setLatLng] = useState<LatLng>({ lat: null, lng: null });
  const [phase1, setPhase1] = useState<boolean>(true);
  const [, setPhase2] = useState<boolean>(false);
  const [nameLength, setNameLength] = useState<boolean>(false);
  const [locationLength, setLocationLength] = useState<boolean>(false);
  const [bottomText, setBottomText] = useState<string>("");
  const router = useRouter();

  const infoArr = useMemo(
    () => ({
      name: name,
      location: location,
      latLng: latLng,
    }),
    [name, location, latLng]
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const labelRef = useRef<HTMLLabelElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const labelTextRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLAnchorElement | null>(null);
  const proceedRef = useRef<HTMLAnchorElement | null>(null);
  const inputGoogleRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_PLACES_API_KEY!,
    libraries: ["places"],
  });

  const handleBack = () => {
    setPhase1(true);
  };

  const handleProceed = () => {
    setShowLabel(true);
    setPhase2(true);
    setProceed(false);
    setPhase1(false);
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value || "");
    setNameLength(event.target.value.length > 0);
    setProceed(event.target.value.length > 0);
  };

  const handleNameKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!nameLength) {
        return;
      }
      if (inputRef.current) {
        inputRef.current.blur();
      }
      setProceed(true);
      setShowLabel(true);
      setPhase2(true);
      setProceed(false);
      setPhase1(false);
    }
  };

  const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value || "");
    setLocationLength(event.target.value.length > 0);
  };

  const handleLocationKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!locationLength) {
        setBottomText("Type your location above to proceed");
      } else if (locationLength) {
        setBottomText("Type a valid location above to proceed");
        toast.info("Select an approximate region for collecting weather data", {
          position: "top-right",
          className: "toast",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  const handleInputAnimations = (elem: number) => {
    if (elem === 2) {
      setLabelText(2);
      setShowLabel(false);
    } else if (elem === 1) {
      setShowLabel(true);
      setLabelText(1);
    }
  };
  const handlePlaceChanged = () => {
    setBottomText("");
    localStorage.setItem("name", name);
    localStorage.setItem("location", location);
    localStorage.setItem("latLng", JSON.stringify(latLng));


    if (inputGoogleRef.current) {
      const place = inputGoogleRef.current.getPlace();

      if (place && place.geometry && place.geometry.location) {
        setLocation(place.formatted_address ?? ""); // Fallback to an empty string if undefined
        setLatLng({
          lat: place.geometry.location.lat() ?? 0, // Fallback to 0 if undefined
          lng: place.geometry.location.lng() ?? 0, // Fallback to 0 if undefined
        });

        setTimeout(() => {
          gsap.fromTo(
            ".introduction",
            { opacity: 1 },
            { opacity: 0 }
          );
        }, 800);

        setTimeout(() => {
          router.push("/welcome");
        }, 1600);
      }
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { ease: "power4.out", duration: 1 },
    });

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { yPercent: 100, duration: 1, ease: "power4.out" },
        { yPercent: 0, duration: 1, ease: "power4.out" }
      );
    }
    const formItems = [];
    if (formRef.current) {
      formItems.push(formRef.current);
    }
    if (labelTextRef.current) {
      formItems.push(labelTextRef.current);
    }

    if (formItems.length > 0) {
      tl.fromTo(
        formItems,
        { clipPath: "inset(0% 50% 0% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)" },
        0
      );
    }

    if (backRef.current) {
      tl.fromTo(
        backRef.current,
        {
          transform: "translate(20px)",
          opacity: 0,
        },
        { transform: "translate(0px)", opacity: 1 }
      );
    }
  }, []);

  return (
    <div className="flex introduction flex-auto flex-col h-[100vh]">
      <div className="pl-[32px]">
        <Header btnOn={true} />
      </div>
      <main className="relative flex flex-auto flex-col">
        <div className="overflow-clip flex flex-auto flex-col pb-[36px] relative ml-auto mr-auto px-[32px] w-full">
          <div
            style={{
              fontSize: "clamp(10px, -2px + .9375vw, 16px)",
            }}
            className="block overflow-hidden absolute left-[32px] top-[86px]"
          >
            <h1 ref={titleRef} className="font-roobert tracking-[-.03em]">
              TO START ANALYSIS
            </h1>
          </div>
          <div
            style={{ transform: "translate(-50%, -50%) rotate(45deg)" }}
            className="left-[50%] absolute top-[50%] z-[-1] translate"
          >
            <span
              style={{ transform: "rotate(45deg)" }}
              className="w-[23.43vw] dotted__span--square h-[23.43vw] block relative will-change-transform"
            ></span>
          </div>
          <div
            style={{ transform: "translate(-50%, -50%)" }}
            className="flex items-center flex-col justify-center left-[50%] absolute text-center top-[50%]"
          >
            <div
              style={{
                clipPath: "inset(0%)",
                fontSize: "clamp(10px, -6px + 1.5625vw, 14px)",
              }}
              ref={labelTextRef}
              className="bottom-[100%] leading-[1.71] tracking-[0] mb-[2px] opacity-[.4] absolute"
            >
              {labelText === 1
                ? "CLICK TO TYPE"
                : phase1
                  ? "INTRODUCE YOURSELF"
                  : "WHERE ARE YOU FROM?"}
            </div>
            {phase1 ? (
              <form ref={formRef} style={{ clipPath: "inset(0%)" }}>
                <div className="relative">
                  <input
                    onKeyDown={handleNameKeyDown} // Attach the onKeyDown to the input
                    style={{
                      width: "calc((18ch - 5.5ch))",
                      fontSize: "clamp(44px, 12px + 2.5vw, 60px)",
                    }}
                    onFocus={() => handleInputAnimations(2)}
                    onBlur={() => handleInputAnimations(1)}
                    onChange={handleName}
                    value={name || ""}
                    ref={inputRef}
                    className="border-b-[1px] bg-transparent border-[#1a1b1c] py-[5px] text-center outline-none text-[#1a1b1c] border-solid leading-[1] tracking-[-.07em]"
                    type="text"
                  />
                  <label
                    ref={labelRef}
                    style={{
                      width: `calc((18ch - 5.5ch))`,
                      fontSize: "clamp(44px, 12px + 2.5vw, 60px)",
                    }}
                    className={`text-[#1a1b1c] ${showLabel && !nameLength ? "opacity-[1]" : "opacity-[0]"} text-center leading-[1.33] left-0 top-[5px] absolute name-label pointer-events-none tracking-[-.07em]`}
                  >
                    Introduce yourself
                  </label>
                  <div
                    style={{
                      fontSize: "clamp(10px, 5.4285714286px + .4464285714vw, 14px)",
                    }}
                    className="min-h-[1.2em] mt-[.6em] leading-[1.2] tracking-[0]"
                  />
                </div>
              </form>
            ) : (
              <div className="relative">
                {isLoaded && (
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      inputGoogleRef.current = autocomplete;
                    }}
                    onPlaceChanged={handlePlaceChanged}
                    options={{
                      types: ["(regions)"],
                    }}
                  >
                    <input
                      style={{
                        width: "calc((21ch - 5.5ch))",
                        fontSize: "clamp(44px, 12px + 2.5vw, 60px)",
                      }}
                      placeholder={
                        !locationLength && !showLabel ? "Enter a location" : ""
                      }
                      onKeyDown={handleLocationKeyDown}
                      onFocus={() => handleInputAnimations(2)}
                      onBlur={() => handleInputAnimations(1)}
                      onChange={handleLocation}
                      ref={inputRef}
                      className="border-b-[1px] bg-transparent border-[#1a1b1c] py-[5px] text-center outline-none text-[#1a1b1c] border-solid leading-[1] tracking-[-.07em]"
                      type="text"
                      value={location || ""}
                    ></input>
                  </Autocomplete>
                )}
                <label
                  ref={labelRef}
                  style={{
                    width: `calc((21ch - 5.5ch))`,
                    fontSize: "clamp(44px, 12px + 2.5vw, 60px)",
                  }}
                  className={`text-[#1a1b1c] ${showLabel && !locationLength ? "opacity-[1]" : "opacity-[0]"
                    } text-center leading-[1.33] left-0 top-[5px] name-label absolute pointer-events-none tracking-[-.07em]`}
                >
                  Where are you from?
                </label>

                <div
                  style={{
                    fontSize:
                      "clamp(10px, 5.4285714286px + .4464285714vw, 14px)",
                  }}
                  className="min-h-[1.2em] mt-[.6em] leading-[1.2] tracking-[0] "
                >
                  <p>{bottomText}</p>
                </div>
              </div>
            )}
          </div>

          <div className="items-center flex mt-auto">
            <Link
              ref={backRef}
              style={{ flex: "0 1 25%" }}
              className="mr-auto pr-[10px]"
              href={phase1 ? "/" : ""}
              onClick={handleBack}
            >
              <Button label={"BACK"} arrow={"left"} order={"icon-first"} />
            </Link>

            <div
              style={{ flex: "0 1 25%" }}
              className="ml-auto flex justify-end pl-[10px]"
            >
              <Link
                href={"/introduction"}
                className={` ${proceed ? "opacity-1" : "opacity-0"} `}
                onClick={handleProceed}
                ref={proceedRef}
              >
                <Button
                  label={"PROCEED"}
                  arrow={"right"}
                  order={"label-first"}
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <ToastContainer
        className={"toast__container"}
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      ></ToastContainer>
      <Blackbox />
    </div>
  );
};

export default Introduction;