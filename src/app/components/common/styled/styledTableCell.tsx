import * as React from 'react';
import { TableCell, styled } from '@mui/material';
import { TableCellProps } from '@mui/material';

export const DashboardCellBody = styled((props: TableCellProps) => (
  <DashboardCellHeader sx={{ borderBottom: 'none' }} {...props} />
))(() => ({}));

export const DashboardCellHeader = styled((props: TableCellProps) => (
  <TableCell sx={{ p: 0.5 }} {...props} />
))(() => ({}));

