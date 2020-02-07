import React from 'react';
import Note from './Note';


interface FormProps {

}

interface FormState {
  title: string;
  content: string;
  isSubmitted: boolean;
}

class NoteForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      isSubmitted: false
    };

    this.writeTitle = this.writeTitle.bind(this);
    this.writeContent = this.writeContent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  writeTitle(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ title: event.target.value });
  }

  writeContent(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ content: event.target.value });
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    this.setState({isSubmitted: true});
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Note title:
            <input type="text" value={this.state.title} onChange={this.writeTitle} />
          </label>
          <label>
            Contents:
            <input type="text" value={this.state.content} onChange={this.writeContent} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>
          {this.state.isSubmitted && <Note title={this.state.title} mycontent={this.state.content} />}
        </div>
      </div>
    );
  }
}

export default NoteForm;