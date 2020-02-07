import React from 'react';
import { Card, CardContent } from '@material-ui/core';

interface NoteProps {
    title: string;
    mycontent: string;
}

interface NoteState {
}

class Note extends React.Component<NoteProps, NoteState> {
    render() {
        return (
            <Card>
                <CardContent>
                    {this.props.title}
                </CardContent>
                <CardContent>
                    {this.props.mycontent}
                </CardContent>
            </Card>
        );
    }
}

export default Note;