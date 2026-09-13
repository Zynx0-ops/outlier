import './style.css';
import { play } from './mission';
import { report, showTab } from './screens';
import { nav } from './ui';

nav.home = showTab;
nav.play = play;
nav.report = report;

showTab('play');
