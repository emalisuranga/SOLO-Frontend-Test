import { styled } from '@mui/material/styles';
import { TableCell, Typography } from '@mui/material';

export const CustomTableCell = styled(TableCell)({
  border: "2px solid black",
  width: "150px",
  padding: "8px",
  boxSizing: "border-box"
});

export const ColoredTableCell = styled(TableCell)({
  border: "2px solid black",
  width: "150px",
  padding: "8px",
  boxSizing: "border-box",
  backgroundColor: "gray",
});

export const VerticalTableCell = styled(TableCell)({
  border: "2px solid black",
  padding: "8px",
  boxSizing: "border-box",
  writingMode: 'vertical-rl',
  textAlign: 'center',
  verticalAlign: 'middle',
  width: "10px",
  backgroundColor: "#739dce"
});

export const SmallTypography = styled(Typography)({
  fontSize: '10px',
});