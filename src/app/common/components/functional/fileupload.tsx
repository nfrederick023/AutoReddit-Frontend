/**
 * Credit:
 * https://codesandbox.io/s/lgqwn?file=/src/FileUpload/FileUpload.tsx:138-150
 */

import { Box, SxProps, Theme, Typography, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';

export type FileUploadProps = {
  imageButton?: boolean
  hoverLabel?: string
  dropLabel?: string
  width?: string
  height?: string
  sx?: SxProps<Theme>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
}


const FileUploadInput = styled('input')({
  display: 'none'
});

const FileUploadLabel = styled('label')({
  cursor: 'pointer',
  textAlign: 'center',
  display: 'flex',
  '&:hover p,&:hover svg,& img': {
    opacity: 1,
  },
  '& p, svg': {
    opacity: 0.6,
  },
  '&:hover img': {
    opacity: 0.3,
  },
});

const onDragOver = {
  '& img': {
    opacity: 0.3,
  },
  '& p, svg': {
    opacity: 1,
  }
};


export const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps) => {
  const imageButton = props.imageButton ?? false;
  const hoverLabel = props.hoverLabel ?? 'Click or drag to upload file';
  const dropLabel = props.dropLabel ?? 'Drop file here';
  const width = props.width ?? '600px';
  const height = props.height ?? '100px';
  const sx = props.sx;

  const [labelText, setLabelText] = React.useState<string>(hoverLabel);
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false);
  const stopDefaults = (e: React.DragEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  };
  const dragEvents = {
    onMouseEnter: (): void => {
      setIsMouseOver(true);
    },
    onMouseLeave: (): void => {
      setIsMouseOver(false);
    },
    onDragEnter: (e: React.DragEvent): void => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e: React.DragEvent): void => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>): void => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);
      props.onDrop(e);
    },
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    props.onChange(event);
  };

  return (
    <Box sx={sx}>
      <FileUploadInput
        onChange={handleChange}
        id="file-upload"
        type="file"
      />

      <FileUploadLabel
        htmlFor="file-upload"
        sx={isDragOver ? onDragOver : {}}
        {...dragEvents}
      >
        <Box
          width={width}
          height={height}

        >
          {(!imageButton || isDragOver || isMouseOver) && (
            <>
              <Box
                height={height}
                width={width}
                sx={{ pointerEvents: 'none', alignContent: 'center', justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}

              >
                <CloudUploadIcon fontSize="large" />
                <Typography width="100%">{labelText}</Typography>
              </Box>
            </>
          )}
        </Box>
      </FileUploadLabel>
    </Box>
  );
};
