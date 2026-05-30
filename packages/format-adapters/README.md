# Format Adapters

Convert the same content genome into multiple product formats.

## Supported formats

| Format | Package | Output type |
|--------|---------|-------------|
| Storybook | `format-adapters/storybook/` | Markdown manuscript |
| Animation script | `format-adapters/animation/` | Scene breakdown + shot list |
| Classroom kit | `format-adapters/classroom/` | Worksheet + activity + teacher guide |
| Parent guide | `format-adapters/parent/` | Discussion prompts + extension ideas |
| Card game | `format-adapters/cards/` | Card text + rules |
| Social clip | `format-adapters/social/` | Short video script |
| App interaction | `format-adapters/app/` | Interaction spec + wireframe desc |
| Song | `format-adapters/song/` | Lyrics + melody notes |

## Design principle

Every format reads from the **same genome**. Changing the genome updates all format outputs. No format-specific ideation — the genome is the single source of creative truth.
