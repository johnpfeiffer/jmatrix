# Invariants

Invariants are properties that must remain true across all derived artifacts and implementation work.

## INV-001: There are at least 4 sections to the chart (the underlying Eisenhower Matrix concept)

## INV-002: An item has the following required attributes: title, urgent (boolean), important (boolean), createdAt (ISO 8601), modifiedAt (ISO 8601).

## INV-003: CreatedAt is immutable. ModifiedAt changes when an item has been modified.

## INV-004: An item has the following optional attributes: description, due date and due time (stored as ISO 8601 date)

## INV-005: An item has a required attribute of status, it can be marked as exactly one of: "Pending" "In Progress" "Done" "Won't Do"

## INV-006: Items are sorted by the precedence: due date (soonest), state (Done, In Progress, Pending, Won't Do), and finally modifiedAt (latest) as the tie breaker. 

