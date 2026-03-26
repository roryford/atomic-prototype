# Design Tokens

PrimeNG theme configuration using `definePreset()` to override the Aura base theme.

## Files

- **preset.ts** — Custom preset with primitive colors, semantic light/dark schemes, and component-level overrides. Applied globally via `providePrimeNG()` in `app.config.ts`.

## Token Tiers

```
Primitive → Semantic → Component
(raw values)  (intent)   (per-widget overrides)
```

Primitive tokens define the palette. Semantic tokens map intent (primary, surface, text) with light/dark variants via `colorScheme`. Component tokens override specific widget properties.

See [05-token-pipeline](../../docs/05-token-pipeline.md) for the full token pipeline guide including dark mode.
