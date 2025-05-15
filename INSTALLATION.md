Enjoy

### HaloStream Setup Guide

#### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org/).

#### 2. Update `index.html`
- Open the `index.html` file.
- Replace `https://www.yourwebsite.com` with your actual website URL.
- Open ./src/components/Navbar.tsx and head to line 52, replace `HaloStream` with your actual site name.

#### 3. Run the Development Server
1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

#### 4. Build the Project
1. Install dependencies (if not already done):
   ```
   npm install
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Copy the files from the `dist` folder to your web server.

#### 5. Configure Single Page Application (SPA)
Configure your web server to serve the SPA correctly.

##### For Apache:
Add the following to your `.htaccess` file:
```
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Redirect everything to index.html except for actual files or directories
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
</IfModule>
```

##### For Nginx:
Add the following to your `vhosts` configuration:
```
location / {
    # Serve index.html for all routes except actual files or directories
    try_files $uri /index.html;
}
```