
# Changelog

## [2025-03-03] - Feature: Online Multiplayer

### Added
*   **Online PvP Mode**: Implemented remote peer-to-peer multiplayer using PeerJS.
    *   Players can host a room or join via ID.
    *   Syncs moves, skills, and resets in real-time.
*   **Components**: Added `RemoteConnection` UI for managing connections.
*   **Architecture**: Added `usePeerJS` hook to handle WebRTC connection lifecycle.

## [2025-03-03] - Gameplay Update: Independent Cooldowns

### Changed
*   **Cooldown Mechanic**: Each skill now has its own independent cooldown timer.
    *   Previously, using one skill locked all of that player's skills.
    *   Now, using "Thunder" only puts "Thunder" on full cooldown; other skills ("Bomb") continue to tick down normally.
    *   Using a skill counts as a turn, reducing the cooldowns of unused skills.

## [2025-03-03] - Balance Update: Bomb Skill

### Changed
*   **Skill Update**: Replaced Black's "Combo" (连击) skill with **"Bomb" (轰炸)**.
    *   Reason: Combo was too powerful and created unfair instant-win scenarios.
    *   New Skill: "Bomb" destroys all stones in a 3x3 area.
    *   Cooldown: 10 turns.
*   **Visuals**: Added 3x3 area highlight when aiming the Bomb skill.

## [2025-03-03] - New Skills Expansion

### Added
*   **New Black Skill: Combo (连击)** (REMOVED)
*   **New White Skill: Portal (传送)**
    *   Effect: Move an existing stone to a new empty location.
    *   Cooldown: 4 turns.
*   **Board Interaction**: Added visual cursors and helper text for active skills.

## [2025-03-03] - Asymmetric Skills

### Added
*   **Asymmetric Skill System**:
    *   **Black Skill**: "Thunder" (雷击) - Destroys any stone. Cooldown: 5 turns.
    *   **White Skill**: "Convert" (策反) - Converts a Black stone to White. Cooldown: 7 turns.
*   **Cooldown Mechanics**: Skills now have cooldowns that decrement on player moves.
*   **UI Updates**: Separate skill buttons for Black and White with cooldown indicators.

## [2025-03-03] - Modular Refactor

### Changed
*   **Refactor**: Split monolithic `index.tsx` into modular components and hooks.
*   **Structure**: Created `lib`, `components`, `hooks`, and `docs` folders.
*   **Docs**: Added comprehensive Architecture and Readme files.
