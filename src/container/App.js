import React, { Component } from 'react';
import { connect } from 'react-redux';
import Checkbox from 'material-ui/Checkbox';
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
const styles = {
  checkbox: {
    marginLeft: 16,
  },
};



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
    },
    checkBox: (key, done) => {
      dispatch(TodoMiddleware.asyncCheckTodos(key, done));
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
        [obj.key]: obj
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
    console.log(event.target.parentNode.parentNode.child[1].firstChild)
    if (event.target.innerHTML === "EDIT") {
      event.target.innerHTML = "SAVE";
      // inputField.disabled = true;
      inputField.removeAttribute("disabled");
      // inputField.value = null;

    } else {
      event.target.innerHTML = "EDIT";
      this.props.edittodo(key, inputField.value)
      inputField.setAttribute("disabled", "disabled");
    }
    console.log(inputField);
  }
  updateCheck(event) {
    let key = event.target.parentNode.parentNode.parentNode.id;

    console.log(event.target)
    if (event.target.value === 'on') {
      let obj = this.state[key]
      obj.done = true;
      this.setState({
        [key]: obj
      });
      event.target.value = "off";
      this.props.checkBox(key,true);
    } else {
      let obj = this.state[key]
      obj.done = false;
      this.setState({
        [key]: obj
      })
      event.target.value = "on";
      this.props.checkBox(key,false);
    }
  }
  changingValue(event) {
    let key = event.target.parentNode.parentNode.id;
    let obj = this.state[key];
    obj.todo = event.target.value;
    console.log(obj);
    this.setState({
      [key]: Object({}, this.state[key], obj)
    })
    console.log(event.target.parentNode.parentNode.id);
  }
  deleteAllTodos() {
    Object.keys(this.state).map((key) => {
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
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 "></div>
            <div className="col-md-6">
              <Todo addValue={this.addingValue.bind(this)} />
              {console.log(Object.keys(this.state))}
              <button type="button" class="btn btn-dark"
                onClick={this.deleteAllTodos.bind(this)}>Delete All</button>
              
              {/* <div class = "card"> */}
              
              <table>

                <tbody>

                  {
                    Object.keys(this.props.todoArr).map((key) => {
                      return (
                        <tr id={key}>
                          <td >
                            {/*<input disabled="disabled" type="text" value={this.props.todoArr[key].todo} id={key + "txt" } onChange={this.changingValue.bind(this)} />*/}
                            <input className="form-control"  disabled="disabled" type="text"
                              onChange={this.changingValue.bind(this)}
                              value={

                                (this.state[key]) ? this.state[key].todo : ''
                              } id={key + "txt"} />
                          </td>
                          <td>
                            <Checkbox
                              checked={(this.state[key]) ? this.state[key].done : ''}
                              onCheck={this.updateCheck.bind(this)
                              }
                              style={styles.checkbox}
                            />

                          </td>
                          <td >
                            <button type="button" class="btn btn-info"
                              onClick={this.editItem.bind(this)}>EDIT</button>
                          </td>
                          <td >
                            <button type="button" class="btn btn-danger"
                              onClick={this.deleteItem.bind(this)}>DELETE</button>
                          </td>
                          {/*{console.log(this.props.todoArr[key].done)}*/}
                        </tr>
                      );
                    })

                  }

                </tbody>
              </table>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>

        {/* </div> */}

      </MuiThemeProvider>
    );
  }
}

export default connect(fetchStoreData, sendDataToStore)(App);