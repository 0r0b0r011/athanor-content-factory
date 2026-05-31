# Open-Source Production Mega-House Stack

**Source:** GitHub starred repos for `0r0b0r011`  
**Fetched:** 603 starred repos  
**Purpose:** Identify the open-source stack that can combine with Athanor Content Factory to create a production media house with interactive tools from STT/TTS to speech-to-speech, research, story genome, rendering, QA, publishing, and feedback.

## Executive verdict

Yes — the starred repo collection already contains enough components to assemble a serious open-source production house.

The stack should not be one monolith. It should be a **layered production lattice**:

```text
Capture / Input
  → STT / Speech Understanding
  → Research + Knowledge Stack
  → Developmental Resonance + Story Genome
  → Agentic Production Orchestration
  → Voice / TTS / Speech-to-Speech
  → Image / Video / Avatar Generation
  → Assembly / Editing / Rendering
  → QA / Safety / Evaluation
  → Publishing / Analytics / Feedback
  → Genome Patch Loop
```

## Recommended stack by layer

### 1. Orchestration / nervous system

**Primary:** `n8n-io/n8n`  
Fair-code visual automation platform with 400+ integrations. Best for production wiring, cron, webhooks, publishing, and notification flows.

**Secondary:** `conductor-oss/conductor`  
Durable event-driven workflow engine. Better fit when jobs must be resumable, observable, and robust.

**Agentic layer:**

- `NousResearch/hermes-agent` — operator/agent runtime
- `langgenius/dify` — productized agent workflow platform
- `langflow-ai/langflow` — visual LLM workflow prototyping
- `simstudioai/sim` — central intelligence layer for AI workforce
- `ComposioHQ/composio` — 1000+ toolkits, auth, workbench for agents

**Athanor role:** the factory emits structured jobs; n8n/Conductor/Hermes execute them.

---

### 2. Research + knowledge stack

**Primary RAG / document processing:**

- `infiniflow/ragflow` — RAG engine with agent capabilities
- `run-llama/llama_index` — document/OCR agent platform
- `PaddlePaddle/PaddleOCR` — OCR for PDFs/images
- `microsoft/markitdown` — office/docs to Markdown
- `adithya-s-k/omniparse` — multimedia/document parsing

**Memory / context:**

- `MemPalace/mempalace`
- `mem0ai/mem0`
- `getzep/graphiti`
- `supermemoryai/supermemory`
- `hindsight` / `vectorize-io/hindsight`

**Athanor role:** build `01_research_pack.md`, maintain source provenance, and feed feedback into genome patches.

---

### 3. STT / audio understanding

**Primary:** `Vaibhavs10/insanely-fast-whisper`  
Fast Whisper-based transcription. Good for batch transcription of raw interviews, lessons, recordings, and creator voice notes.

**Creator studio option:** `abus-aikorea/voice-pro`  
Gradio WebUI combining Whisper processing, TTS, voice cloning, translation, vocal isolation, and YouTube download.

**Ambient/context capture:**

- `screenpipe/screenpipe` — local private capture of what user has seen/said/heard
- `BasedHardware/omi` — listens/sees and suggests actions

**Athanor role:** input mode for raw creator intent, interviews, classrooms, and feedback sessions.

---

### 4. TTS / voice generation / voice cloning

**Primary TTS models:**

- `fishaudio/fish-speech` — SOTA open-source TTS
- `microsoft/VibeVoice` — open-source frontier voice AI
- `OpenBMB/VoxCPM` — multilingual speech generation, creative voice design, cloning
- `neuphonic/neutts` — on-device TTS
- `supertone-inc/supertonic` — fast on-device multilingual TTS via ONNX
- `KittenML/KittenTTS` — small TTS model under 25MB

**Studio tools:**

- `jamiepine/voicebox` — open-source AI voice studio
- `debpalash/OmniVoice-Studio` — ElevenLabs alternative for local cloning/dubbing/dictation
- `abus-aikorea/voice-pro` — all-in-one Gradio studio

**Athanor role:** generate voiceover tracks per character, parent guide, classroom narrator, and audio-first variants.

---

### 5. Speech-to-speech / realtime voice agents

**Primary frameworks:**

- `pipecat-ai/pipecat` — voice + multimodal conversational AI
- `livekit/agents` — realtime voice AI agents
- `TEN-framework/ten-framework` — conversational voice AI agents
- `openai/realtime-voice-component` — UI/component reference for realtime voice

**Athanor role:** interactive story tutor, live classroom companion, parent/teacher Q&A, character-led oral lessons.

Proposed architecture:

```text
Mic input
  → VAD / STT
  → intent + learner state
  → Story Genome / lesson state
  → response planner
  → TTS / voice clone
  → realtime playback
  → transcript + feedback log
```

---

### 6. Image/design generation and creative studio

**Primary local image stack:**

- `AUTOMATIC1111/stable-diffusion-webui` — stable diffusion UI/ecosystem
- `Anil-matcha/Open-Generative-AI` — self-hosted image/video generation studio with many models

**Design / creative tooling:**

- `nexu-io/open-design` — local-first design alternative with skills, design systems, image/video/slides export
- `penpot/penpot` — open-source design tool
- `heygen-com/hyperframes` — write HTML, render video; agent-friendly explainers
- `lightningpixel/modly` — 3D model generation from images

**Athanor role:** generate world bible concept art, symbolic objects, classroom cards, storybook spreads, UI prototypes.

---

### 7. Video generation / avatar generation

**Generation backends:**

- `meituan-longcat/LongCat-Video` — text/image/video-continuation + avatar generation
- `AIDC-AI/Pixelle-Video` — fully automated short video engine
- `Anil-matcha/Open-Generative-AI` — self-hosted generation studio

**Agentic production systems:**

- `HKUDS/ViMax` — agentic video generation: director/screenwriter/producer/generator
- `calesthio/OpenMontage` — agentic video production system; 12 pipelines, 52 tools, 500+ skills
- `Forget-C/Jellyfish` — structured storyboarding, consistency management, shot preparation, video export

**Editing / manipulation:**

- `browser-use/video-use` — edit videos with coding agents
- `mutonby/openshorts` — self-hosted AI video platform for clips/shorts/YouTube studio
- `AIEraDev/Clypra` — Tauri/React/TypeScript video editor

**Athanor role:** render scenes and assemble format-specific outputs from the asset/production manifests.

---

### 8. Assembly / rendering

**Commodity short-video assembly:** `harry0703/MoneyPrinterTurbo`  
Good reference/backend for topic/script → short video, subtitles, BGM, TTS, multi-provider LLM support.

**Avoid as philosophy:** `FujiwaraChoki/MoneyPrinterV2`  
Useful only as scheduler/automation reference. Its "automate money online" posture is the wrong optimization target for children's education.

**Deterministic renderer:** ffmpeg / MoviePy / Hyperframes  
Use for QA-friendly, repeatable classroom explainers and social clips.

**Athanor role:** separate generation from assembly. LongCat generates clips; MoneyPrinterTurbo/ffmpeg/Hyperframes assemble.

---

### 9. QA / safety / evaluation

**Primary eval stack:**

- `promptfoo/promptfoo` — prompt/agent/RAG evaluation, red-teaming, comparisons
- `ifixai-ai/iFixAi` — diagnostics for AI misalignment/fabrication/manipulation
- `Tencent/AI-Infra-Guard` — AI ecosystem red-teaming platform
- `medusa` / AI security scanners — useful for repo/model/plugin safety scans

**Athanor QA engine remains mandatory:**

- learning accuracy
- developmental fit
- cognitive load
- resonance
- ethics
- adult trust
- transmedia coherence

The OSS eval stack checks machinery; Athanor QA checks pedagogical and child-media quality.

---

### 10. Studio / operator interface

**Primary operator dashboards:**

- `open-webui/open-webui` — general AI UI
- `danny-avila/LibreChat` — multi-provider chat/agent UI
- `lobehub/lobehub` — agent operator / scheduling/reporting interface
- `nexu-io/open-design` — design/video/slides workspace
- `paperclipai/paperclip` — managed agents at work
- Hermes workspace / desktop repos from the starred set — useful for Hermes-native control surfaces

**Athanor role:** `apps/studio/` becomes the production control room:

- project DAG
- artifact viewers
- genome editor
- scene timeline
- render queue
- QA gate status
- publish queue
- feedback analytics

---

## Target production-house architecture

```text
[Input Layer]
  Voice note / text brief / PDF / web / classroom recording
       ↓
[Research Layer]
  MarkItDown + PaddleOCR + Omniparse + RAGFlow/LlamaIndex
       ↓
[Athanor Meaning Layer]
  Intent → Research Pack → Developmental Fit → Content Genome → Resonance Spec
       ↓
[Story Layer]
  World Bible → Character Bible → Timeline → Format Plan
       ↓
[Production Layer]
  Asset Manifest → Render Manifest → LongCat / Hyperframes / ffmpeg / MoneyPrinterTurbo
       ↓
[Voice Layer]
  Fish Speech / VibeVoice / VoxCPM / Neutts / Supertonic
       ↓
[Interactive Layer]
  Pipecat / LiveKit Agents / TEN Framework
       ↓
[QA Layer]
  Athanor QA + Promptfoo + iFixAi + AI-Infra-Guard
       ↓
[Publish Layer]
  n8n / Conductor / platform adapters
       ↓
[Feedback Layer]
  Analytics + STT transcripts + parent/teacher comments + replay metrics
       ↓
[Genome Patch]
```

## What to build first

Do not integrate every repo at once. Build the narrow spine:

1. **Athanor schemas + state machine** — already scaffolded
2. **Research pack ingestion** — MarkItDown + RAGFlow/LlamaIndex later
3. **Deterministic renderer** — Hyperframes/ffmpeg first, before GPU model complexity
4. **Voice layer MVP** — Fish Speech or Neutts for TTS; Whisper for STT
5. **Realtime voice prototype** — Pipecat or LiveKit Agents
6. **LongCat adapter** — after render manifests and QA gates exist
7. **n8n publishing workflow** — after QA pass

## Minimal OSS stack v0.1

```yaml
orchestration:
  - n8n
  - hermes-agent

research_ingestion:
  - markitdown
  - paddleocr
  - ragflow_or_llamaindex

stt:
  - insanely-fast-whisper

tts:
  - fish-speech
  - neutts_or_supertonic_for_on_device

speech_to_speech:
  - pipecat
  - livekit_agents

image_design:
  - stable-diffusion-webui
  - open-design

video_generation:
  - longcat-video
  - hyperframes
  - moneyprinterturbo_for_assembly

qa:
  - athanor_qa_engine
  - promptfoo
  - ifixai

ui:
  - athanor_studio
  - open-webui_or_librechat_for_model_ops
```

## Integration principle

Each external repo must be wrapped behind an Athanor adapter. Never let external tools define the factory's creative logic.

Athanor owns:

- developmental fit
- content genome
- resonance strategy
- world/story spec
- QA gates
- feedback patch loop

External tools provide:

- transcription
- generation
- rendering
- publishing
- observability
- interaction surfaces

## Immediate next work items

1. Create adapter manifests for:
   - STT adapter
   - TTS adapter
   - voice-agent adapter
   - video-generation adapter
   - video-assembly adapter
2. Add `docs/longcat-video-adapter-evaluation.md`
3. Add `packages/render-adapters/longcat-video/README.md`
4. Add `docs/open-source-production-megahouse-stack.md`
5. Add `packages/schemas/render-provider.schema.json`
6. Build dry-run adapter command:

```bash
pnpm athanor:render moon-as-timekeeper --backend=longcat --dry-run
```

## Decision

The starred repos can absolutely become the open-source stack for a production content mega-house. The right move is not to copy them wholesale, but to turn them into adapters around Athanor's genome-first production spine.
