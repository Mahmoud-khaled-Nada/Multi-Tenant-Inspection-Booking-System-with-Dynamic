# Multi-Tenant Inspection Booking System Documentation

## Overview

This is a multi-tenant inspection booking system that allows different organizations (tenants) to manage their inspection teams and bookings. The system provides:

- Multi-tenant architecture
- Team management with availability scheduling
- Dynamic booking system
- RESTful API for all operations

## System Requirements

- Docker and Docker Compose
- Git
- Composer (for local development)
- Node.js and NPM (for frontend development)

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd Multi-Tenant-Inspection-Booking-System-with-Dynamic
```

2. Build the Docker containers:
```bash
./vendor/bin/sail build --no-cache
```

3. Start the application:
```bash
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate
./vendor/bin/sail artisan db:seed
./vendor/bin/sail artisan optimize:clear
```

4. Install dependencies and run migrations:
```bash
./vendor/bin/sail composer install
./vendor/bin/sail artisan migrate
```

5. The application will be available at:
   - API: http://localhost:8000
   - Frontend: http://localhost:3000 (if applicable)

## Docker Commands Reference

- Start containers: `./vendor/bin/sail up -d`
- Stop containers: `./vendor/bin/sail down`
- View logs: `./vendor/bin/sail logs -f`
- Access shell: `./vendor/bin/sail shell`
- Run artisan commands: `./vendor/bin/sail artisan <command>`
- Run composer commands: `./vendor/bin/sail composer <command>`

## Environment Setup

1. Copy the environment file:
```bash
cp .env.example .env
```

2. Generate application key:
```bash
./vendor/bin/sail artisan key:generate
```

3. Configure your database settings in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=inspection_booking
DB_USERNAME=sail
DB_PASSWORD=password
```

## API Documentation

The complete API documentation is available in the [API Documentation](./api/README.md) file.

## Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Run tests: `./vendor/bin/sail artisan test`
4. Submit a pull request

## Testing

Run the test suite:
```bash
./vendor/bin/sail artisan test
```

## Troubleshooting

### Common Issues

1. **Container Build Issues**
   - Try rebuilding with no cache: `./vendor/bin/sail build --no-cache`
   - Check Docker logs: `docker-compose logs`

2. **Database Connection Issues**
   - Ensure MySQL container is running: `./vendor/bin/sail ps`
   - Check database credentials in `.env`
   - Try restarting containers: `./vendor/bin/sail down && ./vendor/bin/sail up -d`

3. **Permission Issues**
   - Ensure proper permissions on storage and bootstrap/cache directories:
   ```bash
   ./vendor/bin/sail artisan storage:link
   chmod -R 775 storage bootstrap/cache
   ```

## Support

For support, please:
1. Check the documentation
2. Review existing issues
3. Create a new issue if needed

## License

[Your License Information] 