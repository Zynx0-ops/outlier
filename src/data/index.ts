import { parsePrompt } from '../prompts';
import type { Prompt, PromptDef } from '../types';
import { culture } from './culture';
import { food } from './food';
import { geography } from './geography';
import { misc } from './misc';
import { nature } from './nature';
import { science } from './science';

export const PROMPT_DEFS: PromptDef[] = [...geography, ...science, ...nature, ...food, ...culture, ...misc];

export const PROMPTS: Prompt[] = PROMPT_DEFS.map(parsePrompt);

const byId = new Map(PROMPTS.map((p) => [p.id, p]));

export const promptById = (id: string): Prompt | undefined => byId.get(id);

export const PROMPT_IDS: string[] = PROMPTS.map((p) => p.id);
