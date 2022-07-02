import { Link } from 'react-router-dom';
import { useTodoContext } from '../../context/TodoContext';
import AddTodo from './AddTodo/AddTodo';
import TodoList from './TodoList/TodoList';
import './MyTodo.scss';

function MyTodo() {
  const { currentUser } = useTodoContext();

  return (
    <div className='my-todo'>
      <AddTodo />
      <TodoList />
      <small className='tip'>Drag and drop to reorder list</small>

      {!currentUser && (
        <p className='signin-reminder'>
          <Link to='/sign-in' className='link'>
            Sign in
          </Link>{' '}
          to save your tasks.
        </p>
      )}
    </div>
  );
}
export default MyTodo;
