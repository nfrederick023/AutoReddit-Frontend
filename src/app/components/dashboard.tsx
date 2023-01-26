import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, Button, Checkbox, Container, Divider, FormControlLabel, Grid, InputLabel, ListItemText, Paper, Select, SelectChangeEvent, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { BpCheckbox } from './common/styled/styledCheckbox';
import { ChangeEvent, ReactElement, ReactNode } from 'react';
import { CheckboxHookBase, Item, useCheckbox } from 'react-hook-checkbox';
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
    const { data: subreddits } = useGetSubredditListQuery();
    //const [expanded, setExpanded] = useState<string[]>([]);
    const [imgurl, setImageUrl] = useState('');
    const [displayPreview, setDisplayPreview] = useState(true);
    const [checkBoxUtility] = useCheckbox<DetailedSubreddit, string>([]);
    const [isCommentIncluded, setIsCommentIncluded] = useState(true);
    const [postDetails, setPostDetails] = useState<Post>(new Post());
    const sourceText = '[Source](https://www.pixiv.com/kdnikdn/sndndask)';

    const sortSubreddits = (): void => {
        if (!subreddits)
            return;

        // sort by subreddit name
        // subreddits.sort((a, b) => {
        //     const textA = a.name.toLowerCase();
        //     const textB = b.name.toLowerCase();
        //     return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        // });

        // creates matrix of subreddits to add as checkboxes
        const checkedState: CheckboxHookBase<DetailedSubreddit, string>[] = [];
        subreddits.forEach((subreddit) => {
            subreddit.categories.forEach(category => {
                checkedState.push({ itemName: subreddit.name, sectionName: category, itemProperties: { ...subreddit, subredditPostOptions: new SubredditPostOptions() }, sectionProperties: 'hello' });
            });
        });

        checkBoxUtility.createCheckboxHook(checkedState);
    };

    console.log(checkBoxUtility);

    /* Actions */
    useEffect(() => {
        sortSubreddits();
    }, [subreddits]);

    const handleCommentChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setPostDetails({ ...postDetails, comment: event.target.value });
    };

    const handlePostTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setPostDetails({ ...postDetails, title: event.target.value });
    };

    const handlePostTagChange = (event: SelectChangeEvent<Tag[]>): void => {
        setPostDetails({ ...postDetails, tags: event.target.value as Tag[] });
    };

    const handleSubTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subreddit: Item<DetailedSubreddit>): void => {
        subreddit.setProperties({ ...subreddit.properties, subredditPostOptions: { ...subreddit.properties.subredditPostOptions, title: event.target.value } });

    };

    const handleFlairChange = (flair: string, subreddit: Item<DetailedSubreddit>): void => {
        subreddit.setProperties({ ...subreddit.properties, subredditPostOptions: { ...subreddit.properties.subredditPostOptions, flair } });
    };

    const handleTagChange = (event: SelectChangeEvent<Tag[]>, subreddit: Item<DetailedSubreddit>): void => {
        subreddit.setProperties({ ...subreddit.properties, subredditPostOptions: { ...subreddit.properties.subredditPostOptions, tags: event.target.value as Tag[] } });
    };

    const handleImageChange = (file: File | undefined): void => {
        setImageUrl(URL.createObjectURL(file ?? new Blob()));
    };

    // const isAccordionExpanded = (accordionName: string): boolean => {
    //     return expanded?.includes(accordionName);
    // };

    // const handleExpand = (panelName: string): void => {
    //     setExpanded(expanded?.includes(panelName) ? expanded.filter(name => name !== panelName) : [panelName, ...expanded]);
    // };

    const handleDateChange = (date: Dayjs | null): void => {
        date ??= dayjs().add(30, 'minutes');
        setPostDetails({ ...postDetails, date });
    };

    // const handleTagChange = (event: SelectChangeEvent<Tags[]>): void => {
    //   setPostDetails({ ...postDetails, defaultTags: event.target.value as Tags[] });
    // };

    const addSource = (): void => {
        setPostDetails({ ...postDetails, comment: postDetails.comment + sourceText });
    };

    return (
        <>
            {!subreddits?.length ? <Typography>No Subreddits Found.</Typography> : <></>}
            <Button
                onClick={(): void => { checkBoxUtility.addSection({ name: 'kwmew', items: [], properties: 'kwnekwe' }); }}

            >
                nnnnnnnnn
            </Button>
            {checkBoxUtility.sections.map((section) => {
                return (

                    <Container key={section.id} disableGutters >

                        <Button
                            onClick={(): void => { section.addItem({ itemName: 'wdkwbndkw', properties: { name: 'test', notes: [], categories: [], info: { flairs: [], url: '', isNSFW: true, isCrosspostable: false, allowsVideoGifs: true, allowsVideos: true }, subredditPostOptions: new SubredditPostOptions() } }); }}

                        >
                            Add Item
                        </Button>
                        <Button
                            onClick={(): void => { section.setSectionName('jwbewjb'); }}
                        >
                            Renname Section
                        </Button>
                        <Button
                            onClick={(): void => { section.setProperties('ewqewqeq'); }}
                        >
                            Set properties
                        </Button>
                        {section.name}
                        {/* Select All Checkbox */}
                        <TableContainer >
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <DashboardCellHeader width="25%">
                                            <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                                <FormControlLabel
                                                    label="Subreddit"
                                                    sx={{ width: '100%', height: '100%', alignItems: 'end', ml: '-6px' }}
                                                    control={
                                                        <BpCheckbox
                                                            sx={{ pl: 1, pb: '5px' }}
                                                            checked={section.isAllSelected()}
                                                            indeterminate={section.isIndeterminate()}
                                                            onChange={(): void => section.selectAll()}
                                                        />
                                                    }
                                                />
                                            </Box>
                                        </DashboardCellHeader>
                                        <DashboardCellHeader align='right' width="20%">
                                            <Typography>
                                                Flair
                                            </Typography>
                                        </DashboardCellHeader>
                                        <DashboardCellHeader align="right" width="20%">
                                            <Typography>
                                                Tags
                                            </Typography>
                                        </DashboardCellHeader>

                                        <DashboardCellHeader align="right">
                                            <Typography>
                                                Post Title
                                            </Typography>
                                            <Button
                                                onClick={(): void => { section.removeSection(); }}

                                            >
                                                aaaaa
                                            </Button>
                                        </DashboardCellHeader>
                                        <DashboardCellHeader align="right" width="1%" />
                                        <DashboardCellHeader align="right" width="1%" />
                                    </TableRow>
                                </TableHead>
                                <TableBody >

                                    {/* Subreddit Checkbox */}

                                    {/* Subreddit Card */}
                                    {section.items.map((subreddit) => {

                                        return (
                                            <TableRow key={`${section.id}_${subreddit.id}_form`}>

                                                <DashboardCellBody align="right">
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                                        <FormControlLabel
                                                            sx={{ height: '100%', alignItems: 'end', ml: '-6px', mr: '4px' }}
                                                            label={('r/') + subreddit.name}
                                                            control={
                                                                <BpCheckbox
                                                                    sx={{ pl: 1, pb: '5px' }}
                                                                    checked={subreddit.isSelected}
                                                                    onChange={(): void => {
                                                                        subreddit.select();
                                                                    }}
                                                                />
                                                            }
                                                        />
                                                        {subreddit.properties ?
                                                            <Typography color="red" display="inline">
                                                                R18+
                                                            </Typography>
                                                            : <></>
                                                        }
                                                    </Box>
                                                </DashboardCellBody>
                                                <DashboardCellBody align="right">
                                                    {subreddit.properties.info.flairs.length ?
                                                        <Autocomplete
                                                            disableClearable
                                                            options={subreddit.properties.info.flairs.map(flair => flair.name)}
                                                            onChange={(e, value): void => { handleFlairChange(value, subreddit); }}
                                                            renderInput={
                                                                (params): React.ReactNode =>
                                                                    <TextField {...params}
                                                                        variant="standard"
                                                                    />
                                                            }
                                                        />
                                                        :
                                                        <Box
                                                            height="100%"
                                                            justifyContent="flex-end"
                                                            flexDirection="column"
                                                        >
                                                            <Typography>
                                                                N/A
                                                            </Typography>
                                                        </Box>
                                                    }


                                                </DashboardCellBody>
                                                <DashboardCellBody align="right">
                                                    <Select
                                                        sx={{ width: '100%' }}
                                                        multiple
                                                        variant="standard"
                                                        value={subreddit.properties.subredditPostOptions.tags}
                                                        onChange={(event: SelectChangeEvent<Tag[]>): void => { handleTagChange(event, subreddit); }}
                                                        renderValue={(selected): ReactNode => {
                                                            return selected.join(', ');
                                                        }}
                                                    >
                                                        {[Tag.NSFW, Tag.OC, Tag.SPOILER].map((tag) => (
                                                            <MenuItem key={tag} value={tag}>
                                                                <Checkbox checked={subreddit.properties.subredditPostOptions.tags.includes(tag)} />
                                                                <ListItemText primary={tag} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <Button
                                                        onClick={(): void => { subreddit.removeItem(); }}

                                                    >
                                                        aaaaa
                                                    </Button>
                                                </DashboardCellBody>
                                                <DashboardCellBody align="right">

                                                    <TextField
                                                        sx={{ minWidth: '100%', height: '100%' }}
                                                        variant="standard"
                                                        onChange={(event): void => { handleSubTitleChange(event, subreddit); }}
                                                    />

                                                </DashboardCellBody>
                                                <DashboardCellBody align="right">

                                                    {!subreddit.properties.info ?
                                                        <InfoIcon sx={{ position: 'relative', top: '8px' }} />
                                                        : <></>
                                                    }
                                                </DashboardCellBody>
                                                <DashboardCellBody align="right">
                                                    <Link href={`https://www.reddit.com/r/${subreddit.name}`} target="_blank" sx={{ position: 'relative', top: '4px' }}>
                                                        <LinkIcon sx={{ mt: '8px' }} />
                                                    </Link>
                                                </DashboardCellBody>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>

                            </Table>
                        </TableContainer>
                        <Box sx={{ minWidth: '49%' }}></Box>

                    </Container>

                );
            })}
            <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 2 }} />

            {/* Create Post Form */}
            <Box sx={{ marginLeft: '16px', width: 'calc(100% - 16px)' }}>
                <Grid container spacing={{ xs: 2 }} columns={{ xs: 3, md: 12 }}>

                    <Grid item xs={3}  >

                        <Typography>
                            Post Details
                        </Typography>
                    </Grid>
                    <Grid item xs={9}  >

                        <Box sx={{ mb: 3, mr: 3, display: 'inline' }}>
                            <TextField
                                sx={{ width: '67%' }}
                                label="Title"
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                                onChange={(event): void => { handlePostTitleChange(event); }}
                            />
                        </Box>

                        <Box sx={{ display: 'inline-flex', width: '30%' }}>

                            <InputLabel variant="standard" htmlFor="tags-input" sx={{ transform: ' translate(0, -1.5px) scale(0.75)', position: 'absolute' }} >
                                Tags
                            </InputLabel>
                            <Select
                                sx={{ pt: '16px', width: '100%' }}
                                multiple
                                variant="standard"
                                id='tags-input'
                                value={postDetails.tags}
                                onChange={(event: SelectChangeEvent<Tag[]>): void => { handlePostTagChange(event); }}
                                renderValue={(selected): ReactNode => { return selected.join(', '); }}
                            >
                                {[Tag.NSFW, Tag.OC, Tag.SPOILER].map((tag) => (
                                    <MenuItem key={tag} value={tag}>
                                        <Checkbox checked={postDetails.tags.includes(tag)} />
                                        <ListItemText primary={tag} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box sx={{ mb: 3 }} />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={postDetails.date}
                                onChange={(value: Dayjs | null): void => { handleDateChange(value); }}
                                renderInput={(params): ReactElement<TextFieldProps> => <TextField sx={{ width: '48.5%' }} {...params} />}
                            />
                            <Box sx={{ mr: 3, display: 'inline' }} />
                            <TimePicker
                                label="Time"
                                value={postDetails.date}
                                onChange={(value: Dayjs | null): void => { handleDateChange(value); }}
                                renderInput={(params): ReactElement<TextFieldProps> => <TextField sx={{ width: '48.5%' }} {...params} />}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Divider sx={{ width: '100%', marginTop: 2 }} />

                    <Grid item xs={3}  >
                        <Typography>
                            Image
                        </Typography>
                    </Grid>
                    <Grid item xs={9}   >
                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ minHeight: '100%', width: '45%', alignSelf: 'center' }}   >
                                <TextField
                                    sx={{ width: '100%' }}
                                    label="Pixiv Link"
                                    variant="standard"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <FormControlLabel
                                    label="Display Image Preview"
                                    sx={{ alignItems: 'end', ml: '-6px', mt: 1 }}
                                    control={
                                        <BpCheckbox
                                            sx={{ pl: 1, pb: '5px' }}
                                            checked={displayPreview}
                                            onChange={(): void => { setDisplayPreview(!displayPreview); }}
                                        />
                                    }
                                />
                            </Box>
                            <Box width="10%" minHeight="100%" justifyContent="center"
                                alignItems="center" sx={{ display: 'flex', alignContent: 'center' }}>
                                <Divider orientation='vertical' />
                            </Box>
                            <FileUpload
                                sx={{
                                    display: 'inline', width: '45%', border: '1px solid', borderRadius: 1, borderColor: 'rgba(255, 255, 255, 0.09)'
                                }}
                                width='100%'
                                onChange={(event): void => { handleImageChange((event.target as HTMLInputElement).files?.[0] as File); }}
                                onDrop={(event): void => { handleImageChange(event.dataTransfer.files?.[0]); }}
                            />
                        </Box>
                        {imgurl && displayPreview ?
                            <Box sx={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Paper variant="outlined" sx={{ width: '100%', height: '100%', textAlign: 'center' }}>
                                    <img src={imgurl} style={{ maxHeight: '100%' }} />
                                </Paper>
                            </Box>
                            : <></>}
                    </Grid>
                    <Divider sx={{ width: '100%', marginTop: 2 }} />

                    <Grid item xs={3}  >

                        <Typography>
                            Comment
                        </Typography>
                    </Grid>
                    <Grid item xs={9}  >
                        <Box>
                            <TextField
                                sx={{ width: '100%' }}
                                disabled={!isCommentIncluded}
                                multiline
                                rows={4}
                                label="Custom Comment"
                                InputLabelProps={{ shrink: true }}
                                onChange={(event): void => handleCommentChange(event)}
                                value={postDetails.comment}
                            />
                        </Box>
                        <Box sx={{ mt: 1 }}>

                            <Button variant="outlined" onClick={(): void => { addSource(); }} sx={{ width: '30%' }}>Add Source</Button>

                            <Box sx={{ display: 'inline-flex', width: '50%' }}>
                                <FormControlLabel
                                    label="Include Comment"
                                    sx={{ verticalAlign: 'baseline', ml: '6px', mt: 1 }}
                                    control={
                                        <BpCheckbox
                                            checked={isCommentIncluded}
                                            onChange={(): void => { setIsCommentIncluded(!isCommentIncluded); }}
                                        />
                                    }
                                />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Box m='10px'>
                <Box mb='10px'>
                    <form >

                        {/* Submit Button */}
                        <Box
                            height="100%"
                            width="100%"
                            display="flex"
                            justifyContent="end"
                        >
                            <Button variant="outlined" type='submit' sx={{ width: '30%' }}>Create Posts</Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    );
};

export default DashboardPage;
