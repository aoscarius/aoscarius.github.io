# Personal Portfolio

A high-performance, interactive portfolio inspired by all days terminal works and embedded systems. This project features a **Data-Driven** architecture where content is strictly decoupled from the rendering logic (as in TEX/HTML approach).

## Key Features
- **Interactive TUI Terminal**: Animated boot sequences with full ASCII Art support and auto-scrolling.
- **Data-Driven Engine**: Projects, skills, and terminal logs are managed via external JSON files for easy maintenance.
- **Performance Optimized**: Zero external dependencies (Vanilla JS/CSS), parallel asynchronous loading, and lightweight footprint.
- **Industrial Aesthetic**: CRT monitor effects including scanlines, text glow, and flickering status indicators.
- **Adaptive UI**: Full support for Dark/Light modes with a seamless toggle system.
- **Secret Easter Eggs**: Secret Easter Eggs from my pop culture.

## Project Structure
- `index.html`: Main entry point and asynchronous rendering engine.
- `style.css`: 
- `/data`:
    - `terminal.json`: Command -sequences and system output for the boot animation.
    - `sections.json`: The database for featured projects, skills, and experience cards.
- `/logic`:
    - `render.js`: Main rendering code to handle content presentation logic.
    - `eeggs.js`: Easter Egg code logic (try it yourself).
- `/style`:
    - `render.css`: Comprehensive design system (Grid, Terminal TUI, CRT Overlays).
    - `eeggs.css`: Easter Egg style, animations and effects (try it yourself).
- `/utils`: (Optional) Python utilities for ASCII-to-JSON conversion.

## Hidden Easter Eggs
Use this key combination or D-pad (on mobile devices) to discover hidden Easter Eggs:

```ini
    DOOM {
        keyb = IDDQD
        dpad = UP UP DOWN DOWN A B
    }
    MORTAL KOMBAT {
        keyb = KOMBAT
        dpad = RIGHT LEFT RIGHT LEFT B A
    }
    MATRIX {
        keyb = MARCO
        dpad = UP RIGHT DOWN LEFT A A
    }
    BTTF {
        keyb = OUTATIME
        dpad = UP UP DOWN RIGHT A B
    }
    GHOSTBUSTER {
        keyb = SLIMER
        dpad = LEFT LEFT UP RIGHT B B
    }
```

## Deployment & Development
No bundlers or compilers required.
1. Clone the repository.
2. Open `index.html` in any modern browser.
3. *Recommended*: Use a "Live Server" extension to preview JSON data changes in real-time.

## Customization
To update your professional profile or terminal logs, simply edit the files within the `/data` directory. The rendering engine will automatically parse the new content upon the next refresh.
