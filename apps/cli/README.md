# cfactory — Athanor Content Factory CLI

CLI-driven content factory for the Educational Story Genome pipeline.

## Usage

```bash
# Create a new project
cfactory create moon-as-timekeeper \
  --concept "moon phases as timekeeping" \
  --age-band 6-8 \
  --formats storybook,short-video,classroom-kit

# Build each layer
cfactory build-research-pack projects/moon-as-timekeeper
cfactory build-genome projects/moon-as-timekeeper
cfactory build-resonance projects/moon-as-timekeeper
cfactory build-world projects/moon-as-timekeeper
cfactory build-characters projects/moon-as-timekeeper
cfactory build-timeline projects/moon-as-timekeeper

# Format adaptation
cfactory build-format-plan projects/moon-as-timekeeper
cfactory build-assets projects/moon-as-timekeeper

# Render
cfactory render projects/moon-as-timekeeper --backend moneyprinterturbo
cfactory render projects/moon-as-timekeeper --backend higgsfield

# Quality assurance
cfactory score projects/moon-as-timekeeper

# State machine
cfactory status projects/moon-as-timekeeper
cfactory gate projects/moon-as-timekeeper concept-gate
```

## Commands

| Command | Description |
|---------|-------------|
| `create` | Scaffold a new project directory with intent schema |
| `build-research-pack` | Generate research pack from intent |
| `build-genome` | Build content genome from research + dev fit |
| `build-resonance` | Run resonance scoring |
| `build-world` | Generate world bible |
| `build-characters` | Generate character bible |
| `build-timeline` | Build episode timeline |
| `build-format-plan` | Adapt genome to specific formats |
| `build-assets` | Generate asset manifest |
| `render` | Render media via a backend adapter |
| `score` | Run QA pipeline |
| `gate` | Check a specific greenlight gate |
| `status` | Show current state machine position |
| `publish` | Push to distribution channels |
| `feedback` | Log feedback and patch genome |
