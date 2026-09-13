import type { PromptDef } from '../types';

export const food: PromptDef[] = [
  {
    id: 'pasta',
    cat: 'Food',
    text: 'A pasta shape',
    obvious: 'Spaghetti; Penne; Macaroni; Lasagna/Lasagne; Fettuccine/Fettuccini/Fettucine',
    clever: 'Orecchiette; Bucatini',
    uncommon:
      'Ravioli; Linguine/Linguini; Fusilli; Rigatoni; Farfalle/Bow tie/Bowtie; Tortellini; Rotini; Ziti; Orzo; Gnocchi; Tagliatelle; Capellini/Angel hair; Conchiglie/Shells; Cannelloni; Pappardelle; Vermicelli; Manicotti; Elbow macaroni/Elbows',
    rare:
      'Ditalini; Radiatori; Cavatappi; Gemelli; Campanelle; Paccheri; Tortelloni; Cavatelli; Agnolotti; Stelline; Acini di pepe; Trofie; Mafaldine/Mafalda/Reginette; Anelli; Rotelle/Wagon wheels/Ruote; Casarecce; Garganelli; Strozzapreti; Pici; Lumache; Mezze maniche; Tortiglioni; Spaghettini; Bigoli; Tagliolini/Taglierini; Fregola; Alfabeto/Alphabet pasta; Pastina; Sedani; Calamarata',
    deep:
      'Corzetti; Lorighittas; Busiate; Scialatielli; Lagane; Culurgiones; Maltagliati; Pizzoccheri; Testaroli; Fileja; Cappelletti; Anolini; Mandilli di seta; Trenette; Spaghetti alla chitarra/Chitarra; Stringozzi; Gigli; Creste di gallo; Lanterne; Marille; Cascatelli',
    outlier: 'Su filindeu/Filindeu',
  },
  {
    id: 'cheese',
    cat: 'Food',
    text: 'A cheese',
    obvious: 'Cheddar; Mozzarella; Parmesan/Parmigiano-Reggiano/Parmigiano; Swiss/Swiss cheese; Brie; American/American cheese',
    clever: 'Halloumi; Gruyère/Gruyere',
    uncommon:
      'Gouda; Feta; Camembert; Blue cheese/Blue; Ricotta; Provolone; Monterey Jack/Jack; Pepper Jack; Colby; Colby Jack; Cream cheese; Cottage cheese; Mascarpone; Goat cheese/Chèvre/Chevre; Stilton; Roquefort; Gorgonzola; Emmental/Emmentaler/Emmenthal; Manchego; Havarti; Muenster/Munster; Pecorino/Pecorino Romano; Burrata; Edam; Asiago; Paneer; Queso fresco; String cheese',
    rare:
      "Comté/Comte; Taleggio; Fontina; Raclette; Jarlsberg; Wensleydale; Red Leicester; Double Gloucester; Lancashire; Caerphilly; Limburger; Port Salut; Reblochon; Époisses/Epoisses; Boursin; Tilsit; Grana Padano; Cotija; Oaxaca; Queso blanco; Labneh; Stracciatella; Scamorza; Leerdammer; Saint Agur; Cambozola; Danish Blue; Maytag Blue; Brunost/Gjetost; Kashkaval; Kasseri; Graviera; Mimolette; Beaufort; Tomme; Morbier; Pont-l'Évêque/Pont l'Eveque; Neufchâtel/Neufchatel; Ossau-Iraty; Idiazabal; Mahón/Mahon; Cabrales; Tête de Moine/Tete de Moine; Appenzeller; Vacherin; Chaource; Cantal; Saint-Nectaire; Velveeta; Bocconcini; Provola; Caciocavallo; Montasio; Bel Paese; Ricotta salata; Cheshire",
    deep:
      "Pule; Stinking Bishop; Milbenkäse/Milbenkase; Vieux-Boulogne; Bitto Storico; Cornish Yarg/Yarg; Mont d'Or; Bleu d'Auvergne; Shropshire Blue; Sage Derby; Stichelton; Hoop cheese; Brick cheese; Teleme; Liederkranz; Sulguni; Chhurpi; Oscypek; Moose cheese; Dunlop; Wagasi; Kalari; Bryndza; Graukäse/Tiroler Graukäse/Graukase",
    outlier: 'Casu marzu',
  },
  {
    id: 'cocktails',
    cat: 'Food',
    text: 'A classic cocktail',
    obvious: 'Margarita; Martini; Mojito; Old Fashioned; Piña colada/Pina colada',
    clever: 'Negroni; Aperol Spritz/Spritz',
    uncommon:
      "Cosmopolitan/Cosmo; Daiquiri; Manhattan; Bloody Mary; Mai Tai; Long Island Iced Tea/Long Island; Moscow Mule; Whiskey Sour/Whisky Sour; Mimosa; Tequila Sunrise; Sex on the Beach; Gin and Tonic/G&T; Espresso Martini; Paloma; Caipirinha; White Russian; Screwdriver; Cuba Libre/Rum and Coke; Bellini; Sangria; Mint Julep; Dark 'n' Stormy/Dark and Stormy; Tom Collins; Irish coffee; Hurricane; Blue Lagoon; Kamikaze; Lemon Drop; Appletini; Sidecar; Gimlet",
    rare:
      "Sazerac; Boulevardier; French 75; Aviation; Last Word; Paper Plane; Penicillin; Corpse Reviver; Vesper; Zombie; Singapore Sling; Grasshopper; Brandy Alexander; Rob Roy; Rusty Nail; Godfather; Amaretto Sour; Pisco Sour; Bramble; Clover Club; Mudslide; Salty Dog; Greyhound; Harvey Wallbanger; Sea Breeze; Cape Codder; Black Russian; Kir Royale/Kir; Hanky Panky; Southside; Hemingway Daiquiri; Painkiller; Jungle Bird; Ramos Gin Fizz/Gin Fizz; Pimm's Cup/Pimm's; Michelada; Americano; Stinger; Vieux Carré/Vieux Carre; Bee's Knees; El Diablo; Mary Pickford; Tuxedo; Blood and Sand; Brooklyn; Bamboo; Adonis; Martinez",
    deep:
      "Suffering Bastard; Missionary's Downfall; Fog Cutter; Naked and Famous; Death in the Afternoon; Monkey Gland; Widow's Kiss; Bijou; Toronto; Remember the Maine; Trinidad Sour; Jack Rose; Scofflaw; Twentieth Century; Pegu Club; Chrysanthemum; Army and Navy; Tipperary; Lion's Tail; Seelbach",
    outlier: "Satan's Whiskers",
  },
  {
    id: 'spices',
    cat: 'Food',
    text: 'A herb or spice',
    obvious: 'Black pepper/Pepper; Cinnamon; Basil; Oregano; Paprika; Garlic',
    clever: 'Saffron',
    uncommon:
      'Cumin; Nutmeg; Ginger; Turmeric; Thyme; Rosemary; Parsley; Cilantro/Coriander; Dill; Mint; Sage; Chili powder/Chili/Chilli; Cayenne/Cayenne pepper; Cloves/Clove; Bay leaf/Bay leaves; Vanilla; Cardamom; Chives; Allspice; Mustard seed/Mustard; Curry powder; Tarragon; Fennel; Anise/Aniseed; Star anise; Garam masala; Lemongrass; Marjoram; Sesame/Sesame seed; Onion powder; Garlic powder',
    rare:
      "Sumac; Za'atar; Fenugreek; Asafoetida/Hing; Caraway; Mace; Juniper/Juniper berries; Sichuan pepper/Szechuan pepper; Chervil; Lovage; Savory; Borage; Epazote; Galangal; Makrut lime leaf/Kaffir lime leaf/Lime leaf; Curry leaf/Curry leaves; Nigella/Nigella seed/Kalonji; Ajwain/Carom; Celery seed; Pink peppercorn; White pepper; Long pepper; Annatto/Achiote; Five spice/Chinese five spice; Ras el hanout; Berbere; Herbes de Provence; Shichimi togarashi/Shichimi; Dukkah; Baharat; Amchur/Mango powder; Mahlab/Mahleb; Sorrel; Hyssop; Lemon balm; Lavender; Wasabi; Horseradish; Chipotle; Gochugaru; Grains of paradise; Vietnamese coriander/Rau ram; Culantro; Shiso/Perilla",
    deep:
      'Grains of Selim; Cubeb; Anardana; Kokum; Black cardamom; Wattleseed; Tasmanian pepper/Pepperberry; Lemon myrtle; Filé powder/File powder; Mastic; Mugwort; Rue; Costmary; Sweet cicely; Tonka bean/Tonka; Black lime/Loomi/Dried lime; Hoja santa; Sassafras; Zedoary; Kalpasi/Stone flower; Timut pepper/Timur; Voatsiperifery; Alligator pepper',
    outlier: 'Silphium',
  },
];
