import type { PromptDef } from '../types';

export const misc: PromptDef[] = [
  {
    id: 'palindromes',
    cat: 'Words',
    text: 'A word that is a palindrome',
    hint: 'One English word, same backwards — no names',
    obvious: 'Racecar/Race car; Level; Kayak; Mom; Dad; Radar',
    clever: 'Tattarrattat',
    uncommon:
      'Civic; Noon; Wow; Madam; Refer; Rotor; Stats; Pop; Peep; Deed; Eye; Nun; Tot; Gag; Gig; Did; Pup; Bib; Sees; Solos; Tenet; Ewe; Toot; Boob; Poop; Sis; Mum; Pip; Nan',
    rare: 'Redder; Reviver; Rotator; Repaper; Deified; Minim; Sagas; Kook; Tut; Huh; Aha; Ere; Sexes; Shahs; Stets; Pullup/Pull-up; Pap; Tat; Dud; Mem; Eke; Bob',
    deep: 'Detartrated; Rotavator; Hallah; Tirrit; Murdrum; Sememes; Succus; Marram; Degged; Terret; Reifier',
    outlier: 'Kinnikinnik',
  },
  {
    id: 'us-presidents',
    cat: 'History',
    text: 'A US president',
    obvious:
      'George Washington/Washington; Abraham Lincoln/Lincoln; Barack Obama/Obama; Donald Trump/Trump; Joe Biden/Biden; John F. Kennedy/JFK/Kennedy/John Kennedy',
    clever: 'William Henry Harrison',
    uncommon:
      'Thomas Jefferson/Jefferson; Franklin D. Roosevelt/FDR/Franklin Roosevelt; Theodore Roosevelt/Teddy Roosevelt/Roosevelt; Ronald Reagan/Reagan; Bill Clinton/Clinton; George W. Bush/George Bush/Bush; George H. W. Bush/Bush Sr; Richard Nixon/Nixon; Jimmy Carter/Carter; John Adams/Adams; Andrew Jackson/Jackson; Dwight D. Eisenhower/Eisenhower/Ike; Harry S. Truman/Truman; Lyndon B. Johnson/LBJ/Lyndon Johnson; Gerald Ford/Ford; Ulysses S. Grant/Grant; James Madison/Madison; James Monroe/Monroe; Woodrow Wilson/Wilson',
    rare:
      'John Quincy Adams; Martin Van Buren/Van Buren; James K. Polk/Polk; Zachary Taylor/Taylor; Andrew Johnson; William McKinley/McKinley; William Howard Taft/Taft; Calvin Coolidge/Coolidge; Herbert Hoover/Hoover; Warren G. Harding/Harding; Grover Cleveland/Cleveland; James A. Garfield/Garfield; Rutherford B. Hayes/Hayes; John Tyler/Tyler; James Buchanan/Buchanan',
    deep: 'Millard Fillmore/Fillmore; Franklin Pierce/Pierce; Benjamin Harrison',
    outlier: 'Chester A. Arthur/Chester Arthur/Arthur',
  },
  {
    id: 'olympic-sports',
    cat: 'Sports',
    text: 'An Olympic sport or discipline',
    hint: 'Summer or Winter, on the current or next Games program',
    obvious: 'Swimming; Athletics/Track and field/Track; Gymnastics; Basketball; Soccer/Football; Tennis',
    clever: 'Curling; Skeleton',
    uncommon:
      'Volleyball; Beach volleyball; Boxing; Cycling; Diving; Fencing; Rowing; Sailing; Wrestling; Weightlifting; Archery; Judo; Taekwondo; Golf; Rugby/Rugby sevens; Table tennis/Ping pong; Badminton; Handball; Field hockey/Hockey; Ice hockey; Figure skating; Speed skating; Alpine skiing/Skiing; Snowboarding/Snowboard; Bobsleigh/Bobsled; Luge; Skateboarding; Surfing; Water polo; Triathlon; Equestrian/Horse riding; Canoeing/Kayaking/Canoe',
    rare:
      'Modern pentathlon/Pentathlon; Shooting; Biathlon; Ski jumping; Nordic combined; Cross-country skiing; Freestyle skiing; Short track speed skating/Short track; Sport climbing/Climbing; Artistic swimming/Synchronized swimming; Trampoline; Rhythmic gymnastics; BMX; Mountain biking; Baseball; Softball; Marathon swimming/Open water swimming; Lacrosse; Squash; Cricket; Flag football',
    deep: 'Dressage; Keirin; Madison; Moguls; Kitesurfing/Formula Kite; Canoe slalom; Omnium; Skeet; Trap; Big air; Halfpipe; Slopestyle; Ski cross; Snowboard cross; Monobob; Race walking/Racewalking; Steeplechase; Decathlon; Heptathlon',
    outlier: 'Ski mountaineering/Skimo',
  },
  {
    id: 'programming-languages',
    cat: 'Tech',
    text: 'A programming language',
    obvious: 'Python; JavaScript/JS; Java; C++/CPP/C plus plus; C',
    clever: 'Brainfuck/Brainf*ck',
    uncommon:
      'C#/C Sharp; TypeScript/TS; Ruby; PHP; Swift; Go/Golang; Rust; Kotlin; SQL; R; MATLAB; Perl; Scala; Assembly/ASM; Visual Basic/VB/VB.NET; Objective-C/ObjC; Dart; Lua; Bash/Shell; Haskell; COBOL; Fortran; Pascal; BASIC; Lisp/Common Lisp; Scratch; Julia',
    rare:
      'Elixir; Erlang; Clojure; F#/F Sharp; OCaml; Prolog; Scheme; Racket; Groovy; Delphi; Ada; Smalltalk; Crystal; Nim; Zig; Elm; PowerShell; Solidity; Haxe; Apex; ABAP; Logo; APL; Forth; Tcl; D; V/Vlang; Carbon; Mojo; Simula; ALGOL; PL/I; AWK; Verilog; VHDL; Hack; CoffeeScript; Reason/ReasonML; PureScript; Gleam; Odin; Raku/Perl 6; ActionScript; LabVIEW; GDScript; Wolfram Language/Mathematica; SAS; Stata; Idris; Agda; Coq/Rocq; Lean',
    deep:
      'Befunge; Malbolge; Whitespace; LOLCODE; Piet; Shakespeare Programming Language; Chef; INTERCAL; Ook!; Rockstar; ArnoldC; J; K; Q; BCPL; B; Modula-2/Modula; Oberon; Eiffel; SNOBOL; REXX; JOVIAL; MUMPS; RPG; Io; Factor; Self; Pony; Red; Rebol; Chapel; Fantom; Boo; Mercury; Clean; Miranda',
    outlier: 'Plankalkül/Plankalkul',
  },
  {
    id: 'board-games',
    cat: 'Games',
    text: 'A board game',
    obvious: 'Monopoly; Chess; Scrabble; Checkers/Draughts; Clue/Cluedo; Risk',
    clever: 'Go/Baduk/Weiqi',
    uncommon:
      'Catan/Settlers of Catan; Candy Land; Snakes and Ladders/Chutes and Ladders; Battleship; Sorry!; Trouble; Operation; Guess Who?; Connect Four/Connect 4; The Game of Life/Life; Mouse Trap; Backgammon; Pictionary; Trivial Pursuit; Stratego; Othello/Reversi; Ticket to Ride; Pandemic; Carcassonne; Mahjong/Mah-jongg; Ludo/Parcheesi/Pachisi; Chinese checkers; Mastermind; Balderdash; Axis & Allies; Cranium; Sequence; Hive; Mancala; Shogi; Xiangqi/Chinese chess; Azul; Wingspan; Codenames',
    rare:
      "Terraforming Mars; Gloomhaven; Twilight Imperium; Agricola; Puerto Rico; Power Grid; 7 Wonders/Seven Wonders; Dominion; Splendor; Small World; King of Tokyo; Dixit; Arkham Horror; Betrayal at House on the Hill; Scythe; Spirit Island; Brass/Brass Birmingham; Root; Everdell; Cascadia; Patchwork; Photosynthesis; Blokus; Qwirkle; Tsuro; Kingdomino; Camel Up; Mysterium; Diplomacy; HeroQuest; Mansions of Madness; Eldritch Horror; El Grande; Tigris & Euphrates; Through the Ages; Terra Mystica; Great Western Trail; Concordia; The Castles of Burgundy; Lords of Waterdeep; Viticulture; Nine Men's Morris; Hnefatafl/Tafl; Senet; Royal Game of Ur/Game of Ur; Carrom; Crokinole; Abalone; Quoridor; Onitama; Santorini; Hex",
    deep:
      'Kingmaker; Die Macher; Advanced Squad Leader; Magic Realm; Cosmic Encounter; Dune; Acquire; Ra; Hare and Tortoise; Mehen; Patolli; Alquerque; Chaturanga; Liubo; Surakarta; Arimaa; TwixT; Havannah; YINSH; ZÈRTZ/Zertz; DVONN; GIPF; Mall Madness; Fireball Island; Dark Tower; Mystery Date',
    outlier: 'The Campaign for North Africa',
  },
];
