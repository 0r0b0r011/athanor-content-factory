# Genome Engine

The **Educational Story Genome** builder. Transforms a research pack and developmental fit profile into the canonical `content_genome.yaml`.

## Inputs

- `01_research_pack.md`
- `02_developmental_fit.yaml`
- `00_intent.yaml`

## Output

- `03_content_genome.yaml` (validated against `schemas/content-genome.schema.json`)

## Responsibilities

1. Synthesise research into structured learner, knowledge, resonance, narrative, and format DNA
2. Ensure every learning objective has a corresponding narrative beat
3. Verify that misconceptions are explicitly addressed
4. Generate teach-back moments and transfer tasks
5. Assign age-appropriate symbolic objects and rituals

## Interface

```python
class GenomeEngine:
    def build(research_pack: dict, dev_fit: dict) -> dict:
        """Return a validated content_genome dict."""
        ...
```

## Greenlight check

The genome gate passes only if:
- Knowledge is causal to story
- Developmental fit is explicit
- Symbolic object exists
- Teach-back moment exists
- Ritual exists
