# 🍸 Gin Tonic Player

[![Angular Version](https://img.shields.io/badge/Angular-v21-DD0031?style=for-the-badge&logo=angular)](https://angular.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Gin Tonic Player** is a high-performance, experimental web audio application built to showcase the cutting-edge capabilities of **Angular v21**. Designed as a technical "sandbox," it explores the synergy between the **Web Audio API** and the modern **Signals-based** reactive paradigm.

The project’s name is a tribute to its core philosophy: a refined, transparent, and powerful combination of a few high-quality "ingredients" working in perfect sync.

---

## 🚀 Key Features & Architectural Highlights

- **Signals-First Reactivity**: Utilizes Angular v21 Signals for state management, eliminating unnecessary change detection cycles and providing a granular, declarative flow for audio metadata and UI states.
- **Web Audio API Implementation**: Bypasses standard HTML5 `<audio>` limitations by using an `AudioContext` to manage gain nodes, analyzers, and audio processing in real-time.
- **Modern Control Flow**: Fully implemented using the new `@if`, `@for`, and `@switch` syntax for cleaner, more performant templates.
- **Standalone Architecture**: A 100% standalone component structure, reducing boilerplate and improving tree-shaking efficiency.
- **Real-time Audio Visualization**: Features a dedicated visualizer component that samples frequency data from the `AnalyserNode` to create dynamic UI feedback.

---

## 🛠 Tech Stack

| Technology         | Purpose                                       |
| :----------------- | :-------------------------------------------- |
| **Angular v21**    | Core Framework (Signals, Zoneless-compatible) |
| **TypeScript 5.x** | Type-safe application logic                   |
| **Web Audio API**  | Low-level audio engine and DSP                |
| **SCSS**           | Modular styling with CSS variables            |
| **Lucide Icons**   | Minimalist iconography for the transport bar  |

---

## 📂 Project Structure

```text
src/app/
├── core/
│   ├── services/
│   │   ├── audio-engine.service.ts   <-- Web Audio API Logic
│   │   └── player-state.service.ts   <-- Signals-based State
├── features/
│   ├── player/                       <-- Main playback controls
│   ├── visualizer/                   <-- Canvas-based frequency bars
│   └── playlist/                     <-- Track management
└── shared/
    └── components/                   <-- Reusable UI atoms
```
