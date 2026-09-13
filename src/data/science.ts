import type { PromptDef } from '../types';

export const science: PromptDef[] = [
  {
    id: 'elements',
    cat: 'Science',
    text: 'A chemical element',
    obvious: 'Oxygen; Hydrogen; Carbon; Gold; Iron; Helium',
    clever: 'Tungsten; Bismuth',
    uncommon:
      'Nitrogen; Silver; Copper; Sodium; Chlorine; Calcium; Potassium; Lithium; Uranium; Neon; Mercury; Lead; Zinc; Aluminium/Aluminum; Platinum; Plutonium; Titanium; Magnesium; Sulfur/Sulphur; Phosphorus; Silicon; Nickel; Tin; Argon; Radon; Cobalt; Iodine; Fluorine',
    rare:
      'Boron; Beryllium; Krypton; Xenon; Chromium; Manganese; Arsenic; Selenium; Bromine; Strontium; Radium; Caesium/Cesium; Barium; Cadmium; Palladium; Osmium; Iridium; Rhodium; Vanadium; Zirconium; Gallium; Germanium; Antimony; Tellurium; Polonium; Francium; Thorium; Americium; Einsteinium; Neodymium; Molybdenum; Scandium; Rubidium; Indium; Thallium; Astatine; Tantalum; Niobium; Curium; Nobelium',
    deep:
      'Ruthenium; Technetium; Hafnium; Rhenium; Yttrium; Lanthanum; Cerium; Praseodymium; Promethium; Samarium; Europium; Gadolinium; Terbium; Dysprosium; Holmium; Erbium; Thulium; Lutetium; Actinium; Protactinium; Neptunium; Berkelium; Californium; Fermium; Mendelevium; Lawrencium; Rutherfordium; Dubnium; Seaborgium; Bohrium; Hassium; Meitnerium; Darmstadtium; Roentgenium; Copernicium; Nihonium; Flerovium; Moscovium; Livermorium; Tennessine; Oganesson',
    outlier: 'Ytterbium',
  },
  {
    id: 'constellations',
    cat: 'Space',
    text: 'A constellation',
    hint: 'The 88 official ones — the Big Dipper is an asterism',
    obvious: 'Orion; Ursa Major/Great Bear; Ursa Minor/Little Bear; Cassiopeia; Scorpius/Scorpio',
    clever: 'Ophiuchus',
    uncommon:
      'Leo; Taurus; Gemini; Cancer; Virgo; Libra; Sagittarius; Capricornus/Capricorn; Aquarius; Pisces; Aries; Pegasus; Andromeda; Draco; Cygnus; Perseus; Hercules; Crux/Southern Cross; Lyra; Canis Major; Centaurus; Phoenix; Hydra; Aquila',
    rare:
      'Canis Minor; Auriga; Boötes/Bootes; Cepheus; Cetus; Corona Borealis; Corona Australis; Delphinus; Eridanus; Lepus; Lupus; Lynx; Monoceros; Serpens; Sagitta; Triangulum; Vulpecula; Carina; Vela; Puppis; Columba; Corvus; Crater; Leo Minor; Canes Venatici; Coma Berenices; Piscis Austrinus; Grus; Pavo; Tucana; Dorado; Chamaeleon; Lacerta; Scutum; Equuleus',
    deep:
      'Antlia; Apus; Ara; Caelum; Circinus; Fornax; Horologium; Hydrus; Indus; Mensa; Microscopium; Musca; Norma; Octans; Pictor; Pyxis; Reticulum; Sculptor; Sextans; Telescopium; Triangulum Australe; Volans',
    outlier: 'Camelopardalis',
  },
  {
    id: 'moons',
    cat: 'Space',
    text: 'A moon in our solar system',
    hint: 'Any named natural satellite — Earth’s counts',
    obvious: 'The Moon/Moon/Luna; Titan; Europa; Ganymede',
    clever: 'Phobos',
    uncommon: 'Io; Callisto; Deimos; Enceladus; Triton; Charon',
    rare:
      "Mimas; Tethys; Dione; Rhea; Iapetus; Hyperion; Phoebe; Miranda; Ariel; Umbriel; Titania; Oberon; Nereid; Amalthea; Pandora; Prometheus; Janus; Epimetheus; Nix; Hydra; Proteus; Dysnomia; Hi'iaka/Hiiaka; Namaka",
    deep:
      'Metis; Adrastea; Thebe; Himalia; Elara; Pasiphae; Sinope; Lysithea; Carme; Ananke; Leda; Atlas; Pan; Daphnis; Helene; Telesto; Calypso; Methone; Pallene; Ymir; Paaliaq; Tarvos; Kiviuq; Siarnaq; Puck; Cordelia; Ophelia; Bianca; Cressida; Desdemona; Juliet; Portia; Rosalind; Belinda; Perdita; Mab; Cupid; Caliban; Sycorax; Prospero; Setebos; Stephano; Trinculo; Francisco; Margaret; Ferdinand; Naiad; Thalassa; Despina; Galatea; Larissa; Halimede; Sao; Laomedeia; Psamathe; Neso; Kerberos; Styx; Vanth; Weywot; Actaea; Ilmarë/Ilmare; Xiangliu; Dactyl; Linus',
    outlier: 'Hippocamp',
  },
  {
    id: 'dinosaurs',
    cat: 'Science',
    text: 'A dinosaur',
    hint: 'Pterosaurs and sea reptiles aren’t dinosaurs',
    obvious: 'Tyrannosaurus/T. rex/T-Rex/Tyrannosaurus rex; Triceratops; Velociraptor/Raptor; Stegosaurus; Brachiosaurus',
    clever: 'Chicken/Bird/Birds',
    uncommon:
      'Spinosaurus; Ankylosaurus; Diplodocus; Allosaurus; Apatosaurus; Brontosaurus; Parasaurolophus; Pachycephalosaurus; Iguanodon; Dilophosaurus; Carnotaurus; Giganotosaurus; Archaeopteryx; Compsognathus; Gallimimus; Deinonychus; Therizinosaurus; Argentinosaurus',
    rare:
      'Oviraptor; Protoceratops; Baryonyx; Utahraptor; Microraptor; Troodon; Maiasaura; Edmontosaurus; Styracosaurus; Megalosaurus; Ceratosaurus; Coelophysis; Plateosaurus; Camarasaurus; Suchomimus; Kentrosaurus; Dreadnoughtus; Albertosaurus; Corythosaurus; Lambeosaurus; Hadrosaurus; Euoplocephalus; Nodosaurus; Mamenchisaurus; Sinosauropteryx; Yutyrannus; Tarbosaurus; Majungasaurus; Amargasaurus; Carcharodontosaurus; Herrerasaurus; Eoraptor; Psittacosaurus; Ouranosaurus; Saltasaurus; Titanosaurus; Chasmosaurus; Centrosaurus',
    deep:
      'Nigersaurus; Stygimoloch; Dracorex; Borealopelta; Masiakasaurus; Mononykus; Deinocheirus; Pentaceratops; Einiosaurus; Kosmoceratops; Zuniceratops; Shunosaurus; Europasaurus; Patagotitan; Mapusaurus; Concavenator; Halszkaraptor; Epidexipteryx; Anchiornis; Heterodontosaurus; Scelidosaurus; Leaellynasaura; Muttaburrasaurus; Minmi; Australovenator; Qianzhousaurus; Nothronychus; Tsintaosaurus; Olorotitan; Rajasaurus; Gigantoraptor; Beipiaosaurus; Dakotaraptor',
    outlier: 'Irritator',
  },
];
