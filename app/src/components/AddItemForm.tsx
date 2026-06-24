import { FormEvent, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { NewItemInput } from "../models/item";
import { combineDateAndTime } from "./dateTime";

interface AddItemFormProps {
  onAdd: (input: NewItemInput) => void;
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(true);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onAdd({
      title,
      description,
      dueAt: combineDateAndTime(dueDate, dueTime),
      urgent,
      important,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setUrgent(false);
    setImportant(true);
  }

  function handleDueDateChange(value: string) {
    setDueDate(value);
    if (!value) {
      setDueTime("");
    }
  }

  return (
    <Box component="form" aria-label="Add item" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h2">Add item</Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          size="small"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={2}
          maxRows={2}
          size="small"
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) => handleDueDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            size="small"
            fullWidth
          />
          {dueDate ? (
            <TextField
              label="Due time"
              type="time"
              value={dueTime}
              onChange={(event) => setDueTime(event.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          ) : null}
        </Stack>
        <Stack>
          <FormControlLabel
            control={
              <Switch
                checked={important}
                onChange={(event) => setImportant(event.target.checked)}
              />
            }
            label="Important"
          />
          <FormControlLabel
            control={
              <Switch checked={urgent} onChange={(event) => setUrgent(event.target.checked)} />
            }
            label="Urgent"
          />
        </Stack>
        <Button type="submit" variant="contained" disabled={!title.trim()}>
          Add
        </Button>
      </Stack>
    </Box>
  );
}
