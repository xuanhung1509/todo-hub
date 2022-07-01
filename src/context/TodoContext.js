import { createContext, useContext, useEffect, useReducer } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import todoReducer from './TodoReducer';
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

const TodoContext = createContext();

const initialState = {
  currentUser: null,
  isLoading: true,
  todos: [],
  filter: null,
  filteredTodos: [],
};

const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const auth = getAuth();

  // Set current user
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch({
        type: GET_CURRENT_USER,
        payload: user,
      });
    });
  }, [auth]);

  // Get user's todos
  useEffect(() => {
    const getTodos = async () => {
      if (state.currentUser) {
        const q = query(
          collection(db, 'todos'),
          where('userRef', '==', state.currentUser.uid)
        );

        const querySnap = await getDocs(q);
        const todos = [];
        querySnap.forEach((doc) => {
          todos.push({
            ...doc.data(),
          });
        });

        dispatch({
          type: GET_TODOS,
          payload: todos,
        });
      }
    };

    getTodos();
  }, [state.currentUser]);

  const addTodo = async (task) => {
    const newTodo = {
      id: uuidv4(),
      task,
      completed: false,
      userRef: state.currentUser.uid,
    };

    dispatch({
      type: ADD_TODO,
      payload: newTodo,
    });

    await setDoc(doc(db, 'todos', newTodo.id), newTodo);
  };

  const checkTodo = async (id) => {
    dispatch({
      type: DO_TODO,
      payload: id,
    });

    await updateDoc(doc(db, 'todos', id), {
      completed: true,
    });

    // Update completed count
    if (state.currentUser) {
      const currentUser = await getDoc(doc(db, 'users', state.currentUser.uid));
      const { completed } = currentUser.data();

      await updateDoc(doc(db, 'users', state.currentUser.uid), {
        completed: completed + 1,
      });
    }
  };

  const uncheckTodo = async (id) => {
    dispatch({
      type: UNDO_TODO,
      payload: id,
    });

    await updateDoc(doc(db, 'todos', id), {
      completed: false,
    });

    // Update completed count
    if (state.currentUser) {
      const currentUser = await getDoc(doc(db, 'users', state.currentUser.uid));
      const { completed } = currentUser.data();

      await updateDoc(doc(db, 'users', state.currentUser.uid), {
        completed: completed - 1,
      });
    }
  };

  const deleteTodo = async (id) => {
    dispatch({
      type: DELETE_TODO,
      payload: id,
    });

    await deleteDoc(doc(db, 'todos', id));
  };

  const showAllTodos = () => {
    dispatch({ type: FILTER_ALL });
  };

  const showCompletedTodos = () => {
    dispatch({ type: FILTER_COMPLETED });
  };

  const showIncompletedTodos = () => {
    dispatch({ type: FILTER_INCOMPLETED });
  };

  const clearCompletedTodos = async () => {
    const completedTodos = state.todos.filter((todo) => todo.completed);

    completedTodos.forEach(
      async (todo) => await deleteDoc(doc(db, 'todos', todo.id))
    );

    dispatch({ type: CLEAR_COMPLETED });
  };

  const updateUserProfile = async (prop, val) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        [prop]: val,
      });
    }
  };

  const setFilteredTodos = (filteredTodos) => {
    dispatch({
      type: SET_FILTERED_TODOS,
      payload: filteredTodos,
    });
  };

  useEffect(() => {
    let filteredTodos = state.todos.filter((todo) => {
      if (state.filter === 'ALL') return true;
      if (state.filter === 'COMPLETED' && todo.completed) return true;
      if (state.filter === 'INCOMPLETED' && !todo.completed) return true;
      return false;
    });

    setFilteredTodos(filteredTodos);
  }, [state.todos, state.filter]);

  return (
    <TodoContext.Provider
      value={{
        isLoading: state.isLoading,
        currentUser: state.currentUser,
        todos: state.todos,
        filteredTodos: state.filteredTodos,
        addTodo,
        checkTodo,
        uncheckTodo,
        deleteTodo,
        showAllTodos,
        showCompletedTodos,
        showIncompletedTodos,
        clearCompletedTodos,
        updateUserProfile,
        setFilteredTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

const useTodoContext = () => useContext(TodoContext);

export { TodoProvider, useTodoContext };
