// src/pages/admin/dashboard/AdminDashboard.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminDashboard from './AdminDashboard'; // Adjust the import path as needed
import * as Api from '../../../apis/Api'; // Adjust the import path as needed

// Mock the API functions
jest.mock('../../../apis/Api', () => ({
    createProductApi: jest.fn(),
    deleteProductApi: jest.fn(),
    getAllProductsApi: jest.fn(), // Add other API mocks as needed
}));

test('submits the form successfully', async () => {
    // Mock API responses
    Api.createProductApi.mockResolvedValue({
        data: {
            success: true,
            message: 'Product created successfully',
            data: {
                _id: '1',
                productName: 'Test Product',
                productPrice: '10',
                productCategory: 'Test Category',
                productSkinType: 'Normal',
                productDescription: 'Test Description',
                productQuantity: '10',
                productImage: 'test-image.jpg',
            },
        },
    });

    // Render the component
    render(<AdminDashboard />);

    // Simulate form input and submission
    fireEvent.change(screen.getByPlaceholderText('Enter Product Name'), { target: { value: 'Test Product' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Product Price'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Description'), { target: { value: 'Test Description' } });
    fireEvent.change(screen.getByPlaceholderText('Enter Product Quantity'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Product Category'), { target: { value: 'Test Category' } });
    fireEvent.change(screen.getByLabelText('Skin Type'), { target: { value: 'Normal' } });
    fireEvent.change(screen.getByLabelText('Product Image'), { target: { files: [new File([''], 'test-image.jpg')] } });
    fireEvent.click(screen.getByText('Create Product'));

    // Assert that the toast message is shown
    await waitFor(() => expect(screen.getByText('Product created successfully')).toBeInTheDocument());
});


test('deletes a product', async () => {
    // Mock API responses
    Api.deleteProductApi.mockResolvedValue({
        data: {
            success: true,
            message: 'Product deleted successfully',
        },
    });

    // Render the component
    render(<AdminDashboard />);

    // Simulate clicking the delete button
    fireEvent.click(screen.getByTestId('delete-button-1')); // Ensure you have a data-testid="delete-button-1" in your component for the delete button

    // Assert that the toast message is shown
    await waitFor(() => expect(screen.getByText('Product deleted successfully')).toBeInTheDocument());
});

