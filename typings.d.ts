declare module "reveal.js-plugins/chalkboard/plugin" {
  export default any;
}

declare module "reveal.js-plugins/customcontrols/plugin" {
  export default any;
}

declare module globalThis {
  interface Window {
    RevealChalkboard: any;
    RevealCustomControls: any;
  }
}

declare module "tailwindcss/lib/util/flattenColorPalette" {
  export default any;
}
