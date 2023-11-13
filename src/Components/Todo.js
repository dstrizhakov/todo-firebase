import React from 'react';
import File from "./File";
/**
 * @typedef {Object} deadline - object UT timestamp
 * @property {number} seconds - UT seconds time
 * @property {number} nanoseconds - UT nanoseconds
 */
/**
 * @typedef {Object} created - object UT timestamp
 * @property {number} seconds - UT seconds time
 * @property {number} nanoseconds - UT nanoseconds
 */
/**
 * @typedef {Object} todo - todo item
 * @property {number} id - todo id
 * @property {string} todo - todo title
 * @property {string} details - todo details
 * @property {boolean} isdone - todo status(in progress/done)
 * @property {string} fileRef - file path in database
 * @property {string} files - file url
 * @property {deadline} deadline - deadline object UT timestamp
 * @property {created} created - created object UT timestamp
 *
 */
/**
 * Component for showing todo item
 * @component
 * @param {Object} props component props object
 * @param {todo} props.todo - todo item
 * @param {function} props.deleteTodo - function delete todo
 * @param {function} props.toggleComplete - function toggle complete
 * @param {function} props.editCurrentTodo - function edit current todo
 * @param {function} props.deleteFile - function delete file from todo
 * @return {JSX.Element}
 */
const Todo = ( {todo, deleteTodo, toggleComplete, editCurrentTodo, deleteFile} ) => {

    return (
        <>
        <div className="todo">
            <div className="todo-main">
                <h2 className="todo-title">{todo.todo}</h2>
                <p>{todo.details}</p>
                <div className="todo-timestamp">
                    {todo.created
                        ?<p>Created: {new Date(todo.created.seconds*1000).toString()}</p>
                        :<p>Created: no date</p>
                    }
                    {todo.deadline
                        ?<p>Deadline: {new Date(todo.deadline.seconds*1000).toString()}</p>
                        :<p>Deadline: no date</p>
                    }

                </div>
            </div>
            <div className="todo-files">
                {todo.files
                    ? <File edit={false} deleteFile={deleteFile} url={todo.files} name="file"/>
                    : <p></p>
                }
            </div>
            <div className="todo-progress">
                <div >{todo.isdone
                ?<p className="green">Done</p>
                :<p className="yellow">In progress</p>
                }
                    {todo.deadline&&todo.created
                        ? (todo.deadline.seconds - todo.created.seconds < 0)&&<p className="red">Task expired!</p>
                        : <p></p>
                    }
                </div>

            </div>
            <div className="todo-control">
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={(e) => editCurrentTodo(todo)}>Edit todo</button>
                <button onClick={() => toggleComplete(todo)}>{todo.isdone?"In progress":"Done"}</button>
            </div>
        </div>
        </>
    );
};

export default Todo;