import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVal: '',
            todo: []
        }
 
    }
    changeValue(event) {
        this.setState({
            inputVal: event.target.value
        })
    }
    addTodo() {
        this.state.todo.push({ todo: this.state.inputVal, done: false });
        // console.log(this.state.todo);
        this.setState({
            inputVal: ''
        });
        
        // console.log(this)
        this.props.addValue({ todo: this.state.inputVal, done: false });
    }
    render() {
        return (

            <div>
                <TextField
                    id="text-field-default"
                    placeholder="Todo Value"
                    value={this.state.inputVal}
                    onChange={this.changeValue.bind(this)}
                />
                <RaisedButton label="Add" onClick={this.addTodo.bind(this)} />
            </div>
        );
    }
}

export default Todo;