import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { loginUserApi } from '../../apis/Api';
import Login from './Login';

// Mock the API call
jest.mock('../../apis/Api', () => ({
    loginUserApi: jest.fn(),
}));

describe('Login Component', () => {
    beforeEach(() => {
        // Clear local storage before each test
        localStorage.clear();
    });

    test('renders login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getAllByText(/login/i)).toHaveLength(3); // Assuming you have three elements with text "Login"
    });

    test('displays validation errors when form is submitted with empty fields', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        const loginButtons = screen.getAllByText(/login/i);
        fireEvent.click(loginButtons[loginButtons.length - 1]); // Assuming the last "Login" is the button

        expect(await screen.findByText(/email is empty or invalid/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is empty/i)).toBeInTheDocument();
    });

    test('calls loginUserApi with correct credentials when form is submitted', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });

        const loginButtons = screen.getAllByText(/login/i);
        fireEvent.click(loginButtons[loginButtons.length - 1]); // Assuming the last "Login" is the button

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBe('fake-token');
        });
    });
    test('displays error message when login fails', async () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpassword' } });

        const loginButtons = screen.getAllByText(/login/i);
        fireEvent.click(loginButtons[loginButtons.length - 1]); // Assuming the last "Login" is the button

        expect(await screen.findAllByText(/An error occurred. Please try again./i)).toBeInTheDocument();
    });

    
});
