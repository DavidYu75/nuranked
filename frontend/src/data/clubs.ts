export interface Club {
  id: string;
  name: string;
  logo: string;
  url: string;
}

export const clubs: Club[] = [
  {
    id: "c4c",
    name: "Code4Community",
    logo: "/logos/c4c.png", // Replace with actual logo path
    url: "https://www.c4cneu.com/",
  },
  {
    id: "generate",
    name: "Generate Product Development",
    logo: "/logos/generate.png", // Replace with actual logo path
    url: "https://generatenu.com/",
  },
  {
    id: "sandbox",
    name: "Sandbox",
    logo: "/logos/sandbox.png", // Replace with actual logo path
    url: "https://www.sandboxnu.com/",
  },
  {
    id: "scout",
    name: "Scout",
    logo: "/logos/scout.png", // Replace with actual logo path
    url: "https://scout.camd.northeastern.edu/",
  },
  {
    id: "ner",
    name: "Northeastern Electric Racing",
    logo: "/logos/ner.png", // Replace with actual logo path
    url: "https://electricracing.northeastern.edu/",
  },
  {
    id: "forge",
    name: "Forge",
    logo: "/logos/forge.png", // Replace with actual logo path
    url: "https://www.forgenu.com/",
  },
  {
    id: "hoosky",
    name: "Hoosky",
    logo: "/logos/hoosky.png", // Replace with actual logo path
    url: "https://hoosky.store/",
  },
  {
    id: "colorstack",
    name: "ColorStack",
    logo: "/logos/colorstack.png", // Replace with actual logo path
    url: "https://colorstackneu.sites.northeastern.edu/",
  },
  {
    id: "hbp",
    name: "HackBeanpot",
    logo: "/logos/hackbeanpot.png", // Replace with actual logo path
    url: "https://www.hackbeanpot.com/",
  },
];

export default clubs; 