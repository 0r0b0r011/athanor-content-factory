# Format Adapters

Convert the same content genome into multiple product formats.

## Supported formats

Format slugs are defined once in `packages/schemas/common.schema.json#/definitions/format`. Each slug maps to one adapter directory.

| Slug | Package | Output type |
|------|---------|-------------|
| `storybook` | `format-adapters/storybook/` | Markdown manuscript |
| `animated-short` | `format-adapters/animated-short/` | Scene breakdown + shot list |
| `classroom-kit` | `format-adapters/classroom-kit/` | Worksheet + activity + teacher guide |
| `parent-guide` | `format-adapters/parent-guide/` | Discussion prompts + extension ideas |
| `card-game` | `format-adapters/card-game/` | Card text + rules |
| `social-clip` | `format-adapters/social-clip/` | Short video script |
| `app-interaction` | `format-adapters/app-interaction/` | Interaction spec + wireframe desc |
| `song` | `format-adapters/song/` | Lyrics + melody notes |

## Design principle

Every format reads from the **same genome**. Changing the genome updates all format outputs. No format-specific ideation — the genome is the single source of creative truth.
