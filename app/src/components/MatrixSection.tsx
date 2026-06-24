import { Paper, Stack, Typography } from "@mui/material";
import type { BoardSection } from "../models/board";
import type { ItemUpdate } from "../models/item";
import { TaskCard } from "./TaskCard";

interface MatrixSectionProps {
  section: BoardSection;
  onSaveItem: (id: string, update: ItemUpdate) => void;
  showHeader: boolean;
}

export function MatrixSection({
  section,
  onSaveItem,
  showHeader,
}: MatrixSectionProps) {
  const collapseItemsByDefault =
    section.items.length > 1 || section.id === "completed" || section.id === "cancelled";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        height: { xs: 300, md: 320 },
        borderColor: "divider",
        backgroundColor: sectionBackground(section.id, section.items.length > 0),
        display: "flex",
        flexDirection: "column",
      }}
      role="region"
      aria-label={`${section.title} ${section.subtitle}`}
    >
      <Stack spacing={1.25} sx={{ minHeight: 0, flex: 1 }}>
        {showHeader ? (
          <Stack direction="row" justifyContent="space-between" gap={1}>
            <Typography variant="h2">{section.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {section.subtitle}
            </Typography>
          </Stack>
        ) : null}
        <Stack spacing={1} sx={{ minHeight: 0, overflowY: "auto", pr: 0.5 }}>
          {section.items.map((item) => (
            <TaskCard
              key={item.id}
              item={item}
              onSave={(update) => onSaveItem(item.id, update)}
              defaultCollapsed={collapseItemsByDefault}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function sectionBackground(sectionId: BoardSection["id"], hasItems: boolean): string {
  if (sectionId === "completed") {
    return "#e7f4ea";
  }

  if (sectionId === "cancelled") {
    return "#eeeeee";
  }

  return hasItems ? "background.paper" : "rgba(255,255,255,0.64)";
}
