import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from './ContactSection';

// Mock Lucide icons to prevent SVG rendering issues in tests
jest.mock('lucide-react', () => ({
  Mail: () => <div data-testid="icon-mail" />,
  Github: () => <div data-testid="icon-github" />,
  Linkedin: () => <div data-testid="icon-linkedin" />,
  Instagram: () => <div data-testid="icon-instagram" />,
  Send: () => <div data-testid="icon-send" />,
  CheckCircle2: () => <div data-testid="icon-check" />,
  MapPin: () => <div data-testid="icon-map" />,
  Terminal: () => <div data-testid="icon-terminal" />,
  AlertCircle: () => <div data-testid="icon-alert" />,
  ArrowUpRight: () => <div data-testid="icon-arrow" />
}));

describe('ContactSection', () => {
  const mockPreviewContact = {
    email: 'test@example.com',
    location: 'Test Location',
    availability: 'Available',
    github: 'https://github.com/test',
    linkedin: 'https://linkedin.com/in/test',
    instagram: 'https://instagram.com/test',
    quickMemo: 'Test memo'
  };

  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('displays network error message when fetch fails', async () => {
    const user = userEvent.setup();

    // Mock a network failure (fetch throws)
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    render(<ContactSection previewContact={mockPreviewContact} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/Nama \/ Instansi \*/i), 'Test User');
    await user.type(screen.getByLabelText(/Alamat Email \*/i), 'user@test.com');
    await user.type(screen.getByLabelText(/Isi Memo \/ Detail Pesan \*/i), 'This is a test message');

    // Submit form
    await user.click(screen.getByRole('button', { name: /DISPATCH MEMO SEKARANG/i }));

    // Wait for the error state to appear
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan koneksi jaringan.')).toBeInTheDocument();
    });
  });

  it('displays API error message when submission fails gracefully', async () => {
    const user = userEvent.setup();

    // Mock an API failure (response not ok)
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Custom server error' })
    });

    render(<ContactSection previewContact={mockPreviewContact} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/Nama \/ Instansi \*/i), 'Test User');
    await user.type(screen.getByLabelText(/Alamat Email \*/i), 'user@test.com');
    await user.type(screen.getByLabelText(/Isi Memo \/ Detail Pesan \*/i), 'This is a test message');

    // Submit form
    await user.click(screen.getByRole('button', { name: /DISPATCH MEMO SEKARANG/i }));

    // Wait for the specific API error state to appear
    await waitFor(() => {
      expect(screen.getByText('Custom server error')).toBeInTheDocument();
    });
  });

  it('displays success message on successful submission', async () => {
    const user = userEvent.setup();

    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<ContactSection previewContact={mockPreviewContact} />);

    // Fill out the form
    await user.type(screen.getByLabelText(/Nama \/ Instansi \*/i), 'Test User');
    await user.type(screen.getByLabelText(/Alamat Email \*/i), 'user@test.com');
    await user.type(screen.getByLabelText(/Isi Memo \/ Detail Pesan \*/i), 'This is a test message');

    // Submit form
    await user.click(screen.getByRole('button', { name: /DISPATCH MEMO SEKARANG/i }));

    // Wait for the success state to appear
    await waitFor(() => {
      expect(screen.getByText('TRANSMISI BERHASIL DICATAT')).toBeInTheDocument();
    });
  });
});
