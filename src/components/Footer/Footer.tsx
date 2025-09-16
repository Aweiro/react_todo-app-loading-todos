import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

type FilterTypes = 'All' | 'Active' | 'Completed';

interface Props {
  todos: Todo[];
  filterType: FilterTypes;
  onFilterType: (v: FilterTypes) => void;
  onDeleteTodos: (id: number) => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  onFilterType,
  onDeleteTodos,
}) => {
  const handleFilterAll = () => {
    onFilterType('All');
  };

  const handleFilterActive = () => {
    onFilterType('Active');
  };

  const handleFilterCompleted = () => {
    onFilterType('Completed');
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {[...todos].filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterType === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={handleFilterAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilterActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === 'Completed',
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
        disabled={[...todos].filter(todo => todo.completed).length === 0}
        onClick={() => {
          todos.map(todo => todo.completed && onDeleteTodos(todo.id));
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
