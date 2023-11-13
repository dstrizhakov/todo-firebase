import React from 'react';
import Todo from "./Todo";


/**
 * Component for showing todo list
 * @component
 * @param {Object} props component props object
 * @param {todo[]} props.todos - todos array
 * @param {function} props.deleteTodo function delete todo
 * @param {function} props.updateTodo function update todo data
 * @param {function} props.toggleComplete function toggle todo complete
 * @param {function} props.editCurrentTodo function edit current todo
 * @param {function} props.deleteFile function delete file from todo
 * @return {JSX.Element}
 */
const TodoList = ( {todos, deleteTodo, updateTodo, toggleComplete, editCurrentTodo, deleteFile} ) => {

    return (
        <div className="todolist">
            {(todos.length !== 0)
                ? (todos.map(todo => <Todo
                    key={todo.id}
                    todo={todo}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                    toggleComplete={toggleComplete}
                    editCurrentTodo={editCurrentTodo}
                    deleteFile={deleteFile}
                />))
                : <h2>Todo list is empty</h2>
            }
        </div>
    );
};

export default TodoList;