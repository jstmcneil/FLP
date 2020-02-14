import React from 'react';
import Note from './Note';
import { NoteType } from '../../model/NoteType';


interface FormProps {

}

interface FormState {
  title: string;
  content: string;
  isSubmitted: boolean;
  notes: NoteType[];
}

class NoteForm extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);
    this.state = {
      title: '',
      content: '',
      isSubmitted: false,
      notes: []
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
    var newNote: NoteType = {
      title: this.state.title,
      content: this.state.content
    }
    this.setState({
      isSubmitted: true,
      notes: this.state.notes.concat(newNote),
      title: "",
      content: ""
    });
  }

  showTable() {
    return this.state.notes.map((note, index) => {
      const { title, content } = note
      return (
        <tr>
          <td>{title}</td>
          <td>{content}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <div className="space"></div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Note title:
            <input id="title" type="text" value={this.state.title} onChange={this.writeTitle} />
          </label>
          <label>
            Contents:
            <input id="content" type="text" value={this.state.content} onChange={this.writeContent} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div className="space"></div>
        <div id="noteTable">
          <table>
            <tbody>
              <tr>
                <td>Title</td>
                <td>My Notes</td>
              </tr>
              {this.showTable()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default NoteForm;