import type { PromptDef } from '../types';

export const geography: PromptDef[] = [
  {
    id: 'crescent-flags',
    cat: 'Geography',
    text: 'A country with a crescent moon on its flag',
    hint: 'UN member states',
    obvious: 'Turkey/Türkiye/Turkiye; Pakistan',
    clever: 'Singapore',
    uncommon: 'Algeria; Tunisia; Malaysia; Azerbaijan; Libya',
    rare: 'Uzbekistan; Mauritania; Maldives; Turkmenistan',
    deep: 'Nepal; Brunei',
    outlier: 'Comoros',
  },
  {
    id: 'landlocked',
    cat: 'Geography',
    text: 'A landlocked country',
    hint: 'Sovereign states',
    obvious: 'Switzerland; Austria; Mongolia; Bolivia; Paraguay; Afghanistan',
    clever: 'Liechtenstein; Vatican City/Vatican/Holy See',
    uncommon:
      'Hungary; Czech Republic/Czechia; Nepal; Kazakhstan; Luxembourg; Ethiopia; Uganda; Chad; Mali; Niger; Zambia; Zimbabwe; Botswana; Bhutan; Laos; Slovakia; Serbia; San Marino; Andorra',
    rare:
      'Belarus; Moldova; North Macedonia/Macedonia; Armenia; Kyrgyzstan/Kyrgyz Republic; Tajikistan; Turkmenistan; Rwanda; Burundi; Malawi; South Sudan; Central African Republic/CAR; Burkina Faso; Lesotho; Eswatini/Swaziland',
    deep: 'Azerbaijan; Kosovo',
    outlier: 'Uzbekistan',
  },
  {
    id: 'borders-canada',
    cat: 'Geography',
    text: 'A US state that borders Canada',
    hint: 'Land or water borders both count',
    obvious: 'Washington; Montana; Michigan; New York; Maine; Alaska',
    clever: 'Idaho',
    uncommon: 'North Dakota; Minnesota; Vermont',
    rare: 'New Hampshire',
    deep: 'Ohio',
    outlier: 'Pennsylvania',
  },
  {
    id: 'africa',
    cat: 'Geography',
    text: 'A country in Africa',
    hint: 'The 54 sovereign states',
    obvious: 'Egypt; South Africa; Nigeria; Kenya; Morocco; Ethiopia',
    clever: 'Madagascar',
    uncommon:
      "Ghana; Algeria; Tunisia; Libya; Sudan; Somalia; Uganda; Tanzania; Zimbabwe; Republic of the Congo/Congo/Congo-Brazzaville; Democratic Republic of the Congo/DRC/DR Congo/Congo-Kinshasa; Senegal; Rwanda; Cameroon; Angola; Mali; Namibia; Botswana; Zambia; Ivory Coast/Côte d'Ivoire/Cote dIvoire; Mozambique; Chad; Niger",
    rare:
      'Malawi; Sierra Leone; Liberia; Guinea; Gambia/The Gambia; Burkina Faso; Benin; Togo; Gabon; Mauritania; Eritrea; Djibouti; South Sudan; Burundi; Lesotho; Eswatini/Swaziland; Mauritius; Seychelles; Central African Republic/CAR; Cape Verde/Cabo Verde',
    deep: 'Equatorial Guinea; Guinea-Bissau; Comoros',
    outlier: 'São Tomé and Príncipe/Sao Tome/São Tomé',
  },
  {
    id: 'europe-capitals',
    cat: 'Geography',
    text: 'The capital city of a European country',
    hint: 'Sovereign states — transcontinental ones count',
    obvious: 'Paris; London; Rome; Berlin; Madrid',
    clever: 'Vaduz',
    uncommon:
      'Amsterdam; Brussels; Vienna; Lisbon; Athens; Dublin; Prague; Warsaw; Stockholm; Oslo; Copenhagen; Helsinki; Budapest; Bern/Berne; Moscow; Kyiv/Kiev; Reykjavík/Reykjavik; Ankara',
    rare:
      'Bucharest; Sofia; Belgrade; Zagreb; Ljubljana; Bratislava; Tallinn; Riga; Vilnius; Minsk; Luxembourg City/Luxembourg; Monaco; Valletta; San Marino; Vatican City; Tirana; Sarajevo; Skopje',
    deep: 'Pristina/Prishtina; Nicosia; Podgorica; Chișinău/Chisinau; Tbilisi; Yerevan; Baku; Astana',
    outlier: 'Andorra la Vella',
  },
  {
    id: 'bones',
    cat: 'Human Body',
    text: 'A bone in the human body',
    obvious: 'Femur/Thigh bone; Skull/Cranium; Rib/Ribs/Rib cage; Spine/Vertebra/Vertebrae/Backbone/Spinal column',
    clever: 'Stapes/Stirrup; Hyoid/Hyoid bone',
    uncommon:
      'Tibia/Shinbone/Shin bone; Fibula; Humerus/Funny bone; Radius; Ulna; Pelvis/Hip bone; Clavicle/Collarbone/Collar bone; Scapula/Shoulder blade; Patella/Kneecap/Knee cap; Sternum/Breastbone; Mandible/Jaw/Jawbone; Coccyx/Tailbone/Tail bone; Sacrum; Phalanges/Phalanx/Finger bone/Toe bone',
    rare:
      'Maxilla; Metacarpal/Metacarpals; Metatarsal/Metatarsals; Carpal/Carpals/Wrist bone; Tarsal/Tarsals; Calcaneus/Heel bone; Talus/Ankle bone; Incus/Anvil; Malleus/Hammer; Ilium; Ischium; Pubis/Pubic bone; Atlas; Axis; Zygomatic bone/Zygomatic/Cheekbone; Occipital bone/Occipital; Frontal bone/Frontal; Parietal bone/Parietal; Temporal bone/Temporal; Nasal bone',
    deep:
      'Scaphoid; Lunate; Triquetrum; Trapezium; Trapezoid; Capitate; Hamate; Cuboid; Navicular; Cuneiform; Sphenoid; Ethmoid; Vomer; Lacrimal bone/Lacrimal; Palatine bone/Palatine; Sesamoid; Inferior nasal concha/Nasal concha/Turbinate',
    outlier: 'Pisiform',
  },
];
