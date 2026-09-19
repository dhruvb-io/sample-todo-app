import React from "react"

import { render, fireEvent, screen, cleanup} from "@testing-library/react"
import TodoItem from "../../components/TodoItem"

afterEach(()=>{
    cleanup();
    jest.resetAllMocks();
})

describe("Testing the Todo Item component", () => {
    const mockTodo = { _id: "1", title: "New Todo", completed: false }

    test("renders the todo title", () => {
        render(
            <table>
                <tbody>
                    <TodoItem todo={mockTodo} onDelete={jest.fn()} />
                </tbody>
            </table>
        )

        expect(screen.getByText("New Todo")).toBeInTheDocument()
    })

    test("calls onDelete with the todo id when delete is clicked", () => {
        const onDelete = jest.fn()

        render(
            <table>
                <tbody>
                    <TodoItem todo={mockTodo} onDelete={onDelete} />
                </tbody>
            </table>
        )

        fireEvent.click(screen.getByRole("button", { name: /delete/i }))

        expect(onDelete).toHaveBeenCalledWith("1")
    })
})