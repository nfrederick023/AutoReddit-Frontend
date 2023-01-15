import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, Button, Checkbox, Container, Divider, FormControlLabel, Grid, InputAdornment, InputLabel, ListItemText, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { BpCheckbox } from '../../common/components/styled/styledCheckbox';
import { ChangeEvent, Dispatch, ReactElement, ReactNode, SetStateAction } from 'react';
import { CreatePost } from '../../common/interfaces/createPost';
import { DashboardCellBody, DashboardCellHeader } from '../../common/components/styled/styledTableCell';
import { DatePicker, DateTimePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { FileUpload } from '../../common/components/functional/fileupload';
import { Flair, SubredditCategory, SubredditDetails, SubredditInfo } from '../../common/interfaces/subredditList';
import { Item, ItemDetailsBase, useCheckbox } from '../../common/hooks/useCheckbox';
import { Link } from '@mui/material';
import { MenuItem } from '@mui/material';
import { SelectedSubreddit, Tags } from '../../common/interfaces/dashboard';
import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary } from '../../common/components/styled/styledAccordion';
import { TextFieldProps } from '@mui/material';
import { debounce } from 'lodash'; import { useAddSubredditMutation, useDeleteSubredditMutation, useGetSubredditListQuery } from '../../store/services/subredditList';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import dayjs, { Dayjs } from 'dayjs';

const DashboardPage: React.FC<Record<string, never>> = () => {

  /* Hooks */
  const { data, refetch, isFetching } = useGetSubredditListQuery();
  const [sortedSubreddits, setSortedSubreddits] = useState<SubredditCategory[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [imgurl, setImageUrl] = useState('');
  const [displayPreview, setDisplayPreview] = useState(true);
  const [checkBoxUtility] = useCheckbox<SelectedSubreddit>([]);
  const [isCommentIncluded, setIsCommentIncluded] = useState(true);
  const [isSourceIncludeded, setIsSourceIncluded] = useState(true);
  const [createPost, setCreatePost] = useState<CreatePost>(new CreatePost());

  const sourceText = '[Source](https://www.pixiv.com/kdnikdn/sndndask)';

  /* Functions */
  const createSelectedSubreddit = (subreddit: SubredditInfo): SelectedSubreddit => { return new SelectedSubreddit(subreddit); };

  const sortSubreddits = (): void => {
    const sortedData: SubredditCategory[] | undefined = structuredClone(data);
    if (!sortedData)
      return;

    // sorts categories
    sortedData.sort((a, b) => {
      const textA = a.categoryName.toUpperCase();
      const textB = b.categoryName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    // sorts subreddits
    sortedData.forEach(category => {
      category.subreddits = Object.values(category.subreddits || []).sort((a, b) => {
        const textA = a.subredditName.toUpperCase();
        const textB = b.subredditName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
    });

    // creates matrix of subreddits to add as checkboxes
    const checkedState: ItemDetailsBase<SelectedSubreddit>[] = [];
    sortedData.forEach((category) => {
      category.subreddits.forEach((subreddit) => {
        checkedState.push({ name: subreddit.subredditName, section: category.categoryName, properties: createSelectedSubreddit(subreddit) });
      });
    });

    checkBoxUtility.setUtility(checkedState);
    setSortedSubreddits(sortedData);
  };

  /* Actions */
  useEffect(() => {
    sortSubreddits();
  }, [data]);

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setCreatePost({ ...createPost, comment: event.target.value });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setCreatePost({ ...createPost, defaultTitle: event.target.value });
  };

  const handleSubTitleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, subreddit: Item<SelectedSubreddit>): void => {
    subreddit.setProperties(subreddit.getProperties().setTitle(event.target.value));
  };

  const handleFlairChange = (flair: string, subreddit: Item<SelectedSubreddit>): void => {
    subreddit.setProperties(subreddit.getProperties().setFlair(flair));
  };

  const handleImageChange = (file: File | undefined): void => {
    setImageUrl(URL.createObjectURL(file ?? new Blob()));
  };

  const isAccordionExpanded = (accordionName: string): boolean => {
    return expanded?.includes(accordionName);
  };

  const handleExpand = (panelName: string): void => {
    setExpanded(expanded?.includes(panelName) ? expanded.filter(name => name !== panelName) : [panelName, ...expanded]);
  };

  const handleDateChange = (date: Dayjs | null): void => {
    date ??= dayjs().add(30, 'minutes');
    setCreatePost({ ...createPost, date });
  };

  const handleTagChange = (event: SelectChangeEvent<Tags[]>): void => {
    setCreatePost({ ...createPost, defaultTags: event.target.value as Tags[] });
  };

  const addSource = (): void => {
    setCreatePost({ ...createPost, comment: createPost.comment + sourceText });
  };

  return (
    <>
      {!sortedSubreddits.length ? <Typography>No Subreddits Found.</Typography> : <></>}

      {checkBoxUtility.getSections().map((section) => {
        return (

          <Container key={section.getName()} disableGutters >
            <StyledAccordion
              expanded={isAccordionExpanded(section.getName())}
              onChange={(): void => handleExpand(section.getName())} >

              {/* Category Header */}
              <StyledAccordionSummary id="panel1d-header">
                <Typography>{section.getName()}</Typography>
              </StyledAccordionSummary>

              {/* Select All Checkbox */}
              <StyledAccordionDetails >
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
                        </DashboardCellHeader>
                        <DashboardCellHeader align="right" width="1%" />
                        <DashboardCellHeader align="right" width="1%" />
                      </TableRow>
                    </TableHead>
                    <TableBody >


                      {/* Subreddit Checkbox */}

                      {/* Subreddit Card */}
                      {section.getItems().map((subreddit) => {

                        return (
                          <TableRow key={`${section.getName()}_${subreddit.getName()}_form`}>

                            <DashboardCellBody align="right">
                              <Box sx={{ display: 'flex', alignItems: 'center' }} >
                                <FormControlLabel
                                  sx={{ height: '100%', alignItems: 'end', ml: '-6px', mr: '4px' }}
                                  label={('r/') + subreddit.getName()}
                                  control={
                                    <BpCheckbox
                                      sx={{ pl: 1, pb: '5px' }}
                                      checked={subreddit.getIsSelected()}
                                      onChange={(): void => {
                                        subreddit.selectItem();
                                      }}
                                    />
                                  }
                                />
                                {subreddit.getProperties().getInfo().isNSFW ?
                                  <Typography color="red" display="inline">
                                    R18+
                                  </Typography>
                                  : <></>
                                }
                              </Box>
                            </DashboardCellBody>
                            <DashboardCellBody align="right">
                              {subreddit.getProperties().getInfo().flairs.length ?
                                <Autocomplete
                                  disableClearable
                                  options={subreddit.getProperties().getInfo().flairs.map(flair => flair.name)}
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
                                value={subreddit.getProperties().getTags()}
                                onChange={(event: SelectChangeEvent<Tags[]>): void => { const { target: { value }, } = event; subreddit.setProperties(subreddit.getProperties().setTages(value as Tags[])); }}
                                renderValue={(selected): ReactNode => {
                                  return selected.join(', ');
                                }}
                              >
                                {[Tags.NSFW, Tags.OC, Tags.SPOILER].map((tag) => (
                                  <MenuItem key={tag} value={tag}>
                                    <Checkbox checked={subreddit.getProperties().getTags().includes(tag)} />
                                    <ListItemText primary={tag} />
                                  </MenuItem>
                                ))}
                              </Select>

                            </DashboardCellBody>
                            <DashboardCellBody align="right">

                              <TextField
                                sx={{ minWidth: '100%', height: '100%' }}
                                variant="standard"
                                onChange={(event): void => { handleSubTitleChange(event, subreddit); }}
                              />

                            </DashboardCellBody>
                            <DashboardCellBody align="right">

                              {!subreddit.getProperties().getInfo().notes.length ?
                                <InfoIcon sx={{ position: 'relative', top: '8px' }} />
                                : <></>
                              }
                            </DashboardCellBody>
                            <DashboardCellBody align="right">
                              <Link href={`https://www.reddit.com/r/${subreddit.getName()}`} target="_blank" sx={{ position: 'relative', top: '4px' }}>
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

              </StyledAccordionDetails>

            </StyledAccordion>

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
                onChange={(event): void => { handleTitleChange(event); }}
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
                value={createPost.defaultTags}
                onChange={(event: SelectChangeEvent<Tags[]>): void => { handleTagChange(event); }}
                renderValue={(selected): ReactNode => { return selected.join(', '); }}
              >
                {[Tags.NSFW, Tags.OC, Tags.SPOILER].map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    <Checkbox checked={createPost.defaultTags.includes(tag)} />
                    <ListItemText primary={tag} />
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <Box sx={{ mb: 3 }} />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={createPost.date}
                onChange={(value): void => { handleDateChange(value); }}
                renderInput={(params): ReactElement<TextFieldProps> => <TextField sx={{ width: '48.5%' }} {...params} />}
              />
              <Box sx={{ mr: 3, display: 'inline' }} />
              <TimePicker
                label="Time"
                value={createPost.date}
                onChange={(value): void => { handleDateChange(value); }}
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
                onChange={(event): void => { handleImageChange(event.target.files?.[0]); }}
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
                value={createPost.comment}
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
