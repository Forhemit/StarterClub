# Feature Development Plugin

A comprehensive, structured workflow for feature development with specialized Gemini agents for codebase exploration, architecture design, and quality review.

## Overview

The Feature Development Plugin provides a systematic 7-phase approach to building new features. It leverages Gemini's reasoning capabilities to guide you through understanding the codebase, designing architecture, and ensuring quality before writing code.

## Command: /feature-dev

Launches a guided feature development workflow with 7 distinct phases.

**Usage:**

```bash
/feature-dev "Add user authentication with OAuth"
```

## The 7-Phase Workflow

### Phase 1: Discovery
**Goal:** Understand what needs to be built.
Gemini clarifies the feature request, identifies constraints, and summarizes the requirements.

### Phase 2: Codebase Exploration
**Goal:** Understand relevant existing code and patterns.
Launches `code-explorer` agents to find similar features and map architecture.

### Phase 3: Clarifying Questions
**Goal:** Fill in gaps and resolve all ambiguities.
Identifies edge cases, error handling needs, or integration points that are undefined.

### Phase 4: Architecture Design
**Goal:** Design multiple implementation approaches.
Launches `code-architect` agents to propose designs (Minimal vs Clean vs Pragmatic) and recommend the best path.

### Phase 5: Implementation
**Goal:** Build the feature.
Gemini implements the chosen architecture, adhering strictly to the patterns discovered.

### Phase 6: Quality Review
**Goal:** Ensure code is simple, DRY, elegant, and functionally correct.
Launches `code-reviewer` agents to check against `GEMINI.md` guidelines.

### Phase 7: Summary
**Goal:** Document accomplishment.
Summarizes changes, key decisions, and next steps.

## Agents

- **`feature-dev`**: The orchestrator. usage: `/feature-dev`
- **`code-explorer`**: Deep dive into code. usage: `@code-explorer "Explain X"`
- **`code-architect`**: Design blueprints. usage: `@code-architect "Design X"`
- **`code-reviewer`**: Check quality. usage: `@code-reviewer "Review X"`

## Setup

Ensure `GEMINI.md` exists in your project root to provide context to the agents.
