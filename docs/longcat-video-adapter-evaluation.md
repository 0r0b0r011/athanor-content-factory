# LongCat-Video Adapter Evaluation

**Repo:** https://github.com/meituan-longcat/LongCat-Video  
**Stars at evaluation:** 3,300  
**Primary language:** Python  
**License:** MIT in `LICENSE` and README, although GitHub metadata did not detect SPDX.  
**Evaluated for:** Athanor Content Factory render-adapter layer

## Verdict

**Yes — LongCat-Video is a strong addition, but only as a GPU render adapter, not as the core factory.**

It fits the factory as a local/open-source generation backend for:

- Text-to-video
- Image-to-video
- Video continuation
- Long video generation
- Audio-driven avatar video
- Multi-speaker avatar video

It should sit beside, not replace:

- MoneyPrinterTurbo — assembly/orchestration backend
- Higgsfield — premium hosted cinematic backend
- ffmpeg/MoviePy — deterministic local compositor
- Hyperframes — HTML-to-video renderer for agent-produced explainers
- OpenMontage / Jellyfish / ViMax — agentic video production workflow references

## Why it matters

LongCat-Video fills a different slot from MoneyPrinterTurbo.

| Layer | MoneyPrinterTurbo | LongCat-Video |
|---|---|---|
| Role | Assembly pipeline | Generative video model |
| Input | Topic/script/materials | Text, image, video, audio, avatar inputs |
| Output | Short video with subtitles/BGM/TTS | Generated visual motion/video clips |
| Strength | Fast commodity social-video production | Open model backend for generated scenes |
| Weakness | Generic stock-video slop if used naively | Heavy GPU requirements, research-code ergonomics |

The right architecture:

```text
Athanor Content Genome
  → Scene / Asset Manifest
  → Render Router
    → LongCat-Video for generated scene clips / avatar segments
    → MoneyPrinterTurbo or ffmpeg for assembly
    → QA / Safety / Pedagogy gate
```

## Capabilities observed

From README and repository inspection:

### Foundational video model

- 13.6B parameter video generation model
- Text-to-video
- Image-to-video
- Video continuation
- Long-video generation
- 720p / 30fps target
- Coarse-to-fine temporal/spatial generation
- Block Sparse Attention for efficiency
- Multi-reward GRPO training

### Avatar model

LongCat-Video-Avatar 1.5 adds:

- Audio-driven human video generation
- Audio-text-to-video
- Audio-image-to-video
- Single-stream and multi-stream audio
- Whisper-large-v3 audio encoder for lip sync
- Distillation mode for faster inference
- INT8 quantized DiT support
- Multi-segment video continuation
- Better stylized-domain generalization: anime, animals, complex real-world conditions

### Demo entrypoints

- `run_demo_text_to_video.py`
- `run_demo_image_to_video.py`
- `run_demo_video_continuation.py`
- `run_demo_long_video.py`
- `run_demo_interactive_video.py`
- `run_demo_avatar_single_audio_to_video.py`
- `run_demo_avatar_multi_audio_to_video.py`
- `run_streamlit.py`

## Integration fit for Athanor

### Best Athanor use cases

1. **Educational explainer B-roll**
   - Generate gentle visual motion for science/math concepts
   - Example: moonlight moving across a phase wheel, constellation sky, plant growth time-lapse

2. **Character / guide avatar segments**
   - A recurring world character explains or asks questions
   - Works with the Story Genome's character bible

3. **Video continuation**
   - Maintain visual continuity across a longer scene
   - Useful for story-world consistency

4. **Long-form classroom display video**
   - Longer segments where stable temporal continuity matters

5. **Speech-to-avatar output**
   - Pair TTS voice track with LongCat Avatar to create an in-world guide

## Adapter contract

Create this adapter under:

```text
packages/render-adapters/longcat-video/
```

Proposed interface (now split into `render-provider.schema.json` for capabilities and `render-job.schema.json` for per-scene input/output):

```yaml
video_provider:
  name: longcat-video
  mode: local_gpu
  capabilities:
    - text_to_video
    - image_to_video
    - video_continuation
    - long_video
    - audio_text_to_avatar_video
    - audio_image_to_avatar_video
    - multi_speaker_avatar_video
  input:
    scene_id: string
    prompt: string
    negative_prompt: string
    reference_image: optional path
    reference_video: optional path
    audio_tracks: optional list[path]
    speaker_layout: optional object
    duration_seconds: number
    aspect_ratio: string
    resolution: 480p | 720p
    fps: 16 | 25 | 30
    safety_profile: age band, e.g. "6-8" | "9-12" | "13-15"
  output:
    artifact_path: path
    metadata_path: path
    render_log_path: path
    seed: integer
    cost:
      gpu_seconds: number
      vram_gb_estimate: number
```

## Required wrapper work

The repo is demo-oriented. Athanor needs a production wrapper that adds:

1. **Manifest input**
   - Read `09_asset_manifest.yaml` / `10_production_manifest.yaml`
   - Generate per-scene JSON inputs for LongCat

2. **Stable output paths**
   - Avoid ad-hoc demo outputs
   - Write to `projects/{id}/renders/longcat/{scene_id}.mp4`

3. **Queue and resource control**
   - One GPU render at a time unless explicitly distributed
   - Track VRAM assumptions and expected duration

4. **Safety presets**
   - Default negative prompts per age band
   - No overstimulation, no horror/nightmare imagery, no realistic child identity misuse

5. **Render metadata**
   - Save prompt, seed, model, checkpoint, resolution, duration, source assets

6. **QA handoff**
   - Automatically queue rendered clips for `qa-engine`

## Risks / caveats

### 1. Heavy GPU requirements

This is not a lightweight local renderer. It uses PyTorch 2.6, CUDA 12.4, FlashAttention, bfloat16, and multi-GPU context parallelism for some paths.

Risk: not suitable for casual Mac-local generation unless routed to a GPU node, RunPod/Modal, or a local CUDA workstation.

### 2. Research-code ergonomics

The repo is structured around demo scripts, not a stable server API. It needs wrapping before it becomes a production adapter.

### 3. Safety and child-media constraints are external

The model card explicitly states downstream developers must assess safety/fairness. Athanor's QA and ethics gates must wrap this model tightly.

### 4. Avatar misuse risk

Audio-driven avatar generation requires clear consent and identity policy. For children's education, the preferred use is fictional/illustrated recurring characters, not real child avatars.

## Recommendation

Add LongCat as a **Tier-2 local GPU generation backend**:

- **Tier 1 default render:** ffmpeg/MoviePy/Hyperframes for deterministic explainers
- **Tier 2 local GPU gen:** LongCat-Video for generated clips and avatars
- **Tier 3 hosted premium:** Higgsfield / Runway / Kling / Veo-style adapters
- **Assembly layer:** MoneyPrinterTurbo or OpenMontage-style pipeline

Do not integrate it first. First build the manifest contract, QA gates, and deterministic renderer. Then add LongCat behind the same adapter interface.

## Immediate implementation plan

1. Create `packages/render-adapters/longcat-video/README.md`
2. Define `longcat-render-manifest.schema.json`
3. Write a dry-run adapter that converts Athanor scene manifests into LongCat command lines
4. Add GPU capability check command
5. Add queue integration
6. Add render metadata capture
7. Add QA handoff

## Decision

**Adopt as adapter candidate. Do not make it the factory core.**
