# Biotools - Bioinformatics Sequence Processing Toolkit

A cross-platform bioinformatics sequence processing toolkit supporting multiple clients with a unified backend API.

[中文](README.md) | **English**

## Project Structure

```
biotools/
├── backend/                 # FastAPI backend
├── web-app/                # React Web application
├── utools-plugin/          # uTools plugin
├── raycast_biotools/       # Raycast extension
└── shared/                 # Shared type definitions and utilities
```

## Features

### Basic Sequence Processing
- ✅ Reverse complement
- ✅ Case conversion (uppercase/lowercase)
- ✅ DNA/RNA transcription and reverse transcription
- ✅ Protein translation
- ✅ Sequence statistics and length calculation

### Advanced Features (Planned)
- 🔄 Primer design
- 🔄 gRNA design
- 🔄 Sequence alignment
- 🔄 Restriction enzyme analysis

## Tech Stack

- **Backend**: FastAPI + Biopython + Docker
- **Web**: React + TypeScript + Tailwind CSS + i18n
- **Raycast**: TypeScript
- **uTools**: HTML/CSS/JavaScript

## Development Status

- ✅ Raycast Extension - Basic features completed
- ✅ Backend API - Core functionality completed with i18n support
- ✅ Web Application - Completed with full internationalization
- ✅ uTools Plugin - Basic features completed
- ❌ Mini Program - Cancelled

## Quick Start

### Backend Development
```bash
cd backend
pixi install
pixi run python main.py
```

### Web Application Development
```bash
cd web-app
npm install
npm start
```

### Docker Deployment
```bash
docker-compose up -d
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Internationalization

The project supports both English and Chinese:
- **Backend**: Uses Python gettext for API responses
- **Frontend**: Uses react-i18next for UI translations
- **Language Detection**: Automatic detection with manual switching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Platforms

- **Web Application**: Modern browsers with responsive design
- **Raycast Extension**: macOS productivity tool integration
- **uTools Plugin**: Cross-platform quick launcher integration

## Repository

GitHub: [https://github.com/luxiangze/Biotools](https://github.com/luxiangze/Biotools)
