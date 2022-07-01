import { useRef, useState, useEffect } from 'react';
import { useTodoContext } from '../../../context/TodoContext';
import TodoItem from './TodoItem';
import './TodoList.scss';

function TodoList() {
  const {
    todos,
    filteredTodos,
    showAllTodos,
    showCompletedTodos,
    showIncompletedTodos,
    clearCompletedTodos,
    setFilteredTodos,
  } = useTodoContext();

  const filters = [
    { name: 'All', action: showAllTodos },
    { name: 'Active', action: showIncompletedTodos },
    { name: 'Completed', action: showCompletedTodos },
  ];
  const [activeFilter, setActiveFilter] = useState('All');
  const [dragging, setDragging] = useState(null);
  const listRef = useRef();

  const handleClickFilter = (filter) => {
    filter.action();
    setActiveFilter(filter.name);
  };

  const countIncompletedTodos = () => {
    return todos.reduce(
      (count, todo) => (!todo.completed ? count + 1 : count),
      0
    );
  };

  const getDragAfterElement = (y) => {
    const draggables = [
      ...listRef.current.querySelectorAll('.todo-item:not(.dragging)'),
    ];

    const result = draggables.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: -Infinity }
    );

    return result.element;
  };

  const handleDragOver = (e) => {
    e.preventDefault();

    const afterElement = getDragAfterElement(e.clientY);

    let sortedTodos;

    if (!afterElement) {
      sortedTodos = [
        ...filteredTodos.filter((todo) => todo.id !== dragging.id),
        dragging,
      ];
    } else {
      const afterElementId = afterElement.dataset.id;
      const afterElementIndex = filteredTodos.findIndex(
        (todo) => todo.id === afterElementId
      );

      sortedTodos = [
        ...filteredTodos.filter((todo) => todo.id !== dragging.id),
      ];

      sortedTodos.splice(
        afterElementIndex === 0 ? 0 : afterElementIndex - 1,
        0,
        dragging
      );
    }

    setFilteredTodos(sortedTodos);
  };

  useEffect(() => {
    showAllTodos();
  }, []);

  if (filteredTodos)
    return (
      <ul className='todo-list' ref={listRef} onDragOver={handleDragOver}>
        {filteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            dragging={dragging}
            setDragging={setDragging}
          />
        ))}
        <div className='bottom'>
          <div className='remaining'>{countIncompletedTodos()} items left</div>
          <button className='btn clear' onClick={clearCompletedTodos}>
            Clear Completed
          </button>
          <div className='filters'>
            {filters.map((filter) => (
              <button
                key={filter.name}
                className={`btn filter ${
                  filter.name === activeFilter && 'active'
                }`}
                onClick={() => handleClickFilter(filter)}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </ul>
    );
}
export default TodoList;
