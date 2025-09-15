import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

jest.mock('../views/Dashboard', () => () => <div>Dashboard Page</div>);
jest.mock('../views/MoviesList', () => () => <div>Movies List Page</div>);

describe('App routing', () => {
  it('deve exibir a Dashboard por padrão na rota "/"', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
    );

    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
  });

  it('deve exibir MoviesList na rota "/list"', () => {
    render(
        <MemoryRouter initialEntries={['/list']}>
          <App />
        </MemoryRouter>
    );

    expect(screen.getByText(/Movies List Page/i)).toBeInTheDocument();
  });

  it('deve conter links para Dashboard e List', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
    );

    const dashboardLink = screen.getByText('Dashboard');
    const listLink = screen.getByText('List');

    expect(dashboardLink).toBeInTheDocument();
    expect(listLink).toBeInTheDocument();
  });

  it('deve manter layout com sidebar visível', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
    );

    expect(screen.getByText('Frontend Test')).toBeInTheDocument();
  });
});
