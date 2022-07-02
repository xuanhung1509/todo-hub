import { useRef, useState, useEffect } from 'react';
import { useTodoContext } from '../../../context/TodoContext';
import useMediaQuery from '../../../hooks/useMediaQuery';
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
  const isMobile = useMediaQuery('(max-width: 678px)');

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
        // Get the distance from mouse's y position to the middle of the element
        const box = child.getBoundingClientRect();
        const offset = y - (box.top + box.height / 2);

        // Return the element that is after and closest to the mouse's y position
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
    // eslint-disable-next-line
  }, []);

  const filtersBlock = (
    <div className='filters'>
      {filters.map((filter) => (
        <button
          key={filter.name}
          className={`btn filter ${filter.name === activeFilter && 'active'}`}
          onClick={() => handleClickFilter(filter)}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );

  if (filteredTodos)
    return (
      <>
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
            <div className='remaining'>
              {countIncompletedTodos()} items left
            </div>
            {!isMobile && filtersBlock}
            <button className='btn clear' onClick={clearCompletedTodos}>
              Clear Completed
            </button>
          </div>
        </ul>
        <>{isMobile && filtersBlock}</>
      </>
    );
}
export default TodoList;
