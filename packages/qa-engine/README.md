# QA Engine

Quality assurance scoring and release gate enforcement.

## Inputs

- All project artifacts

## Output

- `11_qa_report.yaml` (validated against `schemas/qa-report.schema.json`)

## Scoring thresholds

| Dimension | Pass threshold | Auto-block threshold |
|-----------|---------------|---------------------|
| Learning accuracy | ≥90 | <70 |
| Developmental fit | ≥85 | <60 |
| Cognitive load | ≥80 | <60 |
| Resonance | ≥75 | <50 |
| Ethics | ≥95 | <80 |
| Adult trust | ≥85 | <65 |
| Transmedia coherence | ≥80 | <60 |

## Release blocks

The QA engine automatically blocks release if:
- Educational concept is decorative
- Factual error exists in learning content
- Content shames or frightens a child
- Conflict resolution depends on fear
- Social mechanics create winners/losers
- Visual/audio is overstimulating for age band
- Adult watching alongside would be uncomfortable
