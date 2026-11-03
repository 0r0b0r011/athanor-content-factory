# Render Adapters

Media production backends for asset generation and video assembly.

## Supported backends

| Backend | Use case | Status |
|---------|----------|--------|
| MoneyPrinterTurbo | Short-video assembly (forked) | Planned |
| Higgsfield | Premium cinematic generation | Not started |
| ffmpeg/MoviePy | Deterministic assembly fallback | Planned |
| TTS providers | Voiceover generation | Planned |
| Image generation | Visual asset creation | Planned |
| Hyperframes | HTML-to-video deterministic explainers | Planned (Tier 1) |
| LongCat-Video | Local GPU scene/avatar generation | Evaluated, see `longcat-video/` (Tier 2) |

## Contracts

- `packages/schemas/render-provider.schema.json`: what a backend can do (capabilities, limits, licence of code and weights).
- `packages/schemas/render-job.schema.json`: one scene render request and its recorded result (seed, model, cost, output hash).

## Adapter interface

All render adapters conform to:

```python
class RenderAdapter:
    def can_handle(manifest: dict) -> bool
    def render(manifest: dict, assets_dir: str) -> RenderResult
    def estimate_cost(manifest: dict) -> CostEstimate
```

## Pipeline

```
Asset Manifest
  → Scene Assembly (determine order, transitions, timing)
  → Visual Generation (images, video clips)
  → Audio Layer (voiceover, music, SFX)
  → Subtitle Track
  → Composite Render
  → QA Check
  → Export
```
