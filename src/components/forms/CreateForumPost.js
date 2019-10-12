import React, { useState } from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CircularProgress,
    IconButton,
    Input,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';

const CreateForumPost = ({ onSubmit, onClose, loading }) => {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (loading) return;
                onSubmit({ name, text });
            }}
        >
            <Card style={{ marginLeft: '10px', marginRight: '10px' }}>
                <CardHeader
                    action={
                        <IconButton
                            aria-label="close post form"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <Close />
                        </IconButton>
                    }
                />
                <CardContent>
                    <Input
                        fullWidth
                        placeholder="Název"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        id="name"
                        name="name"
                        autoFocus
                        autoComplete="off"
                        disabled={loading}
                    />
                    <Input
                        fullWidth
                        placeholder="Text..."
                        value={text}
                        multiline
                        rows={4}
                        onChange={(e) => setText(e.target.value)}
                        id="text"
                        name="text"
                        autoComplete="off"
                        disabled={loading}
                    />
                </CardContent>
                <CardActions>
                    <Button
                        style={{ marginLeft: 'auto' }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress /> : null} Odeslat
                    </Button>
                </CardActions>
            </Card>
        </form>
    );
};

export default CreateForumPost;


