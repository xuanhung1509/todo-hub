import {
  GET_CURRENT_USER,
  GET_TODOS,
  ADD_TODO,
  DO_TODO,
  UNDO_TODO,
  DELETE_TODO,
  FILTER_ALL,
  FILTER_COMPLETED,
  FILTER_INCOMPLETED,
  SET_FILTERED_TODOS,
  CLEAR_COMPLETED,
} from './TodoActions';

const todoReducer = (state, action) => {
  switch (action.type) {
    case GET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        isLoading: false,
      };
    case GET_TODOS:
      return {
        ...state,
        todos: action.payload,
      };
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    case DO_TODO:
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) =>
            todo.id === action.payload
              ? {
                  ...todo,
                  completed: true,
                }
              : todo
          ),
        ],
      };
    case UNDO_TODO:
      return {
        ...state,
        todos: [
          ...state.todos.map((todo) =>
            todo.id === action.payload
              ? {
                  ...todo,
                  completed: false,
                }
              : todo
          ),
        ],
      };
    case DELETE_TODO:
      return {
        ...state,
        todos: [...state.todos.filter((todo) => todo.id !== action.payload)],
      };
    case FILTER_ALL:
      return {
        ...state,
        filter: 'ALL',
      };
    case FILTER_COMPLETED:
      return {
        ...state,
        filter: 'COMPLETED',
      };
    case FILTER_INCOMPLETED:
      return {
        ...state,
        filter: 'INCOMPLETED',
      };
    case SET_FILTERED_TODOS:
      return {
        ...state,
        filteredTodos: action.payload,
      };
    case CLEAR_COMPLETED:
      return {
        ...state,
        todos: [...state.todos.filter((todo) => !todo.completed)],
      };
    default:
      return state;
  }
};

export default todoReducer;
