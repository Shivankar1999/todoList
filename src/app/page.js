'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [todoElement, settodoElement] = useState('');  
  const [todoList, settodoList] = useState([]);       
  const [editTodoId, setEditTodoId] = useState(null); 

  // Initialize the todo list from local storage
  const handleDataAddToLocal = () => {
    let data = JSON.stringify([
      {
        id: 1,
        text: 'text 1',
        isChecked: false
      },
      {
        id: 2,
        text: 'text 2',
        isChecked: false
      },
    ]);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('todo', data);
      settodoList(JSON.parse(localStorage.getItem('todo')));
    }
  };

  useEffect(() => {
    handleDataAddToLocal();
  }, []);

  // Add or Edit Todo
  const handelAddTodo = (e) => {
    if (todoElement === "") {
      alert('Please add before adding task!');
      return;
    }

    if (e.key === 'Enter') {
      const todo = JSON.parse(localStorage.getItem('todo'));
      if (todo) {
        let updatedTodos;
        
        // Edit Mode
        if (editTodoId) {
          updatedTodos = todo.map(td => td.id === editTodoId ? { ...td, text: todoElement } : td);
          setEditTodoId(null);  // Reset after editing
        } 
        // Add Mode
        else {
          updatedTodos = [...todo, { id: new Date().getTime(), text: todoElement, isChecked: false }];
        }

        if (typeof window !== 'undefined' && localStorage) {
          localStorage.setItem('todo', JSON.stringify(updatedTodos));
          settodoList(updatedTodos);
        }
        settodoElement('');
      }
    }
  };

  // Toggle todo completion status  local storage and state
  const handelTodoCheckBox = (e, todo) => {
    const { id } = todo;
    const newArr = todoList.map(td => td.id === id ? { ...td, isChecked: !td.isChecked } : td);
    settodoList(newArr);
    localStorage.setItem('todo', JSON.stringify(newArr));
  };

  // Remove a todo local storage and state
  const handleRemove = (e, todo) => {
    const { id } = todo;
    const newArr = todoList.filter(td => td.id !== id);
    settodoList(newArr);
    localStorage.setItem('todo', JSON.stringify(newArr));
  };

  // Edit a todo from  local storage and state
  const handleEdit = (todo) => {
    settodoElement(todo.text);
    setEditTodoId(todo.id);
  };

  return (
    <div className="container h-screen border">
      <h1 className="text-center p-2">Todo App</h1>

      <div className="w-full p-10 border">
        <input 
          type="text" 
          value={todoElement} 
          onChange={e => settodoElement(e.target.value)} 
          className="border w-full p-2"
          placeholder="Enter Task !" 
          onKeyPress={handelAddTodo} 
          autoFocus ={true}
        />

        <div className="mt-2">
          {todoList.length > 0 && todoList.map((todo, ind) => (
            <div className="flex pl-2 items-center border borde-b mb-2 border-pink-500" key={todo.id}>
              <input 
                type="checkbox" 
                checked={todo.isChecked} 
                onChange={(e) => handelTodoCheckBox(e, todo)}  
                 className="mr-2 h-6 w-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <p style={{ textDecoration: todo.isChecked ? "line-through" : "none" }}>
                {todo.text}
              </p>

             <div className="ml-auto">
             &nbsp;
              <button className="p-2 ml-2 " onClick={() => handleEdit(todo)}>Edit</button>
              &nbsp;
              <button className="p-2 ml-2  " onClick={(e) => handleRemove(e, todo)}>X</button>
             </div>
            </div>
          ))}
          {todoList.length === 0 && <p>Please add some tasks</p>}
        </div>
      </div>
    </div>
  );
}
