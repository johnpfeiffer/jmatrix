import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import type { ItemStatus, ItemUpdate, MatrixItem } from "../models/item";
import { cycleStatus, formatDate, formatTimeWithZone } from "../models/item";
import { combineDateAndTime, splitIsoForInputs } from "./dateTime";

interface TaskCardProps {
  item: MatrixItem;
  onSave: (update: ItemUpdate) => void;
  defaultCollapsed: boolean;
}

export function TaskCard({
  item,
  onSave,
  defaultCollapsed,
}: TaskCardProps) {
  const initialDue = useMemo(() => splitIsoForInputs(item.dueAt), [item.dueAt]);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [dueDate, setDueDate] = useState(initialDue.date);
  const [dueTime, setDueTime] = useState(initialDue.time);
  const [urgent, setUrgent] = useState(item.urgent);
  const [important, setImportant] = useState(item.important);
  const [status, setStatus] = useState<ItemStatus>(item.status);
  const [expanded, setExpanded] = useState(!shouldCollapseByDefault(item, defaultCollapsed));

  const draftDueAt = combineDateAndTime(dueDate, dueTime);
  const isDirty =
    title.trim() !== item.title ||
    description.trim() !== (item.description ?? "") ||
    (draftDueAt ?? "") !== (item.dueAt ?? "") ||
    urgent !== item.urgent ||
    important !== item.important ||
    status !== item.status;

  useEffect(() => {
    resetDraft();
    setExpanded(!shouldCollapseByDefault(item, defaultCollapsed));
    // item is the persisted source of truth; reset local draft when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  useEffect(() => {
    if (defaultCollapsed && !isDirty) {
      setExpanded(false);
    }
  }, [defaultCollapsed, isDirty]);

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    onSave({
      title,
      description,
      dueAt: draftDueAt,
      urgent,
      important,
      status,
    });
  }

  function resetDraft() {
    const due = splitIsoForInputs(item.dueAt);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setDueDate(due.date);
    setDueTime(due.time);
    setUrgent(item.urgent);
    setImportant(item.important);
    setStatus(item.status);
  }

  function handleCancelChanges() {
    resetDraft();
  }

  function handleDueDateChange(value: string) {
    setDueDate(value);
    if (!value) {
      setDueTime("");
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 1,
        backgroundColor: "#fffbe6",
        maxHeight: expanded ? 150 : 48,
        overflow: "hidden",
      }}
    >
      <Stack direction="row" alignItems="center" gap={0.5} sx={{ px: 0.75, py: 0.5 }}>
        <IconButton
          size="small"
          aria-label={expanded ? `Collapse ${item.title}` : `Expand ${item.title}`}
          onClick={() => setExpanded((current) => !current)}
        >
          <Typography component="span" aria-hidden="true" sx={{ lineHeight: 1 }}>
            {expanded ? "^" : ">"}
          </Typography>
        </IconButton>
        <Typography
          variant="body2"
          sx={{ flex: 1, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {expanded ? title || item.title : item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
          {formatDate(item.modifiedAt)}
        </Typography>
      </Stack>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0, pb: 1, maxHeight: 82, overflowY: "auto" }}>
          <Stack spacing={0.75}>
            <TextField
              label="Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              size="small"
              required
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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
            {item.dueAt ? (
              <Typography variant="caption" color="text.secondary">
                {formatDate(item.dueAt)} {formatTimeWithZone(item.dueAt)}
              </Typography>
            ) : null}
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              <Tooltip title="Cycle status" describeChild>
                <Chip label={status} onClick={() => setStatus(cycleStatus(status))} size="small" />
              </Tooltip>
              <Tooltip title="Toggle important" describeChild>
                <Chip
                  label={important ? "Important" : "Less important"}
                  onClick={() => setImportant((current) => !current)}
                  color={important ? "primary" : "default"}
                  size="small"
                />
              </Tooltip>
              <Tooltip title="Toggle urgent" describeChild>
                <Chip
                  label={urgent ? "Urgent" : "Less urgent"}
                  onClick={() => setUrgent((current) => !current)}
                  color={urgent ? "secondary" : "default"}
                  size="small"
                />
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between", px: 1, py: 0.5 }}>
          {isDirty ? (
            <Button variant="text" size="small" onClick={handleCancelChanges}>
              Cancel changes
            </Button>
          ) : (
            <Box />
          )}
          <Button
            variant={isDirty ? "contained" : "outlined"}
            color={isDirty ? "error" : "primary"}
            size="small"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
}

function shouldCollapseByDefault(item: MatrixItem, defaultCollapsed: boolean): boolean {
  return defaultCollapsed || isCollapsedStatus(item.status);
}

function isCollapsedStatus(status: ItemStatus): boolean {
  return status === "Done" || status === "Won't Do";
}
