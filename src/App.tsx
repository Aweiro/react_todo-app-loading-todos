/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
// import { getTodos, USER_ID } from './api/todos';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

type FilterTypes = 'All' | 'Active' | 'Completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>('All');
  // const [loading, setLoading] = useState(true);
  // const [selectedPost, setSelectedPost] = useState<Todo | null>(null);

  // #region services
  function loadTodos() {
    // setLoading(true);

    todoService
      .getTodos()
      .then((todosList: Todo[]) => {
        setAllTodos(todosList);
        setTodos(todosList);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
    // .finally(() => setLoading(false));
  }

  function deleteTodos(todoId: number) {
    todoService.deleteTodos(todoId).then(() => {
      setAllTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== todoId),
      );

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    });
  }
  // #endregion

  useEffect(loadTodos, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  if (!todoService.USER_ID) {
    return <UserWarning />;
  }

  // #region filter
  const handleFilterAll = () => {
    setTodos(allTodos);
    setSelectedFilter('All');
  };

  const handleFilterActive = () => {
    setTodos(allTodos.filter(todo => !todo.completed));
    setSelectedFilter('Active');
  };

  const handleFilterCompleted = () => {
    setTodos(allTodos.filter(todo => todo.completed));
    setSelectedFilter('Completed');
  };
  // #endregion

  // console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodos(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}
        {allTodos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {allTodos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={handleFilterAll}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={handleFilterActive}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedFilter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={handleFilterCompleted}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
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
        {/* Unable to load todos
          <br />
          Title should not be empty
          <br />
          Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
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
