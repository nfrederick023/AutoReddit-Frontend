import * as React from 'react';
import { AddSubredditPayload, DeleteSubredditPayload } from '../utils/types';
import { Autocomplete, Box, Button, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { useAddSubredditMutation, useDeleteSubredditMutation, useGetSubredditListQuery } from '../store/services/subredditList';
import { useForm } from 'react-hook-form';

const SubredditsPage: React.FC<Record<string, never>> = () => {
    const { register: addSubredditRegister, handleSubmit: addSubredditHandleSubmit } = useForm<AddSubredditPayload>();
    const [addSubreddit] = useAddSubredditMutation();
    const [deleteSubreddit] = useDeleteSubredditMutation();
    const { data, refetch } = useGetSubredditListQuery();

    const addSubredditSubmit = async (data: AddSubredditPayload): Promise<void> => { await addSubreddit(data); await refetch(); };
    const deleteSubredditSubmit = async (data: DeleteSubredditPayload): Promise<void> => { await deleteSubreddit(data); await refetch(); };

    return (
        <>
            <Box m='10px'>
                <Box mb='10px'>
                    <form onSubmit={(): void => { addSubredditHandleSubmit(addSubredditSubmit); }}>
                        <Grid container spacing={{ xs: 2 }} columns={{ xs: 3, md: 12 }}>

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

                            <Grid item xs={4}  >
                                <Box height="100%" width="100%">
                                    <Autocomplete
                                        freeSolo
                                        id="add-category-textfield"
                                        options={data?.map(category => category.name) || []}
                                        renderInput={(params): React.ReactNode => <TextField {...params} variant="standard" label="Category"{...addSubredditRegister('categoryName')} />}
                                    />
                                </Box>
                            </Grid>

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

                {/* <Button
          variant="outlined"
          color="error"
          type='submit'
          disabled={!checkBoxUtility.isAnyItemChecked()}
          onClick={(): void => {
            deleteSubredditSubmit(checkBoxUtility.getSelectedSections().flatMap((selected) => { return selected.getSelectedItems().map((item): SubredditDetails => { return { categoryName: selected.getName(), subredditName: item.getName() }; }); }));
          }}
        >
          Delete Selected Subreddits
        </Button> */}
            </Box>

            {/* {data?.map(subredditCategory =>
                <>
                    {subredditCategory.name}

                    {subredditCategory.categories.map(subreddit =>
                        <>
                            <Typography>
                                {subreddit.subredditName}
                            </Typography>
                        </>
                    )}
                </>
            )} */}
        </>
    );
};

export default SubredditsPage;
