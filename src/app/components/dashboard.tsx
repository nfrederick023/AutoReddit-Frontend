import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, Button, Checkbox, Container, Divider, FormControlLabel, Grid, InputLabel, ListItemText, Paper, Select, SelectChangeEvent, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { BpCheckbox } from './common/styled/styledCheckbox';
import { ChangeEvent, ReactElement, ReactNode } from 'react';
import { CheckboxConfig, useCheckbox } from 'react-hook-checkbox';
import { DashboardCellBody, DashboardCellHeader } from './common/styled/styledTableCell';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { FileUpload } from '@mui/icons-material';
import { Link } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Subreddit } from '../utils/types';
import { TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { useGetSubredditListQuery } from '../store/services/subredditList';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import dayjs, { Dayjs } from 'dayjs';

enum Tag {
    OC = 'OC',
    SPOILER = 'SPOILER',
    NSFW = 'NSFW'
}

interface DetailedSubreddit extends Subreddit {
    subredditPostOptions: SubredditPostOptions;
}

// selected subreddit options
class SubredditPostOptions {
    public title: string;
    public flair: string;
    public tags: Tag[];

    constructor() {
        this.tags = [];
        this.flair = '';
        this.title = '';
    }
}

// default selected options
class Post {
    public tags: Tag[];
    public comment: string;
    public imageLink: string;
    public date: Dayjs;
    public title: string;

    constructor() {
        this.tags = [];
        this.comment = '';
        this.imageLink = '';
        this.date = dayjs().add(30, 'minutes');
        this.title = '';
    }
}

const DashboardPage: React.FC<Record<string, never>> = () => {

    /* Hooks */

    const [checkBoxUtility] = useCheckbox<string>({});



    console.log(checkBoxUtility);




    return (
        <>

        </>
    );
};

export default DashboardPage;
