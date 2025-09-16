import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Todo } from '../../types/Todo';
import * as todoService from '../../api/todos';

interface Props {
  todos: Todo[];
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onErrorMessage: (message: string) => void;
}

export const Header: React.FC<Props> = ({ todos, onTodos, onErrorMessage }) => {
  const [query, setQuery] = useState('');

  function addTodo({ title, userId, completed }: Todo) {
    // setLoading(true);

    todoService
      .addTodos({ title, userId, completed })
      .then(newPost => {
        onTodos(currentTodos => [...currentTodos, newPost]);
      })
      .finally(() => {
        // setLoading(false);
      });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === '') {
      onErrorMessage('Title should not be empty');

      return;
    }

    addTodo({
      id: Math.max(...todos.map(todo => todo.id)) + 1,
      title: query,
      userId: todoService.USER_ID,
      completed: false,
    });

    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChange}
          autoFocus
        />
      </form>
    </header>
  );
};
