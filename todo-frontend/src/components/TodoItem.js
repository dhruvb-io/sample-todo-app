import React from "react"

const TodoItem = ({ todo, onDelete }) => {
    return (
        <tr>
            <td>{todo.title}</td>
            <td>
                <button type="button" onClick={() => onDelete(todo._id)}>
                    Delete
                </button>
            </td>
        </tr>
    )
}

export default TodoItem
