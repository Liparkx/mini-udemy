import { render, screen } from '@testing-library/react';
import InstructorDashboard from './page';

// Mock dependências externas
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/lib/api', () => ({
  fetchApi: jest.fn().mockResolvedValue([]),
}));

describe('InstructorDashboard', () => {
  test('deve renderizar o título principal do dashboard', () => {
    // Renderiza o componente no ambiente de teste virtual (jsdom)
    render(<InstructorDashboard />);

    // Procura por um elemento de texto específico na tela
    const titleElement = screen.getByText('Manage your courses and create new content for your students.');

    const titleElement2 = screen.getByText('+ Create New Course');

    // Asserção: espera que o elemento esteja no documento
    expect(titleElement).toBeInTheDocument();
    expect(titleElement2).toBeInTheDocument();
  });
});
