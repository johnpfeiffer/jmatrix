# Goal

This is a task visualization interactive app called "JMatrix"

## MVP

No external persistence or state - this is a frontend app.

start with an eisenhower matrix where the top right is Urgent and Important
The top half represents "Important"
The bottom half represents "Less Important"

The right half represents "Urgent"
The left half represents "Less Urgent"

A user can add an item from a right side form and button "Add" 
- title
- description (optional)
- due date (optional)
- due time (optional)
- urgent (boolean)
- important (boolean)

(the default state is Pending)

CreatedAt is immutable.

ModifiedAt changes when an item has been modified.

The user can modify any attribute in an item - which is persisted when they click save.

For item attributes that are enums like urgent, important, or status - they are modified by the user clicking and that toggling to the next possible value.


Items that are marked as "Done" go to the bottom right "Completed" area.
Items that are marked as "Won't Do" go to the bottom left "Cancelled" area.

## Design

Minimalist.
Do not add lines, shapes, or text unless it is necessary.

Standards - use as compatible and standard fonts as possible.

Prefer UTF-8 or ASCII art over images.

Use material-ui, light mode.

If there is a date, then it is displayed as the format YYYY-MM-DD , If there is a time, then it is displayed of the format HH:MM (Timezone)

Items in each section are sorted by the following precedence at top: due date (soonest), state, and then modifiedAt (latest) as the tie breaker. 

