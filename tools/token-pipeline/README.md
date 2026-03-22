# Token Pipeline Example

Demonstrates the Style Dictionary custom format for generating PrimeNG `definePreset()` output from DTCG tokens.

## Usage
```bash
npm install
npm run build
```

## Output
Generates `output/preset.ts` from `tokens/primitives.json`.

## How It Works
The custom `primeng/definePreset` format in `config.mjs` maps DTCG color tokens to PrimeNG's 3-tier structure.
This is the ~50-100 line custom format referenced in the process docs (doc 03, doc 11).
