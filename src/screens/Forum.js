import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import Layout from '../components/Layout';
import {
    Button,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon,
    ListItemSecondaryAction,
    withStyles
} from '@material-ui/core';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Send from '@material-ui/icons/Send';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import CreateForumPost from '../components/forms/CreateForumPost';

const styles = theme => ({
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    },
    post: {
        backgroundColor: 'white',
        margin: theme.spacing.unit,
    },
    nested: {
        paddingLeft: 4 * theme.spacing.unit,
    },
});

const Forum = ({ postsQuery, createPostMutation, classes, addCommentMutation }) => {
    const [expandedPost, setExpandedPost] = useState(null);
    const [comment, setComment] = useState('');
    const [newPostForm, setNewPostForm] = useState(false);
    const [createPostLoading, setCreatePostLoading] = useState(false);
    const [createCommentLoading, setCreateCommentLoading] = useState(false);
    return (
        <Layout title="Forum">
            {postsQuery.loading ? (
                <div style={{ margin: '10px' }}>
                    <CircularProgress />
                </div>
            ): null}
            {postsQuery.error ? (
                <SnackbarContent
                    className={classes.errorMessage}
                    message="Načtení se nezdařilo"
                />
            ) : null}
            {newPostForm ? (
                <CreateForumPost
                    onClose={() => setNewPostForm(false)}
                    onSubmit={(values) => {
                        setCreatePostLoading(true);
                        createPostMutation({
                            variables: values,
                        })
                            .then(() =>postsQuery.refetch())
                            .then(() => {
                                setNewPostForm(false);
                            })
                    }}
                    loading={createPostLoading}
                />
            ): (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setNewPostForm(true);
                    }}
                    style={{ marginLeft: '20px' }}
                >
                    Nový příspěvek
                </Button>
            )}
            <List>
                {map((post) => (
                    <div key={post.id} className={classes.post}>
                        <ListItem
                            button
                            onClick={() => {
                                setExpandedPost(expandedPost === post.id ?  null : post.id);
                                setComment('');
                            }}
                        >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>
                            <ListItemText
                                primary={post.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography>
                                            {post.text}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                        >
                                            {`${path(['author', 'firstname'])(post)} ${path(['author', 'lastname'])(post)} (${moment(post.createdAt).format('L LT')})`}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider />
                        <Collapse in={post.id === expandedPost} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setCreateCommentLoading(true);
                                        addCommentMutation({
                                            variables: {
                                                text: comment,
                                                postId: expandedPost,
                                            }
                                        }).then(() => {
                                            setComment('');
                                            setCreateCommentLoading(false);
                                        });
                                    }}
                                >
                                    <ListItem className={classes.nested}>
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText>
                                            <Input
                                                id="comment"
                                                name="comment"
                                                autoComplete="off"
                                                autoFocus
                                                value={comment}
                                                fullWidth
                                                onChange={(e) => setComment(e.target.value)}
                                                disabled={createCommentLoading}
                                            />
                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                type="submit"
                                                aria-label="comments"
                                                disabled={createCommentLoading}
                                            >
                                                {createCommentLoading ? <CircularProgress /> : <Send />}
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </form>
                                {map((comment) => (
                                    <React.Fragment key={comment.id}>
                                        <ListItem className={classes.nested}>
                                            <ListItemIcon>
                                                <AccountCircle />
                                            </ListItemIcon>
                                            <ListItemText
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography>
                                                            {comment.text}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                        >
                                                            {`${path(['author', 'firstname'])(comment)} ${path(['author', 'lastname'])(comment)} (${moment(comment.createdAt).format('L LT')})`}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    </React.Fragment>
                                ))(post.comments || [])}
                            </List>
                        </Collapse>
                    </div>
                ))(postsQuery.posts || [])}
            </List>
        </Layout>
    );
};

const getPostsQuery = graphql(gql`
    {
        posts {
            id
            name
            text
            likesCount
            dislikesCount
            createdAt
            author {
                firstname
                lastname
            }
            comments {
                id
                text
                createdAt
                author {
                    firstname
                    lastname
                }
            }
        }
    }
`, {
    name: 'postsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

const createPostMutation = graphql(gql`
    mutation CreatePostMutation($name: String!, $text: String!) {
        createPost(data: { text: $text, name: $name }) {
            id,
            name
            text
            likesCount
            dislikesCount
            createdAt
            author {
                firstname
                lastname
            }
            comments {
                id
                text
                createdAt
                author {
                    firstname
                    lastname
                }
            }
        }
    }
`, {
    name: 'createPostMutation',
});

const addCommentMutation = graphql(gql`
    mutation AddCommentMutation($text: String!, $postId: ID!) {
        addComment(data: { text: $text, postId: $postId }) {
            id,
            name
            text
            likesCount
            dislikesCount
            createdAt
            author {
                firstname
                lastname
            }
            comments {
                id
                text
                createdAt
                author {
                    firstname
                    lastname
                }
            }
        }
    }
`, {
    name: 'addCommentMutation',
});

export default compose(
    getPostsQuery,
    createPostMutation,
    addCommentMutation,
    withStyles(styles),
)(Forum);
