import React, { Component } from 'react';
import { connect } from 'react-redux';
// import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Todo from '../components/Todo';
// import TextField from 'material-ui/TextField';
// import todoAction from '../store/action/todoAction';
import TodoMiddleware from '../store/middlewares/todoMiddleware';
// import logo from './logo.svg';
// import './App.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyB8uOFA5eaYTfrDjIKnZXC8wLFqEg6z4GU",
  authDomain: "portfolio-6b5f9.firebaseapp.com",
  databaseURL: "https://portfolio-6b5f9.firebaseio.com",
  projectId: "portfolio-6b5f9",
  storageBucket: "portfolio-6b5f9.appspot.com",
  messagingSenderId: "944772683427"
};
firebase.initializeApp(config);

// console.log(firebase.database().ref('/'))




function fetchStoreData(state) {
  return {
    todoArr: state
  }
}
function sendDataToStore(dispatch) {
  return {
    addtotodo: (val) => {
      dispatch(TodoMiddleware.asyncAddTodos(val));
    },
    deletetotodo: (key) => {
      dispatch(TodoMiddleware.asyncDeleteTodos(key));
    },
    edittodo: (key, data) => {
      dispatch(TodoMiddleware.asyncEditTodos(key, data));
    }

  }
}
class App extends Component {
  componentWillMount() {
    console.log()
      console.log(this.props.todoArr)
  }
  constructor(props) {
    super(props);
    this.state = {
      // todos: {}
    }
    firebase.database().ref('/todos').on('child_added', (data) => {
      let obj = data.val();
      obj.key = data.key;
      // let currentTodos = this.props.todos;
      // currentTodos = currentTodos.concat(obj)
      this.props.addtotodo(obj);
      let todo = {};
      todo[obj.key] = obj;
      // this.setState({
      //  todos : Object.assign({},this.state.todos,todo) 
      // })
      this.setState({
        [obj.key] :obj
      })



      // console.log(this.state.todos)
    });
    
    // this.setState({this.props.todoArr})
  }
  addingValue(data) {
    // this.props.addtotodo(val);
    firebase.database().ref('/').child('todos').push(data).then((val) => {
      console.log(val.key, data);
      data.key = val.key;
    });
    // console.log(val)
  }
  editItem(event) {
    let inputField = event.target.parentNode.parentNode.firstChild.firstChild;
    let key = event.target.parentNode.parentNode.id;
    if (event.target.innerHTML === "Edit") {
      event.target.innerHTML = "Save";
      // inputField.disabled = true;
      inputField.removeAttribute("disabled");
      // inputField.value = null;

    } else {
      event.target.innerHTML = "Edit";
      this.props.edittodo(key, inputField.value)
      inputField.setAttribute("disabled", "disabled");
    }
    console.log(inputField);
  }
  changingValue(event){
    let key = event.target.parentNode.parentNode.id;
    let obj = this.state[key];
    obj.todo = event.target.value;
    console.log(obj);
    this.setState({
      [key] : Object({},this.state[key],obj)
    })
    console.log(event.target.parentNode.parentNode.id);
  }
  deleteAllTodos(){
    Object.keys(this.state).map((key)=>{
      return this.props.deletetotodo(key);
    });
  }
  deleteItem(event) {
    console.log(event.target.parentNode.parentNode.id);
    let key = event.target.parentNode.parentNode.id;
    this.props.deletetotodo(key);
  }
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Todo addValue={this.addingValue.bind(this)} />
          {console.log(Object.keys(this.state))}
          <button onClick={this.deleteAllTodos.bind(this)}>Delete All</button>
          <table>

            <tbody>

              {
                Object.keys(this.props.todoArr).map((key) => {
                  return (
                    <tr id={key}>
                      <td >
                        {/*<input disabled="disabled" type="text" value={this.props.todoArr[key].todo} id={key + "txt" } onChange={this.changingValue.bind(this)} />*/}
                        <input disabled="disabled" type="text"
                         onChange={this.changingValue.bind(this)}
                         value={
                          
                          (this.state[key]) ? this.state[key].todo:''
                          } id={key + "txt"} />
                      </td>
                      <td >{this.props.todoArr[key].done.toString()}</td>
                      <td >
                        <button onClick={this.editItem.bind(this)}>Edit</button>
                      </td>
                      <td >
                        <button onClick={this.deleteItem.bind(this)}>Del</button>
                      </td>
                      {/*{console.log(this.props.todoArr[key].done)}*/}
                    </tr>
                  );
                })

              }

            </tbody>
          </table>
        </div>

      </MuiThemeProvider>
    );
  }
}

export default connect(fetchStoreData, sendDataToStore)(App);
