import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from '@/components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faJira, faConfluence } from '@fortawesome/free-brands-svg-icons';

describe('Navbar component', () => {
  it('renders the Navbar with GitHub, Jira, and Confluence links', () => {
    render(<Navbar />);

    // Verifica che tutti i link esterni siano presenti
    const githubLink = screen.getByRole('link', { name: /GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://docs.github.com/en');

    const jiraLink = screen.getByRole('link', { name: /Jira/i });
    expect(jiraLink).toBeInTheDocument();
    expect(jiraLink).toHaveAttribute('href', 'https://confluence.atlassian.com/jira');

    const confluenceLink = screen.getByRole('link', { name: /Confluence/i });
    expect(confluenceLink).toBeInTheDocument();
    expect(confluenceLink).toHaveAttribute('href', 'https://support.atlassian.com/confluence-cloud/resources/');

    // Verifica che le icone di FontAwesome siano presenti
    const githubIcon = screen.getByTestId('github-icon');
    expect(githubIcon).toBeInTheDocument();

    const jiraIcon = screen.getByTestId('jira-icon');
    expect(jiraIcon).toBeInTheDocument();

    const confluenceIcon = screen.getByTestId('confluence-icon');
    expect(confluenceIcon).toBeInTheDocument();
  });

  it('renders the theme switcher', () => {
    render(<Navbar />);
    
    // Verifica che il componente Switch sia presente nel Navbar
    const themeSwitcher = screen.getByTestId('theme-switcher');
    expect(themeSwitcher).toBeInTheDocument();
  });
});
