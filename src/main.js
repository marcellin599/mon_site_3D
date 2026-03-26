import { initScene, createProject, animate, clickableObjects } from "../js/scene3D.js";

initScene();

// Crée les projets avec infos et lien github
const projects = [
  {
    position: [-3, 1, 0],
    color: 0xff6347,
    data: {
      title: "CDP_Shopzone",
      description: "Un super site de base wordpress mais a defaut d'espace et de ram ,je vous presente une demo ,une vue d'ensemble static du site e-com",
      link: "https://github.com/marcellin599/cdp-shopzone"
    }
  },
  {
    position: [0, 1, 0],
    color: 0x4caf50,
    data: {
      title: "Gestion des étudiants",
      description: "site de gestion des étudiants avec une interface d'administration pour gérer les étudiants, les cours et les notes",
      link: "https://github.com/marcellin599/gestion_etudiant"
    }
  },
  {
    position: [3, 1, 0],
    color: 0x2196f3,
    data: {
      title: "Gestion Materielle Informatique",
      description: "Un projet de gestion du matériel informatique pour une entreprise, permettant de suivre les équipements, les utilisateurs et les incidents",
      link: "https://github.com/marcellin599/GESTION_MATERIELLE_INFORMATIQUE"
    }
  }
];

// On crée tous les cubes projets
projects.forEach(({ position, color, data }) => {
  createProject(position[0], position[1], position[2], color, data);
});

// On anime seulement les cubes projets
animate(clickableObjects);