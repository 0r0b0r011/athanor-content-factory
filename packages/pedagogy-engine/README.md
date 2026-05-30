# Pedagogy Engine

Developmental fit analysis and learning science constraints.

## Inputs

- `00_intent.yaml`
- `01_research_pack.md`

## Output

- `02_developmental_fit.yaml` (validated against `schemas/developmental-fit.schema.json`)

## Responsibilities

1. Map age band to cognitive development stage
2. Enforce language ceiling (vocabulary, sentence structure, complexity)
3. Set working memory limits per age band
4. Define emotional drivers appropriate for the stage
5. Set pacing rules (max scene duration, word counts, ritual frequency)
6. Define humour rules (what's funny at this age)
7. Identify ambiguity tolerance thresholds
8. Block mismatched content

## Blocking rules

Reject content if:
- Abstract concepts lack embodied analogues
- Language exceeds age band ceiling
- Emotional stakes are disproportionate
- Cognitive load exceeds working memory limits
- Content requires abstract reasoning beyond the age band
