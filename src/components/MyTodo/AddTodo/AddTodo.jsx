import { useState } from 'react';
import { useTodoContext } from '../../../context/TodoContext';
import './AddTodo.scss';

function AddTodo() {
  const { addTodo } = useTodoContext();
  const [task, setTask] = useState('');

  const handleChangeText = (e) => {
    setTask(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (task.trim().length > 0) {
      addTodo(task);
      setTask('');
    }
  };

  return (
    <form className='todo-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Create a new todo...'
        value={task}
        onChange={handleChangeText}
      />
    </form>
  );
}
export default AddTodo;
