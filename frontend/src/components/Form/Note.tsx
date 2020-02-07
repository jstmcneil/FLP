import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

interface NoteProps {
    title: string;
    mycontent: string;
}

interface NoteState {
}

class Note extends React.Component<NoteProps, NoteState> {
    render() {
        return (
            <Card className="card">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h3">
                        {this.props.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.mycontent}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default Note;