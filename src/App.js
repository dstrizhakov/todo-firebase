import './App.less';
import {useEffect, useRef, useState} from "react";
import {db} from "./firebase";
import {deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc} from "firebase/firestore";
import { collection, addDoc, orderBy } from "firebase/firestore";
import TodoList from "./Components/TodoList";
import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import File from "./Components/File";


/**
 * Main App component
 * @component
 * @return {JSX.Element}
 */
function App() {

    const [todoTitle, setTodoTitle] = useState("");
    const [todoDetails, setTodoDetails] = useState("");
    const [todoDeadline, setTodoDeadline] = useState("");
    const [file, setFile] = useState(null);
    const [todos, setTodos] = useState([]);
    const [editTodo, setEditTodo] = useState(false);
    const [currentTodoRef, setCurrentTodoRef] = useState({});

    const inputFileRef = useRef();

    useEffect(() => {
        const q = query(collection(db,"todos"), orderBy('created'));
        const unsub = onSnapshot(q, (querySnapshot)=>{
            let todosArray = [];
            querySnapshot.forEach((doc)=>{
                todosArray.push({ ...doc.data(), id: doc.id });
            });
            setTodos(todosArray);
        })
        return () => unsub();
    }, []);
    /**
     * Convert date string to Unix timestamp format
     * @function toTimestamp
    * @param {string} strDate - date in string format
    * @returns {{seconds: number,nanoseconds: 0}}
    */
    const toTimestamp = (strDate) => {
        let datum = Date.parse(strDate);
        return {
            seconds: datum/1000,
            nanoseconds: 0
        }
    };
    /**
     * Convert Unix timestamp format to date string
     * @function toDate
     * @param  {number} microseconds - date in UT format
     * @return {string}
     */
    const toDate = (microseconds) => {
        const dateFormat = new Date(microseconds)
        const year = dateFormat.getFullYear();
        const month = (dateFormat.getMonth()+1);
        const day = dateFormat.getDate();
        const dateString = year.toString() + "-" +
            (month.toString().length === 1 ? +"0"+ month.toString() : month.toString())
            + "-" + (day.toString().length === 1 ? +"0" + day.toString(): day.toString());
        return dateString
    }
    /**
     * Set file from input to state
     * @function handleChangeFile
     * @param {InputEvent} event - the input event object
     */
    const handleChangeFile = (event) => {
            setFile(event.target.files[0]);
    };
    /**
     * Upload file to firebase storage
     * @function uploadFile
     * @return {Promise<string|{path: string, url: string}>}
     */
    const uploadFile =  async () => {
        if(!file) {
            return ""
        } else {
            const path = `files/${file.name + v4()}`
            const fileRef = await ref(storage, path);
            await uploadBytes (fileRef, file);
            const url = await getDownloadURL(fileRef);
            return {url, path}
        }
    };
    /**
     * delete file from firebase storage
     * @function deleteFile
     * @return {Promise<void>}
     */
    const deleteFile = async () => {
        const fileRef = await ref(storage, currentTodoRef.fileRef);
        await updateDoc(doc(db, "todos", currentTodoRef.id), {
            fileRef: null,
            files: "",
        });
        deleteObject(fileRef).then(() => {
            // File deleted successfully
            console.log("File deleted successfully");
        }).catch((error) => {
            console.log(error);
        });
    };
    /**
     * Add todo data to firebase Database, reset data on form
     * @function addTodo
     * @param {MouseEvent} event - the mouse event object
     * @return {Promise<void>}
     */
    const addTodo = async (event) => {
        event.preventDefault();
        let {url, path} = await uploadFile();
        if (!path) {path = "collection/files"; url = "";}
        if(todoTitle.length > 3){
            await addDoc(collection(db, "todos"), {
                fileRef: path,
                files: url,
                isdone: false,
                created: serverTimestamp(),
                deadline: toTimestamp(todoDeadline),
                todo: todoTitle,
                details: todoDetails,
            })
                .then(() => {
                  console.log('Todo submitted!');
                })
                .catch((error) => {
                    console.log(error.message);
                });
            setTodoDetails('');
            setTodoTitle('');
            setTodoDeadline('');
            setFile(null);
            inputFileRef.current.value = "";
        }
    };
    /**
     * Delete todo item from firebase database by id
     * @function deleteTodo
     * @param {string} id - todo id
     * @return {Promise<void>}
     */
    const deleteTodo = async (id) => {
        await deleteDoc(doc(db, "todos", id));
    };
    /**
     * Update todo item data on firebase database, reset data on form
     * @function updateTodo
     * @param {MouseEvent} event - the mouse event object
     * @return {Promise<void>}
     */
    const updateTodo= async (event) => {
        event.preventDefault();
        let {url, path} = await uploadFile();
        if (!path) {path = "collection/files"; url = "";}
        await updateDoc(doc(db, "todos", currentTodoRef.id), {
            fileRef: path,
            files: url,
            deadline: toTimestamp(todoDeadline),
            todo: todoTitle,
            details: todoDetails,
        });
        setEditTodo(false);
        setTodoDetails('');
        setTodoTitle('');
        setTodoDeadline('')
        setFile(null);
        inputFileRef.current.value = "";
    };
    /**
     * Toggle todo status (In progress/Done), update todo item data on firebase Database
     * @function toggleComplete
     * @param {todo} todo - todo object to toggle complete
     * @return {Promise<void>}
     */
    const toggleComplete = async (todo) => {
        await updateDoc(doc(db, "todos", todo.id), {
            isdone: !todo.isdone
        });
    };
    /**
     * Set Edit Todo mode, update data in form
     * @function editCurrentTodo
     * @param {todo} currentTodo - current todo object for edit
     */
    const editCurrentTodo = (currentTodo) => {
        setEditTodo(true);
        setCurrentTodoRef(currentTodo)
        setFile(currentTodo.files)
        setTodoTitle(currentTodo.todo)
        setTodoDetails(currentTodo.details)
        setTodoDeadline(toDate(currentTodo.deadline.seconds * 1000))
    };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App</h1>
      </header>
        <main className="App-body">
            <form className="App-form" action="submit">
                <input type="text" value={todoTitle} onChange={e => setTodoTitle(e.target.value)} placeholder="Todo title"/>
                <textarea name="Details" value={todoDetails} onChange={(e)=> setTodoDetails(e.target.value)} placeholder="Todo details" id=""  rows="5"></textarea>
                <div className="form-data">
                    <input ref={inputFileRef} type="file" onChange={ e => handleChangeFile(e)}/>
                    <div>
                        {(editTodo&&(currentTodoRef.files !== ""))&&
                            <div className="form-files"> <File edit={true} url={currentTodoRef.files} name="file"/>
                                <button onClick={deleteFile}>Detele</button>
                            </div>
                        }
                    </div>

                </div>
                <input type="date" value={todoDeadline} onChange={e => setTodoDeadline(e.target.value)}/>
                {
                    editTodo
                        ?<button type="submit" onClick={event =>{updateTodo(event)}}>Update todo</button>
                        :<button type="submit" onClick={event =>{addTodo(event)}}>Create todo</button>
                }


            </form>
            <section className="App-todolist">
                <TodoList
                    todos={todos}
                    toTimestamp={toTimestamp}
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                    toggleComplete={toggleComplete}
                    editCurrentTodo={editCurrentTodo}
                    deleteFile={deleteFile}
                />
            </section>
        </main>
    </div>
  );
}

export default App;
