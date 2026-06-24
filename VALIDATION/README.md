# Validation

Validation artifacts for the MVP are derived from `/KERNEL/`.

## App Checks

Run from `/app`:

```bash
npm test
npm run build
```

Last checked on 2026-06-23:

- `npm test`: 3 test files passed, 14 tests passed.
- `npm run build`: TypeScript and Vite production build passed.

## Coverage Intent

The current high-value tests cover:

- item creation with required attributes and default `Pending` status;
- immutable `createdAt` and updated `modifiedAt`;
- status cycling through the kernel status domain;
- `Done` and `Won't Do` section placement;
- sorting by due date/time, status precedence, then latest `modifiedAt`;
- at least four underlying Eisenhower sections;
- adding an item through the MVP UI.
- hiding the due time picker until a date is selected;
- keeping status edits local until Save.
- highlighting unsaved item edits and allowing Cancel changes;
- default-collapsing completed/cancelled items and multi-item sections;
- rendering shared matrix area labels.
