# LongCat-Video Render Adapter

LongCat-Video is a local/open-source GPU backend for generated educational video clips and avatar segments.

## Role in Athanor

```text
Asset Manifest
  → Render Manifest
  → LongCat Adapter
  → generated scene clip / avatar clip
  → Assembly Adapter (ffmpeg / Hyperframes / MoneyPrinterTurbo)
  → QA Engine
```

LongCat does **generation**, not full production orchestration. It should not own the factory logic.

## Supported capabilities

- `text_to_video`
- `image_to_video`
- `video_continuation`
- `long_video`
- `audio_text_to_avatar_video`
- `audio_image_to_avatar_video`
- `multi_speaker_avatar_video`

## Planned commands

```bash
# Dry-run: produce LongCat command lines but do not render
pnpm athanor:render moon-as-timekeeper --backend=longcat --dry-run

# Render one scene
pnpm athanor:render moon-as-timekeeper --backend=longcat --scene=moonpost-opening

# Render avatar segment from voiceover
pnpm athanor:render moon-as-timekeeper --backend=longcat-avatar --scene=guide-explains-phase-wheel
```

## Input mapping

Each render request is a render job (`packages/schemas/render-job.schema.json`); the provider itself is described by `render-provider.schema.json`.

From Athanor (render job `input`, plus `scene_id` and `safety_profile`):

```yaml
scene_id: moonpost-opening
learning_beat: opening_ritual
prompt: "A warm illustrated village under a calm night sky..."
negative_prompt: "horror, fear, overstimulation, harsh flashing, photoreal child face, low quality"
reference_image: assets/characters/guide.png
voiceover: assets/audio/guide-line-001.wav
resolution: 720p
fps: 25
safety_profile: "6-8"   # an age band; see common.schema.json
```

To LongCat:

- Text-to-video: `run_demo_text_to_video.py`
- Image-to-video: `run_demo_image_to_video.py`
- Video continuation: `run_demo_video_continuation.py`
- Long video: `run_demo_long_video.py`
- Single avatar: `run_demo_avatar_single_audio_to_video.py`
- Multi-speaker avatar: `run_demo_avatar_multi_audio_to_video.py`

## Production wrapper requirements

- Stable output directory per project
- GPU/VRAM capability check
- Render queue lock
- Per-scene metadata capture
- Seed capture
- Prompt/negative prompt capture
- Age-band safety preset
- QA handoff after render
- Error logs stored in project folder

## Not first integration

LongCat depends on CUDA/PyTorch/FlashAttention and large checkpoints. Build deterministic render first, then route LongCat as an optional high-quality backend.
