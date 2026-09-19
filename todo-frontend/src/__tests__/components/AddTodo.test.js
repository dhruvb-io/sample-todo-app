import React from "react"

import {render, fireEvent, screen, cleanup} from "@testing-library/react"
import AddTodo from "../../components/AddTodo"

afterEach(()=>{
    cleanup();
    jest.resetAllMocks();
})

describe("Testing the Add Todo component", ()=>{
    test("Render the input filed and add button", ()=>{
        render(<AddTodo onAdd={() =>{}}/>)
        expect(screen.getByPlaceholderText("Add a new Todo")).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Add Todo"})).toBeInTheDocument();

    })

    test("When form is submitted, the onAdd function to be invoked", () =>{
        const mockOnAdd = jest.fn();
        render(<AddTodo onAdd={mockOnAdd}/>)

        const input = screen.getByPlaceholderText("Add a new Todo");
        const button = screen.getByRole("button", {name: "Add Todo"});

        fireEvent.change(input, {target:{value: "New Todo"}});
        fireEvent.click(button);

        expect(mockOnAdd).toHaveBeenCalledWith("New Todo");
    })

    test("When form is submitted, the input value gets cleared", () => {
        const mockOnAdd = jest.fn();
        render(<AddTodo onAdd={mockOnAdd} />)

        const input = screen.getByPlaceholderText("Add a new Todo");
        const button = screen.getByRole("button", {name: "Add Todo"});

        fireEvent.change(input, { target: { value: "Clear me" } });
        fireEvent.click(button);

        expect(mockOnAdd).toHaveBeenCalledWith("Clear me");
        expect(input).toHaveValue("");
    })
})