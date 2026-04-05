# Atomic Tokens Figma Plugin

Local Figma plugin for moving primitive DTCG tokens between this repository and Figma Variables.

## Files

- `manifest.json` - plugin manifest to import into Figma development plugins
- `code.js` - plugin controller logic
- `ui.html` - plugin UI

## What it supports

- Import primitive DTCG JSON into Figma Variables
- Export Figma Variables as primitive DTCG JSON
- Fetch token JSON from `raw.githubusercontent.com`
- Preserve token descriptions
- Preserve `number` vs `dimension` token type metadata during round-trip
- Preserve alpha in color values such as `#11223344`

## Current limits

- Expects JSON shaped like `../token-pipeline/tokens/primitives.json`
- Exports only the first mode in each Figma variable collection
- Does not generate semantic tokens or PrimeNG `colorScheme.light` / `colorScheme.dark`
- Alias/reference variable values are skipped on export
- Manually created Figma float variables without plugin metadata export as `dimension` tokens with `px` units

## Usage

1. In Figma, open **Plugins -> Development -> Import plugin from manifest...**
2. Select `tools/figma-plugin/manifest.json`
3. Run the plugin
4. To import, either:
   - paste a raw GitHub URL into the URL field and click **Fetch**, or
   - paste DTCG JSON directly into the textarea
5. Click **Import to Figma**
6. To export, click **Export**, copy the JSON, save it to `tools/token-pipeline/tokens/primitives.json`, then run `npm run build:tokens`

## Recommended input shape

The plugin is designed around this repository's primitive token structure:

```json
{
  "color": {
    "brand": {
      "indigo": { "$type": "color", "$value": "#4338CA" }
    }
  },
  "spacing": {
    "md": { "$type": "dimension", "$value": "16px" }
  },
  "borderRadius": {
    "default": { "$type": "dimension", "$value": "6px" }
  }
}
```
