# Templates App Integration Configuration

## Environment Variables Required

Add these environment variables to your main portfolio app:

```bash
# JWT Secret (used for both main app auth and templates app communication)
JWT_SECRET=your-super-secret-jwt-key-here

# Templates App Configuration
TEMPLATES_BASE_URL=https://portumet.vercel.app
SHARED_JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Disable remote templates (set to "false" to disable)
REMOTE_TEMPLATES_ENABLED=true
```

## Templates App Environment Variables

Make sure your templates app (https://portumet.vercel.app) has these environment variables:

```bash
# Required - must match your main app's JWT_SECRET
SHARED_JWT_SECRET=your-super-secret-jwt-key-here

# Optional
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app
```

## How It Works

1. **Main App** fetches portfolio data from database
2. **Main App** creates JWT token with `scope: "render"`
3. **Main App** sends portfolio data to Templates App via `/api/render`
4. **Templates App** validates JWT and renders portfolio HTML
5. **Main App** displays the rendered HTML

## API Endpoints

### Main App
- `GET /api/render-portfolio?username=<username>` - Renders portfolio using templates app
- `GET /api/portfolio/render/[username]` - Legacy render endpoint (still works)

### Templates App
- `POST /api/render` - Main rendering endpoint
- `GET /api/templates/manifest` - List available templates

## Testing

Test the integration by visiting a portfolio URL like:
- `https://portume.vercel.app/your-username`

The app will automatically try to use the templates app for rendering, and fall back to local rendering if it fails.

## Troubleshooting

1. **JWT Verification Failed**: Ensure `SHARED_JWT_SECRET` matches between both apps
2. **Template Not Found**: Check that the template ID exists in the templates app
3. **Network Errors**: Verify the `TEMPLATES_BASE_URL` is correct and accessible
4. **Data Validation Error**: Ensure portfolio data matches the expected schema

## Security

- JWT tokens expire after 5 minutes
- Only requests with valid JWT tokens are processed
- Templates app is stateless and doesn't store any data
