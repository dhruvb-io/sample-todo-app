import logo from './logo.svg';
import './App.css';
import AddTodo from './components/AddTodo';

function App() {
  return (
    <div className="App">
      <AddTodo></AddTodo>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello from ToDo App
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
