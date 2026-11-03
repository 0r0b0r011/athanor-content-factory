# Resonance Engine

The **Developmental Resonance Engine**. Scores and optimises emotional stickiness without manipulation.

## Inputs

- `03_content_genome.yaml`

## Output

- `04_resonance_spec.yaml` (validated against `schemas/resonance-spec.schema.json`)

## Scoring dimensions

| Dimension | What it measures |
|-----------|-----------------|
| Wonder | Does the content inspire curiosity? |
| Mystery | Is there a compelling knowledge gap? |
| Agency | Does the learner feel in control? |
| Competence | Does understanding produce satisfaction? |
| Belonging | Does the content create a shared experience? |
| Ritual | Is there a repeatable behaviour? |
| Symbol density | Are there memorable symbolic anchors? |
| Teach-back value | Can the learner explain it to someone else? |
| Replayability | Would the learner want to revisit? |

## Anti-patterns (must flag)

- Fear-based retention
- FOMO mechanics
- Artificial urgency
- Dark patterns
- Emotional exploitation

## Interface

```python
class ResonanceEngine:
    def score(self, content_genome: dict) -> dict:
        """Return resonance_spec with scores and recommendations."""
        ...
```
