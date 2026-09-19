import React from "react"

import { render, fireEvent, screen, cleanup, waitFor } from "@testing-library/react"
import TodoList from "../../components/TodoList"
import BACKEND_URL from "../../config/config"

afterEach(() => {
    cleanup();
    jest.resetAllMocks();
})

global.fetch = jest.fn();

describe("Todo list component", () => {
    test("Fetch the todos and render them", async () => {
        const mockTodo = [
            { _id: "1", title: "Todo 1", completed: false },
            { _id: "2", title: "Todo 2", completed: false }
        ]

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodo
        })

        render(<TodoList />)

        await waitFor(() => {
            expect(screen.getByText("Todo 1")).toBeInTheDocument()
            expect(screen.getByText("Todo 2")).toBeInTheDocument()
        })

        expect(fetch).toHaveBeenCalledWith(`${BACKEND_URL}/get-todos`)
    })

    test("Add a new Todo", async () => {
        const newTodo = { _id: "1", title: "New Todo", completed: false }

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => newTodo
        })

        render(<TodoList />)

        const input = screen.getByPlaceholderText("Add a new Todo")
        const button = screen.getByRole("button", { name: "Add Todo" })

        fireEvent.change(input, { target: { value: "New Todo" } })
        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText("New Todo")).toBeInTheDocument()
        })

        expect(fetch).toHaveBeenNthCalledWith(2, `${BACKEND_URL}/add-todo`, expect.objectContaining({
            method: "POST"
        }))
    })

    test("Delete an existing todo", async () => {
        const mockTodo = [
            { _id: "1", title: "Todo 1", completed: false },
            { _id: "2", title: "Todo 2", completed: false }
        ]

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodo
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => mockTodo[0]
        })

        render(<TodoList />)

        await waitFor(() => {
            expect(screen.getByText("Todo 1")).toBeInTheDocument()
        })

        fireEvent.click(screen.getAllByRole("button", { name: /delete/i })[0])

        await waitFor(() => {
            expect(screen.queryByText("Todo 1")).not.toBeInTheDocument()
        })

        expect(fetch).toHaveBeenNthCalledWith(2, `${BACKEND_URL}/delete-todo/1`, {
            method: "DELETE"
        })
    })
})