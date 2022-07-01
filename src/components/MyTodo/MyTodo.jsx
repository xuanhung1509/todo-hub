import AddTodo from './AddTodo/AddTodo';
import TodoList from './TodoList/TodoList';
import './MyTodo.scss';

function MyTodo() {
  return (
    <div className='my-todo'>
      <AddTodo />
      <TodoList />
      <small className='tip'>Drag and drop to reorder list</small>
    </div>
  );
}
export default MyTodo;
