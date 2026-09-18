import React from "react"

const TodoItem = ({todo}) =>{
    return (
        <li>
            {todo.title} {todo.completed}
            <button> Delete </button>

        </li>

    )

}


export default TodoItem
