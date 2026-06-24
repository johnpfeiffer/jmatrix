# JMatrix Architecture

JMatrix is a frontend-only MVP. The implementation follows the kernel preference for Domain Driven Design with MVC-style separation: domain rules live in `models`, React state orchestration lives in `controllers`, and Material UI rendering lives in `views` and `components`.

## System Design

```mermaid
flowchart LR
  Kernel["/KERNEL/ invariants and requirements"] --> Spec["/SPEC/ derived specification"]
  Spec --> Models["app/src/models domain rules"]
  Models --> Controllers["app/src/controllers useMatrixItems"]
  Controllers --> Views["app/src/views App"]
  Views --> Components["app/src/components Material UI controls"]
  Components --> User["User"]
  User --> Components
```

## Runtime Flow

```mermaid
sequenceDiagram
  participant User
  participant Form as AddItemForm
  participant Controller as useMatrixItems
  participant Model as item and board models
  participant Board as MatrixBoard

  User->>Form: enters title, due fields, urgency, importance
  Form->>Controller: addItem(input)
  Controller->>Model: createItem(input, now, id)
  Model-->>Controller: Pending item with createdAt and modifiedAt
  Controller->>Model: buildBoardSections(items)
  Model-->>Controller: sorted visible sections
  Controller-->>Board: sections
  Board-->>User: updated matrix
```

## User Journey

```mermaid
flowchart TD
  Start["Open JMatrix"] --> Add["Add title and optional details"]
  Add --> Choose["Set Important and Urgent"]
  Choose --> Submit["Click Add"]
  Submit --> Pending["Item appears as Pending in the matching matrix section"]
  Pending --> Edit["Edit title, description, due date, or due time"]
  Edit --> Dirty["Save turns red and Cancel changes appears"]
  Dirty --> Save["Click Save"]
  Dirty --> Cancel["Click Cancel changes"]
  Pending --> Toggle["Click chips to draft status or urgency/importance"]
  Toggle --> Done{"Status?"}
  Done -->|"Done"| Completed["Completed bottom-right area"]
  Done -->|"Won't Do"| Cancelled["Cancelled bottom-left area"]
  Done -->|"Pending or In Progress"| Matrix["Underlying Eisenhower section"]
```

## Domain Rules

- The board always defines the four underlying Eisenhower sections.
- Items require `title`, `urgent`, `important`, `createdAt`, `modifiedAt`, and `status`.
- Optional item data is `description` and `dueAt`.
- `createdAt` is assigned once and preserved by updates.
- `modifiedAt` changes whenever an item is saved or toggled.
- Item edits, including status, urgency, and importance, stay local to the card until Save.
- Unsaved item edits make Save red and reveal Cancel changes.
- Status cycles through `Pending`, `In Progress`, `Done`, and `Won't Do`.
- Visible sections sort by due date/time soonest first, status precedence, then latest `modifiedAt`.
- Completed and Cancelled sections use distinct light backgrounds, and their items are collapsed by default.
- Sections with multiple items collapse all items by default.
- Expanded items are height-constrained and descriptions show at most two lines.
- The matrix uses shared Important and Urgent area labels rather than repeated quadrant labels.

## Validation

The current validation commands are:

```bash
cd app
npm test
npm run build
```
