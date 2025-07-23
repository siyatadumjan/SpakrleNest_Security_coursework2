import '@testing-library/jest-dom';
import { fireEvent, render, screen,waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { registerUserApi } from '../../apis/Api'; // Adjust the path as necessary
import Register from './Register';


// Mock the API call
jest.mock('../../apis/Api', () => ({
    registerUserApi: jest.fn(),
}));

describe('Register Component', () => {
    beforeEach(() => {
        // Clear local storage before each test
        localStorage.clear();
    });

    test('renders registration form', () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
        // expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Phone/i)).toBeInTheDocument();
        // expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm password/i)).toBeInTheDocument();
        // expect(screen.getByText(/sign up/i)).toBeInTheDocument();
    });

    test('displays validation errors when form is submitted with empty fields', async () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        // Get the submit button
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        // Click the submit button
        fireEvent.click(submitButton);

        // Check if the validation error messages are displayed
        expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Phone number is required/i)).toBeInTheDocument();
        // expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Confirm Password is required/i)).toBeInTheDocument();
    });

    test('displays error when passwords do not match', async () => {
        render(
            <Router>
                <Register />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'JohnDoe' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'johndoe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/phone/i), { target: { value: '1234567890' } });
        // fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'differentPassword' } });

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });
    test('submits the form and displays success message on successful registration', async () => {
        registerUserApi.mockResolvedValueOnce({ data: { message: 'Registration successful!' } });

        render(
            <Router>
                <Register />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'JohnDoe' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'johndoe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/phone/i), { target: { value: '1234567890' } });
        // fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });

        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Registration successful! Please login to continue./i)).toBeInTheDocument();
        });
    });

    test('displays error message on registration failure', async () => {
        registerUserApi.mockRejectedValueOnce({
            response: { data: { message: 'Registration failed. Please try again.' } },
        });
    
        render(
            <Router>
                <Register />
            </Router>
        );
    
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'JohnDoe' } });
        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'johndoe@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/phone/i), { target: { value: '1234567890' } });
        // fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });
    
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.click(submitButton);
    
        // Use a custom matcher function if needed
        await waitFor(() => {
            expect(screen.getByText((content, element) => 
                content.includes('Registration failed. Please try again.')
            )).toBeInTheDocument();
        });
    });

    
    

    
});
