"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Reveal from "reveal.js";

import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "reveal.js-plugins/chalkboard/plugin";
import "reveal.js-plugins/customcontrols/plugin";

type RevealContext = {
  deckRef: React.RefObject<Reveal.Api | null>;
  setDeckRef: (el: React.RefObject<HTMLDivElement> | null) => void;
  setOptions: Dispatch<SetStateAction<Reveal.Options>>;
};

export const RevealContext = createContext({} as RevealContext);

type Props = {
  children: React.ReactNode;
  deckElRef?: React.RefObject<HTMLDivElement>;
};

export const RevealProvider = ({ children, deckElRef }: Props) => {
  const [deckElRef_, setDeckElRef] =
    useState<React.RefObject<HTMLDivElement> | null>(deckElRef ?? null);
  const deckRef = useRef<Reveal.Api | null>(null);
  const [options, setOptions] = useState<Reveal.Options>({});

  useEffect(() => {
    console.log("DECK EL REF", deckElRef);

    if (!deckElRef_?.current) return;
    if (deckRef.current) return;

    deckRef.current = new Reveal({
      navigationMode: "grid",
    });

    console.log("INIT");

    deckRef.current.initialize({
      transition: "concave",
      plugins: [window.RevealChalkboard, window.RevealCustomControls],
    });

    return () => {
      try {
        if (deckRef.current) {
          deckRef.current.destroy();
          deckRef.current = null;
        }
      } catch (e) {
        console.warn("Reveal.js destroy call failed: ", e);
      }
    };
  }, [deckElRef_?.current]);

  useEffect(() => {
    if (deckRef.current) {
      deckRef.current.configure(options);
      console.log("Options changed");
    }
  }, [options]);

  return (
    <RevealContext.Provider
      value={{ deckRef, setDeckRef: setDeckElRef, setOptions }}
    >
      {children}
    </RevealContext.Provider>
  );
};
