# Construction Contract Table Implementation Guide

## Packages Used

- `react` - Core React library for component-based UI.
- `@tanstack/react-table` - A powerful headless table utility for handling tabular data.
- `@dnd-kit/core` - Provides drag-and-drop functionality.
- `@dnd-kit/sortable` - Enables sortable list functionality.
- `@dnd-kit/utilities` - Contains utility functions for drag-and-drop operations.
- `@dnd-kit/modifiers` - Provides constraints on drag actions.
- `@/components/ui/table` - Custom table UI components.
- `@/components/ui/input` - Custom input field component.
- `@/components/ui/select` - Custom select dropdown component.
- `@/components/ui/card` - Custom card UI component.
- `@/constant` - Contains initial data constants.
- `@/constants/optionsConstant` - Stores status options for dropdown.

## Implementation Overview

### Data Model
```typescript
export interface Milestone {
  id: string;
  milestone: string;
  plannedDate: string;
  percentComplete: number;
  actualDate: string;
  reward: number;
  cumulativeReward: number;
  variation: number;
  status: StatusEnum;
}
```

### Key Features
- **Dynamic Table Generation**: Uses `@tanstack/react-table` to manage table data.
- **Drag-and-Drop Row Reordering**: Implemented using `@dnd-kit/core`.
- **Data Validation**: Ensures correct date sequences and milestone uniqueness.
- **Automatic Cumulative Reward Calculation**: Computes cumulative reward and variation dynamically.
- **Custom Input Fields**: Uses `@/components/ui/input` for inline editing.
- **Status Selection**: Dropdown for selecting milestone status from predefined options.
- **Live Percentage Validation**: Ensures project percentages sum up to 100%.

### Functional Highlights
1. **Handling Drag End Event**:
   - Uses `arrayMove` utility to reorder rows.
   - Ensures correct milestone order.

2. **Date Validation**:
   - `compareDates` function ensures chronological ordering.
   - Highlights invalid rows.

3. **Row Updates**:
   - `updateRow` function updates specific cell values dynamically.
   - Prevents duplicate milestone names.

4. **Computed Data**:
   - Uses `useMemo` to calculate cumulative rewards efficiently.
   - Updates variations based on previous values.

### Summary
This implementation provides an interactive contract milestone management table with drag-and-drop sorting, inline editing, automatic reward calculations, and data validation. The use of `@tanstack/react-table` and `@dnd-kit` ensures modularity and scalability.

