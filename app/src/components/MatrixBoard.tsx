import { Box } from "@mui/material";
import type { BoardSection } from "../models/board";
import type { ItemUpdate } from "../models/item";
import { MatrixSection } from "./MatrixSection";

interface MatrixBoardProps {
  sections: BoardSection[];
  onSaveItem: (id: string, update: ItemUpdate) => void;
}

export function MatrixBoard({
  sections,
  onSaveItem,
}: MatrixBoardProps) {
  const matrixSections = sections.slice(0, 4);
  const statusSections = sections.slice(4);

  return (
    <Box sx={{ display: "grid", gap: 1.5 }}>
      <Box
        sx={{
          position: "relative",
          pt: 3.5,
          pr: { xs: 0, md: 4 },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: { xs: 0, md: 4 },
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          Important
        </Box>
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            transformOrigin: "center",
            fontWeight: 700,
          }}
        >
          Urgent
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 1.5,
          }}
        >
          {matrixSections.map((section) => (
            <MatrixSection
              key={section.id}
              section={section}
              onSaveItem={onSaveItem}
              showHeader={false}
            />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 1.5,
        }}
      >
        {statusSections.map((section) => (
          <MatrixSection
            key={section.id}
            section={section}
            onSaveItem={onSaveItem}
            showHeader
          />
        ))}
      </Box>
    </Box>
  );
}
