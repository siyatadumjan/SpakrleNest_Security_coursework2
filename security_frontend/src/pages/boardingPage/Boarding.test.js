import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BoardingPage from './Boardingpage'; // Adjust the path as necessary

test('renders BoardingPage with expected elements', () => {
    render(
        <Router>
            <BoardingPage />
        </Router>
    );

    // Check if the title is rendered
    expect(screen.getByText(/welcome to our service/i)).toBeInTheDocument();

    // Check if the subtitle is rendered
    expect(screen.getByText(/get started with us today!/i)).toBeInTheDocument();

    // Check if the Login button is rendered
    const loginButton = screen.getByRole('link', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('href', '/login');

    // Check if the Sign Up button is rendered
    const signUpButton = screen.getByRole('link', { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute('href', '/register');
});
