# Rooney Mugacha - Personal Portfolio

This is a personal portfolio and blog built with **Next.js**, showcasing my work in software engineering, security research, and CTFs.

## Features

- **Static Markdown CMS**: All projects, CTF writeups, and engineering notes are powered by local Markdown files.
- **Dynamic CTF Stats**: Automatically calculates the number of machines owned and CTF events participated in based on the `type` metadata in the Markdown files.
- **Dark/Light Mode**: Full theme toggle support.
- **Responsive Design**: Clean and fast UI that looks great on all devices.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Managing Content

To add new projects, CTFs, or notes, simply create a new Markdown (`.md`) file in the respective folder inside `content/`:
- `content/work/` for selected projects
- `content/ctf/` for CTF writeups and machines
- `content/notes/` for engineering notes

The site will automatically parse the frontmatter and update the UI!
