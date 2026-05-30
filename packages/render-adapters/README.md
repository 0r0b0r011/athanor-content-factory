# Render Adapters

Media production backends for asset generation and video assembly.

## Supported backends

| Backend | Use case | Status |
|---------|----------|--------|
| MoneyPrinterTurbo | Short-video assembly (forked) | Planned |
| Higgsfield | Premium cinematic generation | Spec only |
| ffmpeg/MoviePy | Deterministic assembly fallback | Planned |
| TTS providers | Voiceover generation | Planned |
| Image generation | Visual asset creation | Planned |

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
