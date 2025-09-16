import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  onTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onDeleteTodos: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onTodos,
  onDeleteTodos,
}) => {
  const handleChecked = (id: number) => {
    onTodos(currentTodos => {
      return currentTodos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
    });
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onHandleChecked={handleChecked}
          onDeleteTodos={onDeleteTodos}
        />
      ))}
    </section>
  );
};
