import type { PromptDef } from '../types';

export const nature: PromptDef[] = [
  {
    id: 'flightless-birds',
    cat: 'Nature',
    text: 'A bird that can’t fly',
    hint: 'Extinct birds count',
    obvious: 'Penguin/Penguins; Ostrich; Emu; Kiwi; Dodo',
    clever: 'Kakapo/Kākāpō',
    uncommon: 'Cassowary; Rhea; Great auk; Moa; Takahe/Takahē',
    rare:
      'Weka; Elephant bird; Steamer duck; Galápagos cormorant/Galapagos cormorant/Flightless cormorant; Kagu; Auckland teal; Campbell teal; Terror bird/Phorusrhacid; Adzebill',
    deep:
      'Titicaca grebe; Lord Howe woodhen/Lord Howe Island woodhen; Guam rail; Rodrigues solitaire/Solitaire; Gastornis; Dromornis/Mihirung; Hesperornis; Chatham rail; Henderson crake; Stephens Island wren/Lyall’s wren; Snoring rail; Gough moorhen/Tristan moorhen',
    outlier: 'Inaccessible Island rail',
  },
  {
    id: 'sea-mammals',
    cat: 'Nature',
    text: 'A mammal that lives in the sea',
    obvious: 'Whale/Whales; Dolphin/Dolphins; Seal/Seals; Blue whale; Orca/Killer whale',
    clever: 'Narwhal',
    uncommon:
      'Sea lion; Walrus; Manatee; Humpback whale/Humpback; Sea otter/Otter; Porpoise; Beluga/Beluga whale; Sperm whale; Dugong; Polar bear',
    rare:
      "Elephant seal; Leopard seal; Harbor seal/Harbour seal; Fur seal; Grey whale/Gray whale; Minke whale/Minke; Fin whale; Bottlenose dolphin; Right whale; Bowhead whale/Bowhead; Pilot whale; Monk seal; Harp seal; Weddell seal; Crabeater seal; Hooded seal; Sei whale; Bryde's whale; Vaquita; Marine otter; False killer whale; Risso's dolphin; Spinner dolphin; Hector's dolphin; Dall's porpoise; Ringed seal; Bearded seal; Steller sea lion; Ross seal",
    deep:
      "Cuvier's beaked whale/Beaked whale; Pygmy right whale; Dwarf sperm whale; Pygmy sperm whale; Melon-headed whale; Irrawaddy dolphin; Commerson's dolphin; Baird's beaked whale; Omura's whale; Steller's sea cow/Sea cow; Hourglass dolphin; Clymene dolphin; Fraser's dolphin; Sea mink",
    outlier: 'Spade-toothed whale',
  },
  {
    id: 'dog-breeds',
    cat: 'Nature',
    text: 'A dog breed',
    hint: 'Recognized breeds, not mixes',
    obvious:
      'Labrador Retriever/Labrador/Lab; Golden Retriever; German Shepherd/Alsatian; Poodle; Bulldog/English Bulldog; Beagle; Chihuahua; Siberian Husky/Husky',
    clever: 'Xoloitzcuintli/Xolo/Mexican Hairless; Basenji',
    uncommon:
      'Rottweiler; Dachshund/Wiener dog/Sausage dog; Boxer; Pug; Great Dane; Doberman/Dobermann/Doberman Pinscher; Corgi/Welsh Corgi/Pembroke Welsh Corgi; Shih Tzu; Yorkshire Terrier/Yorkie; Border Collie; Pomeranian; Dalmatian; French Bulldog/Frenchie; Cocker Spaniel; Maltese; Saint Bernard; Greyhound; Pit Bull/Pitbull/American Pit Bull Terrier; Australian Shepherd/Aussie; Bichon Frise/Bichon; Shiba Inu/Shiba; Akita; Jack Russell Terrier/Jack Russell; Collie/Rough Collie; Bloodhound; Newfoundland/Newfie; Mastiff; Chow Chow; Whippet; Samoyed; Schnauzer; Cavalier King Charles Spaniel/King Charles Spaniel/Cavalier; Boston Terrier; Shar Pei; Alaskan Malamute/Malamute; Weimaraner; Bull Terrier; Pekingese; Papillon; Afghan Hound; Irish Wolfhound; Basset Hound/Basset; Vizsla; Lhasa Apso; Havanese; Shetland Sheepdog/Sheltie',
    rare:
      "Bernese Mountain Dog; Great Pyrenees/Pyrenean Mountain Dog; Rhodesian Ridgeback; Belgian Malinois/Malinois; Cane Corso; Dogo Argentino; Borzoi; Saluki; Keeshond; Bedlington Terrier; Airedale Terrier/Airedale; Scottish Terrier/Scottie; West Highland White Terrier/Westie; Brittany/Brittany Spaniel; English Springer Spaniel/Springer Spaniel; German Shorthaired Pointer/Pointer; Leonberger; Tibetan Mastiff; Chinese Crested; Italian Greyhound; Miniature Pinscher/Min Pin; Old English Sheepdog; Komondor; Puli; Anatolian Shepherd/Kangal; Coton de Tulear; Portuguese Water Dog; Affenpinscher; Brussels Griffon; Schipperke; Norwegian Elkhound; Bullmastiff; Staffordshire Bull Terrier/Staffy; Border Terrier; Cairn Terrier; Australian Kelpie/Kelpie; Australian Cattle Dog/Blue Heeler/Heeler; Catahoula Leopard Dog/Catahoula; Plott Hound; Redbone Coonhound/Coonhound; Chesapeake Bay Retriever; Flat-Coated Retriever; Nova Scotia Duck Tolling Retriever/Toller; Japanese Chin; Tosa Inu/Tosa; Pharaoh Hound; Ibizan Hound; Dogue de Bordeaux; Neapolitan Mastiff; Briard; Beauceron",
    deep:
      'Lagotto Romagnolo; Otterhound; Bergamasco; Mudi; Azawakh; Thai Ridgeback; Stabyhoun; Kooikerhondje; Cesky Terrier; Dandie Dinmont Terrier/Dandie Dinmont; Sealyham Terrier; Skye Terrier; Glen of Imaal Terrier; Kai Ken; Korean Jindo/Jindo; Peruvian Inca Orchid/Peruvian Hairless; Chinook; Hovawart; Bouvier des Flandres/Bouvier; Spinone Italiano/Spinone; Wirehaired Pointing Griffon; Sussex Spaniel; Clumber Spaniel; Field Spaniel; Boykin Spaniel; Swedish Vallhund; Finnish Lapphund; Icelandic Sheepdog; Russian Toy; Tibetan Spaniel; Pumi; Karelian Bear Dog; Caucasian Shepherd/Caucasian Ovcharka; Sloughi; Kishu Ken/Kishu',
    outlier: 'Norwegian Lundehund/Lundehund',
  },
  {
    id: 'fruits',
    cat: 'Food',
    text: 'A fruit',
    obvious: 'Apple; Banana; Orange; Strawberry; Grape/Grapes; Watermelon',
    clever: 'Tomato; Durian',
    uncommon:
      'Pineapple; Mango; Peach; Pear; Cherry/Cherries; Blueberry; Raspberry; Lemon; Lime; Kiwi/Kiwifruit; Coconut; Pomegranate; Plum; Grapefruit; Papaya; Avocado; Apricot; Cantaloupe; Honeydew; Blackberry; Cranberry; Fig; Nectarine; Tangerine; Clementine; Mandarin; Melon; Passion fruit/Passionfruit; Dragon fruit/Pitaya/Pitahaya; Lychee/Litchi; Guava; Date/Dates; Olive',
    rare:
      'Persimmon; Starfruit/Carambola; Jackfruit; Rambutan; Mangosteen; Kumquat; Quince; Gooseberry; Elderberry; Mulberry; Boysenberry; Currant/Blackcurrant/Redcurrant; Loquat; Longan; Tamarind; Plantain; Feijoa; Cherimoya/Custard apple; Soursop/Guanabana; Açaí/Acai; Yuzu; Pomelo; Blood orange; Prickly pear/Cactus pear; Physalis/Cape gooseberry/Goldenberry; Huckleberry; Lingonberry; Cloudberry; Salak/Snake fruit; Ackee; Breadfruit; Medlar; Bergamot; Kiwano/Horned melon; Tangelo; Ugli fruit; Pawpaw; Sapodilla; Jabuticaba/Jaboticaba',
    deep:
      "Buddha's hand; Mamey sapote/Mamey; Black sapote/Chocolate pudding fruit; Biribá/Rollinia; Langsat/Lanzones; Santol; Marula; Baobab fruit/Baobab; Monstera deliciosa/Monstera; Cupuaçu/Cupuacu; Salmonberry; Thimbleberry; Sea buckthorn; Rose hip/Rosehip; Aronia/Chokeberry; Saskatoon berry/Serviceberry/Juneberry; Surinam cherry/Pitanga; Natal plum/Carissa; Wood apple/Bael; Finger lime; Gac; Pequi; Canistel/Eggfruit",
    outlier: 'Miracle fruit/Miracle berry',
  },
];
