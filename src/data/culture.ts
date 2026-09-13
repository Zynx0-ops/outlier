import type { PromptDef } from '../types';

export const culture: PromptDef[] = [
  {
    id: 'pixar',
    cat: 'Film',
    text: 'A Pixar feature film',
    obvious: 'Toy Story; Finding Nemo; Up; Cars; The Incredibles',
    clever: 'The Good Dinosaur',
    uncommon:
      "Monsters, Inc.; Ratatouille; WALL-E; Inside Out; Coco; Brave; A Bug's Life; Toy Story 2; Toy Story 3; Toy Story 4; Soul; Luca; Turning Red; Finding Dory; Incredibles 2; Monsters University; Inside Out 2",
    rare: 'Cars 2; Cars 3; Onward; Lightyear; Elemental',
    deep: 'Elio; Toy Story 5',
    outlier: 'Hoppers',
  },
  {
    id: 'shakespeare',
    cat: 'Literature',
    text: 'A play by Shakespeare',
    hint: 'Collaborations and lost plays count',
    obvious: "Romeo and Juliet; Hamlet; Macbeth; Othello; A Midsummer Night's Dream/Midsummer Night's Dream",
    clever: 'Titus Andronicus',
    uncommon:
      'King Lear; The Tempest; Julius Caesar; Much Ado About Nothing; The Taming of the Shrew; Twelfth Night; The Merchant of Venice; As You Like It; Richard III/Richard 3; Henry V/Henry 5; Antony and Cleopatra; The Comedy of Errors',
    rare:
      "Richard II/Richard 2; Henry IV, Part 1/Henry IV/Henry 4/1 Henry IV; Henry IV, Part 2/2 Henry IV; Henry VI, Part 1/Henry VI/Henry 6/1 Henry VI; Henry VI, Part 2/2 Henry VI; Henry VI, Part 3/3 Henry VI; Henry VIII/Henry 8; King John; The Winter's Tale; Measure for Measure; All's Well That Ends Well; Coriolanus; Cymbeline; Troilus and Cressida; The Merry Wives of Windsor; The Two Gentlemen of Verona; Love's Labour's Lost/Love's Labor's Lost; Timon of Athens; Pericles/Pericles, Prince of Tyre",
    deep: 'The Two Noble Kinsmen; Edward III/Edward 3; Sir Thomas More',
    outlier: 'Cardenio',
  },
  {
    id: 'greek-gods',
    cat: 'Mythology',
    text: 'A Greek god or goddess',
    hint: 'Olympians, Titans, primordials and minor deities',
    obvious: 'Zeus; Poseidon; Hades; Athena; Aphrodite; Apollo',
    clever: 'Nike',
    uncommon:
      'Hera; Ares; Hermes; Artemis; Demeter; Dionysus; Hephaestus; Hestia; Persephone; Eros; Kronos/Cronus/Cronos; Gaia/Gaea; Nemesis; Hecate/Hekate; Pan; Helios; Atlas; Prometheus; Uranus/Ouranos; Rhea; Selene; Eos',
    rare:
      'Hypnos; Thanatos; Morpheus; Tyche; Iris; Hebe; Eris; Nyx; Chaos; Erebus; Tartarus; Pontus; Oceanus; Tethys; Themis; Mnemosyne; Hyperion; Metis; Leto; Asclepius; Aeolus; Boreas; Zephyrus; Triton; Amphitrite; Nereus; Proteus; Harmonia; Phobos; Deimos; Enyo; Priapus; Plutus; Styx; Kratos; Bia; Pheme',
    deep:
      'Achlys; Momus; Oizys; Soteria; Alastor; Nomos; Geras; Apate; Dolos; Keres/Ker; Hemera; Aether; Phanes; Ananke; Chronos; Eileithyia; Astraea; Zelus; Pallas; Perses; Crius; Coeus; Iapetus; Phoebe; Theia; Glaucus; Thaumas; Ceto; Phorcys',
    outlier: 'Aergia',
  },
  {
    id: 'instruments',
    cat: 'Music',
    text: 'A musical instrument',
    obvious: 'Piano; Guitar; Drums/Drum; Violin/Fiddle; Flute; Trumpet',
    clever: 'Theremin; Triangle',
    uncommon:
      'Saxophone/Sax; Cello; Clarinet; Harp; Bass guitar/Bass/Electric bass; Trombone; Tuba; Ukulele; Harmonica; Accordion; Banjo; Oboe; Bassoon; French horn/Horn; Viola; Double bass/Upright bass/Contrabass; Xylophone; Tambourine; Organ/Pipe organ; Synthesizer/Synth/Keyboard; Bagpipes/Bagpipe; Recorder; Mandolin; Piccolo; Cymbals/Cymbal; Timpani/Kettle drum; Glockenspiel; Maracas; Bongos; Sitar; Harpsichord; Kazoo; Marimba; Cowbell; Bugle; Castanets; Didgeridoo',
    rare:
      "Lute; Lyre; Zither; Dulcimer; Hammered dulcimer; Balalaika; Bouzouki; Oud; Koto; Shamisen; Erhu; Pipa; Guzheng; Tabla; Djembe; Cajón/Cajon; Steelpan/Steel drum; Congas/Conga; Kalimba/Thumb piano/Mbira; Sousaphone; Euphonium; Flugelhorn; Cornet; Mellophone; Celesta; Vibraphone; Clavichord; Melodica; Ocarina; Pan flute/Panpipes; Shakuhachi; Bansuri; Tin whistle/Penny whistle; Cor anglais/English horn; Contrabassoon; Bass clarinet; Hurdy-gurdy; Concertina; Bandoneon; Handpan/Hang drum; Washboard; Jaw harp/Jew's harp/Mouth harp; Gong; Wood block; Claves; Güiro/Guiro; Vuvuzela; Keytar; Mellotron; Sarangi; Veena; Mridangam; Dhol; Taiko; Shofar; Alphorn; Cimbalom; Charango; Kora; Talking drum",
    deep:
      'Ondes Martenot; Glass harmonica/Armonica; Nyckelharpa; Serpent; Ophicleide; Crwth; Theorbo; Viola da gamba; Sackbut; Crumhorn; Rebec; Hardanger fiddle; Bullroarer; Waterphone; Stylophone; Tromba marina; Sheng; Duduk; Zurna; Kaval; Gusli; Kantele; Tanpura/Tambura; Santoor; Rubab; Bağlama/Baglama/Saz; Berimbau; Cuíca/Cuica; Udu; Contrabass saxophone; Heckelphone; Sarrusophone; Tubax',
    outlier: 'Octobass',
  },
  {
    id: 'pokemon-151',
    cat: 'Games',
    text: 'One of the original 151 Pokémon',
    obvious: 'Pikachu; Charizard; Bulbasaur; Squirtle; Charmander; Mewtwo; Mew; Eevee; Jigglypuff; Snorlax',
    clever: 'Magikarp; Ditto',
    uncommon:
      'Ivysaur; Venusaur; Charmeleon; Wartortle; Blastoise; Caterpie; Metapod; Butterfree; Beedrill; Pidgey; Rattata; Ekans; Arbok; Raichu; Clefairy; Vulpix; Ninetales; Zubat; Oddish; Diglett; Meowth; Psyduck; Growlithe; Arcanine; Poliwag; Abra; Kadabra; Alakazam; Machop; Machamp; Geodude; Ponyta; Slowpoke; Magnemite; Gastly; Haunter; Gengar; Onix; Voltorb; Cubone; Koffing; Chansey; Starmie; Mr. Mime; Scyther; Electabuzz; Gyarados; Lapras; Vaporeon; Jolteon; Flareon; Articuno; Zapdos; Moltres; Dratini; Dragonair; Dragonite',
    rare:
      "Weedle; Kakuna; Pidgeotto; Pidgeot; Raticate; Spearow; Fearow; Sandshrew; Sandslash; Nidoran; Nidoqueen; Nidoking; Clefable; Wigglytuff; Golbat; Gloom; Vileplume; Paras; Dugtrio; Persian; Golduck; Mankey; Primeape; Poliwhirl; Poliwrath; Machoke; Bellsprout; Victreebel; Tentacool; Tentacruel; Graveler; Golem; Rapidash; Slowbro; Magneton; Farfetch'd; Doduo; Seel; Dewgong; Grimer; Muk; Shellder; Cloyster; Drowzee; Hypno; Krabby; Electrode; Exeggutor; Marowak; Hitmonlee; Hitmonchan; Lickitung; Weezing; Rhyhorn; Rhydon; Kangaskhan; Horsea; Goldeen; Staryu; Jynx; Magmar; Tauros; Porygon; Omanyte; Kabuto; Kabutops; Aerodactyl",
    deep: 'Nidorina; Nidorino; Parasect; Venonat; Venomoth; Dodrio; Kingler; Exeggcute; Tangela; Seadra; Seaking; Pinsir; Omastar',
    outlier: 'Weepinbell',
  },
];
