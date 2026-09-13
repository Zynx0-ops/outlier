import { TIERS, type Answer, type Prompt, type PromptDef } from './types';

export function parsePrompt(def: PromptDef): Prompt {
  const answers: Answer[] = [];
  for (const tier of TIERS) {
    const list = def[tier.id];
    if (!list) continue;
    for (const entry of list.split(';')) {
      const spellings = entry.split('/').map((s) => s.trim()).filter(Boolean);
      if (spellings.length) answers.push({ display: spellings[0], spellings, tier: tier.id });
    }
  }
  const outlier = answers.find((a) => a.tier === 'outlier');
  if (!outlier) throw new Error(`Prompt ${def.id} has no outlier`);
  return { id: def.id, text: def.text, cat: def.cat, hint: def.hint, answers, outlier };
}
