import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';

type FilterTypes = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>('All');
  const [loading, setLoading] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledButton, setDisabledButton] = useState(false);

  function loadTodos() {
    todoService
      .getTodos()
      .then((todosList: Todo[]) => {
        setTodos(todosList);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }

  const filteredTodos = useMemo(() => {
    if (selectedFilter === 'Active') {
      return [...todos].filter(todo => !todo.completed);
    }

    if (selectedFilter === 'Completed') {
      return [...todos].filter(todo => todo.completed);
    }

    return todos;
  }, [selectedFilter, todos]);

  useEffect(loadTodos, []);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onTodos={setTodos}
          onErrorMessage={setErrorMessage}
          onLoading={setLoading}
          onTempTodo={setTempTodo}
          todos={todos}
          disabledButton={disabledButton}
        />

        <TodoList
          todos={todos}
          filteredTodos={filteredTodos}
          onTodos={setTodos}
          onLoading={setLoading}
          loading={loading}
          tempTodo={tempTodo}
          onErrorMessage={setErrorMessage}
          onDisabledButton={setDisabledButton}
        />
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            todos={todos}
            filterType={selectedFilter}
            onFilterType={setSelectedFilter}
            onTodos={setTodos}
            onLoading={setLoading}
            onErrorMessage={setErrorMessage}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {/* Unable to load todos +
          <br />
          Title should not be empty +
          <br />
          Unable to add a todo +
          <br />
          Unable to delete a todo +
          <br />
          Unable to update a todo + */}
        {errorMessage}
      </div>
    </div>
  );
};

// {/* This is a completed todo */}
//           <div data-cy="Todo" className="todo completed">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//                 checked
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Completed Todo
//             </span>

//             {/* Remove button appears only on hover */}
//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             {/* overlay will cover the todo while it is being deleted or updated */}
//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is an active todo */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Not Completed Todo
//             </span>
//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is being edited */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             {/* This form is shown instead of the title and remove button */}
//             <form>
//               <input
//                 data-cy="TodoTitleField"
//                 type="text"
//                 className="todo__title-field"
//                 placeholder="Empty todo will be deleted"
//                 value="Todo is being edited now"
//               />
//             </form>

//             <div data-cy="TodoLoader" className="modal overlay">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>

//           {/* This todo is in loadind state */}
//           <div data-cy="Todo" className="todo">
//             <label className="todo__status-label">
//               <input
//                 data-cy="TodoStatus"
//                 type="checkbox"
//                 className="todo__status"
//               />
//             </label>

//             <span data-cy="TodoTitle" className="todo__title">
//               Todo is being saved now
//             </span>

//             <button type="button" className="todo__remove" data-cy="TodoDelete">
//               ×
//             </button>

//             {/* 'is-active' class puts this modal on top of the todo */}
//             <div data-cy="TodoLoader" className="modal overlay is-active">
//               <div className="modal-background has-background-white-ter" />
//               <div className="loader" />
//             </div>
//           </div>
