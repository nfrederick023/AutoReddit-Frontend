import * as React from 'react';
import { AddSubredditPayload, DeleteSubredditPayload, SubredditCategory } from '../../common/interfaces/subredditListTypes';
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Container, Divider, FormControlLabel, Grid, InputAdornment, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { BpCheckbox } from '../../common/components/styledCheckbox';
import { BpRadio } from '../../common/components/styledRadioButton';
import { StyledAccordion, StyledAccordionDetails, StyledAccordionSummary } from '../../common/components/styledAccordion';
import { useAddSubredditMutation, useDeleteSubredditMutation, useGetSubredditListQuery } from '../../store/services/subredditList';
import { useCheckbox } from '../../common/hooks/useCheckbox';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// to do:
// delete and add while checkboxes selected is broke

const HomePage: React.FC<Record<string, never>> = () => {

   /* Hooks */
   const [addSubreddit, { isLoading: isAddSubredditLoading }] = useAddSubredditMutation();
   const [deleteSubreddit, { isLoading: isDeleteSubredditLoading }] = useDeleteSubredditMutation();
   const { register: addSubredditRegister, handleSubmit: addSubredditHandleSubmit } = useForm<AddSubredditPayload>();
   const { data, refetch, isFetching } = useGetSubredditListQuery();
   const [expanded, setExpanded] = useState<string[]>([]);
   const [loading, setLoading] = useState(true);
   const [checkBoxUtility] = useCheckbox([]);

   /* Functions */
   const addSubredditSubmit = async (data: AddSubredditPayload): Promise<void> => { setLoading(true); await addSubreddit(data); refetch(); };
   const deleteSubredditSubmit = async (data: DeleteSubredditPayload): Promise<void> => { setLoading(true); await deleteSubreddit(data); refetch(); };
   const handleExpand = (panelName: string): void => { setExpanded(expanded?.includes(panelName) ? expanded.filter(name => name !== panelName) : [panelName, ...expanded]); };

   /* Variables */
   const subredditCategories: SubredditCategory[] = data ? data : [];

   /* Actions */
   if (loading === true && !isFetching && !isAddSubredditLoading && !isDeleteSubredditLoading) {
      setLoading(false);
   }

   return (
      <>

         <Stack direction="row" spacing={2} >
            <Typography variant='h6' >
               Subreddits
            </Typography>
         </Stack>

         <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 1 }} />

         {!subredditCategories.length ? <Typography>No Subreddits Found.</Typography> : <></>}

         {subredditCategories.map((category, i) => {
            return (

               <Container key={category.categoryName} disableGutters >

                  <StyledAccordion expanded={!expanded?.includes(category.categoryName)} onChange={(): void => handleExpand(category.categoryName)} >

                     {/* Category Header */}
                     <StyledAccordionSummary id="panel1d-header">
                        <Typography>{category.categoryName}</Typography>
                     </StyledAccordionSummary>

                     {/* Select All Checkbox */}
                     <StyledAccordionDetails>
                        <FormControlLabel
                           label="Select All"
                           control={
                              <BpCheckbox
                                 checked={checkBoxUtility.isAllChecked(i)}
                                 indeterminate={checkBoxUtility.isIndeterminate(i)}
                                 onChange={(): void => checkBoxUtility.checkAll(i)}
                              />
                           }
                        />

                        {/* Subreddit Checkbox */}
                        <Grid container columns={{ xs: 6, sm: 12 }} sx={{ mb: '15px' }}>
                           {category.subreddits.map((subreddit, j) => {
                              return (
                                 <Grid item xs={6} key={subreddit.name + ('_form')} >
                                    <FormControlLabel
                                       label={('r/') + subreddit.name}
                                       control={<BpCheckbox checked={checkBoxUtility.isChecked(i, j)} onChange={(): void => checkBoxUtility.checkOne(i, j)} />}
                                    />
                                 </Grid>
                              );
                           })}
                        </Grid>

                        {checkBoxUtility.isAnyChecked(i) ? <Divider sx={{ w: '100%', mb: 2 }} /> : <></>}

                        {/* Subreddit Card */}
                        <Grid container spacing={{ xs: 2 }} columns={{ xs: 4, md: 12 }} >
                           {category.subreddits.map((subreddit, j) => {

                              return (
                                 checkBoxUtility.isChecked(i, j) ?
                                    <Grid item xs={6} key={subreddit.name + ('_form')} overflow="clip">
                                       <Card variant="outlined" sx={{ minHeight: '100%', minWidth: '100%' }}>
                                          <CardContent>

                                             {/* Name */}
                                             <Box sx={{ display: 'flex', wrap: 'flex-wrap' }}>
                                                <Typography variant="h5" component="div" >
                                                   r/{subreddit.name}
                                                </Typography>
                                                {subreddit.isNSFW ?
                                                   <Typography sx={{ mb: 1.5, pl: '5px' }} color="red">
                                                      R18+
                                                   </Typography>
                                                   : <></>
                                                }
                                             </Box>

                                             <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 2 }} />
                                             {subreddit.flairs.length ?

                                                <>
                                                   {/* Flairs */}
                                                   < RadioGroup
                                                      name="radio-buttons-group"
                                                   >
                                                      {subreddit.flairs.map((flair) => {
                                                         return (
                                                            <FormControlLabel key={flair.id} value={flair.id} control={<BpRadio />} label={flair.name} />
                                                         );
                                                      })
                                                      }

                                                   </RadioGroup>

                                                   <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 2 }} />
                                                </>
                                                : <></>}

                                             {/* Notes */}
                                             <Typography variant="body2">
                                                Notes:   {subreddit.notes}
                                             </Typography>

                                          </CardContent>
                                       </Card>
                                    </Grid>
                                    : <Box key={subreddit.name + ('_form')}></Box>
                              );
                           })}
                           <Box sx={{ minWidth: '49%' }}></Box>
                        </Grid>

                     </StyledAccordionDetails>
                  </StyledAccordion>

               </Container>
            );
         })}
         <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 2 }} />

         {/* Add Subreddit Form */}
         <Box mb='10px'>
            <form onSubmit={addSubredditHandleSubmit(addSubredditSubmit)}>
               <Grid container spacing={{ xs: 2 }} columns={{ xs: 3, md: 12 }}>

                  {/* Subreddit Name */}
                  <Grid item xs={4.5} >
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
                  <Grid item xs={4.5}  >
                     <Box height="100%" width="100%">
                        <Autocomplete
                           freeSolo
                           id="add-category-textfield"
                           options={subredditCategories.map(category => category.categoryName)}
                           renderInput={(params): React.ReactNode => <TextField {...params} variant="standard" label="Category"{...addSubredditRegister('categoryName')} />}
                        />
                     </Box>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={3} >
                     <Box
                        height="100%"
                        width="100%"
                        display="flex"
                        justifyContent="flex-end"
                        flexDirection="column"
                     >
                        <Button variant="outlined" type='submit' >Add Subreddit</Button>
                        {loading ?
                           <CircularProgress />
                           :
                           <></>
                        }
                     </Box>
                  </Grid>
               </Grid>
            </form>
         </Box>

         { }
         <Button
            variant="outlined"
            color="error"
            type='submit'
            disabled={!checkBoxUtility.checkedState.find((i, j) => checkBoxUtility.isAnyChecked(j))}
         >
            Delete Selected Subreddits
         </Button>

         <Divider sx={{ width: '100%', marginBottom: 2, marginTop: 2 }} />
      </>
   );
};

export default HomePage;
