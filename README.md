# jmatrix
Customizable John-Modified Eisenhower Matrix

## App

The MVP lives in `/app`. It is a frontend-only React app using Material UI in light mode. State is kept in memory only.

## Development

```bash
cd app
npm install
npm run dev
```

Open http://localhost:8080.

## Test Locally

```bash
cd app
npm test
npm run build
```

The model layer is in `app/src/models` and holds the domain rules from `/KERNEL/INVARIANTS.md`: item attributes, immutable `createdAt`, modified timestamps, status values, section placement, and sorting.

## Specification

Derived specs are in `/SPEC`. The TLA+ model can be checked from that directory with the command documented in `SPEC/README.md`.
