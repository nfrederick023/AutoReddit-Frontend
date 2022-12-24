import * as React from 'react';
import { Autocomplete, Box, Button, Checkbox, Container, Divider, FormControlLabel, Grid, InputAdornment, ListItemText, Select, SelectChangeEvent, Stack, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { BpCheckbox } from '../../common/components/styled/styledCheckbox';
import { DashboardCellBody, DashboardCellHeader } from '../../common/components/styled/styledTableCell';
import { ItemDetailsBase, useCheckbox } from '../../common/hooks/useCheckbox';
import { Link } from '@mui/material';
import { MenuItem } from '@mui/material';
import { ReactNode } from 'react';
import { SelectedSubreddit, Tags } from '../../common/interfaces/home';
import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary } from '../../common/components/styled/styledAccordion';
import { SubredditCategory, SubredditDetails, SubredditInfo } from '../../common/interfaces/subredditList';
import { useAddSubredditMutation, useDeleteSubredditMutation, useGetSubredditListQuery } from '../../store/services/subredditList';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';

const HomePage: React.FC<Record<string, never>> = () => {

  /* Hooks */
  const [addSubreddit, { isLoading: isAddSubredditLoading }] = useAddSubredditMutation();
  const [deleteSubreddit, { isLoading: isDeleteSubredditLoading }] = useDeleteSubredditMutation();
  const { register: addSubredditRegister, handleSubmit: addSubredditHandleSubmit } = useForm<SubredditDetails>();
  const { data, refetch, isFetching } = useGetSubredditListQuery();
  const [sortedSubreddits, setSortedSubreddits] = useState<SubredditCategory[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkBoxUtility] = useCheckbox<SelectedSubreddit>([]);

  /* Functions */
  const addSubredditSubmit = async (data: SubredditDetails): Promise<void> => { setLoading(true); await addSubreddit(data); refetch(); };
  const deleteSubredditSubmit = async (data: SubredditDetails[]): Promise<void> => { setLoading(true); await deleteSubreddit(data); refetch(); };
  const handleExpand = (panelName: string): void => { setExpanded(expanded?.includes(panelName) ? expanded.filter(name => name !== panelName) : [panelName, ...expanded]); };
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

  // toggles off loading spinner when all actions are complete
  if (loading === true && !isFetching && !isAddSubredditLoading && !isDeleteSubredditLoading) {
    setLoading(false);
  }

  return (
    <>
      <Stack direction="row" spacing={2} >
        <Typography variant='h6' >
          Dashboard
        </Typography>
      </Stack>

      <Divider sx={{ width: '100%', marginBottom: 1, marginTop: 1 }} />

      {!sortedSubreddits.length ? <Typography>No Subreddits Found.</Typography> : <></>}

      {checkBoxUtility.getSections().map((section) => {
        return (

          <Container key={section.getName()} disableGutters >
            <StyledAccordion expanded={!expanded?.includes(section.getName())} onChange={(): void => handleExpand(section.getName())} >

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
                                  onChange={(event, value): void => { subreddit.setProperties(subreddit.getProperties().setFlair(value)); }}
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
                                displayEmpty
                                variant="standard"
                                value={subreddit.getProperties().getTags()}
                                onChange={(event: SelectChangeEvent<Tags[]>): void => { const { target: { value }, } = event; subreddit.setProperties(subreddit.getProperties().setTages(value as Tags[])); }}
                                renderValue={(selected): ReactNode => {
                                  if (selected.length === 0) {
                                    return;
                                  }
                                  return selected.join(', ');
                                }}
                              >
                                {[Tags.NSFW, Tags.OC, Tags.SPOILER].map((tag) => (
                                  <MenuItem
                                    key={tag}
                                    value={tag}
                                  >
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
                                onChange={(event): void => { subreddit.setProperties(subreddit.getProperties().setTitle(event.target.value)); }}
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

      {/* Add Subreddit Form */}
      <Box m='10px'>
        <Box mb='10px'>
          <form onSubmit={addSubredditHandleSubmit(addSubredditSubmit)}>
            <Grid container spacing={{ xs: 2 }} columns={{ xs: 3, md: 12 }}>

              {/* Subreddit Name */}
              <Grid item xs={4} >
                <Box height="100%" width="100%">
                  <Autocomplete
                    freeSolo
                    id="add-subreddit-textfield"
                    options={[]}
                    renderInput={(params): React.ReactNode => {
                      params.InputProps.startAdornment = <InputAdornment position="start">r/</InputAdornment>;
                      return (
                        <TextField
                          label="Subreddit"
                          variant="standard"
                          {...params}
                          {...addSubredditRegister('subredditName')}
                        />
                      );
                    }
                    }
                  />
                </Box>
              </Grid>

              {/* Category */}
              <Grid item xs={4}  >
                <Box height="100%" width="100%">
                  <Autocomplete
                    freeSolo
                    id="add-category-textfield"
                    options={data?.map(category => category.categoryName) || []}
                    renderInput={(params): React.ReactNode => <TextField {...params} variant="standard" label="Category"{...addSubredditRegister('categoryName')} />}
                  />
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={4} >
                <Box
                  height="100%"
                  width="100%"
                  display="flex"
                  justifyContent="flex-end"
                  flexDirection="column"
                >
                  <Button variant="outlined" type='submit' >Add Subreddit</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Button
          variant="outlined"
          color="error"
          type='submit'
          disabled={!checkBoxUtility.isAnyItemChecked()}
          onClick={(): void => {
            deleteSubredditSubmit(checkBoxUtility.getSelectedSections().flatMap((selected) => { return selected.getSelectedItems().map((item): SubredditDetails => { return { categoryName: selected.getName(), subredditName: item.getName() }; }); }));
          }}
        >
          Delete Selected Subreddits
        </Button>
      </Box>

      {/* Create Post Form */}
      <Box m='10px'>
        <Box mb='10px'>
          <form onSubmit={addSubredditHandleSubmit(addSubredditSubmit)}>
            <Grid container spacing={{ xs: 2 }} columns={{ xs: 3, md: 12 }}>

              {/* Post Title */}
              <Grid item xs={4}  >
                <Box height="100%" width="100%">
                  <TextField
                    sx={{ width: '100%' }}
                    label="Post Title"
                    variant="standard"
                  />
                </Box>
              </Grid>


              {/* Pixiv Link */}
              <Grid item xs={4}  >
                <Box height="100%" width="100%">
                  <TextField
                    sx={{ width: '100%' }}
                    label="Pixiv Link"
                    variant="standard"
                  />
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={4} >
                <Box
                  height="100%"
                  width="100%"
                  display="flex"
                  justifyContent="flex-end"
                  flexDirection="column"
                >
                  <Button variant="outlined" type='submit' >Create Post(s)</Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
