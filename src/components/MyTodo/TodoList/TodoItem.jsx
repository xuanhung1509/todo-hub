import { IoIosClose, IoIosCheckmark } from 'react-icons/io';
import { useTodoContext } from '../../../context/TodoContext';

function TodoItem({ todo, dragging, setDragging }) {
  const { checkTodo, uncheckTodo, deleteTodo } = useTodoContext();

  const handleChangeCheckbox = () => {
    if (todo.completed) {
      uncheckTodo(todo.id);
    } else {
      checkTodo(todo.id);
    }
  };

  return (
    <li
      data-id={todo.id}
      className={`todo-item ${dragging?.id === todo.id && 'dragging'}`}
      draggable
      onDragStart={() => setDragging(todo)}
      onDragEnd={() => setDragging(null)}
    >
      <label>
        <input
          type='checkbox'
          checked={todo.completed}
          onChange={handleChangeCheckbox}
        />
        <span className='checkmark'>
          <IoIosCheckmark fill='#fff' size={20} />
        </span>
        <div className='task-name'>{todo.task}</div>
      </label>

      <button className='btn close' onClick={() => deleteTodo(todo.id)}>
        <IoIosClose size={25} />
      </button>
    </li>
  );
}

export default TodoItem;
