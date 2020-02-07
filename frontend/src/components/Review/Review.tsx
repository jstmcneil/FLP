import React from 'react';
import NoteForm from '../Form/NoteForm';

class Review extends React.Component {
    render() {
        return (
            <div>
                <div className="title">Review Notes</div>
                <NoteForm />
            </div>
        );
    }
}

export default Review;